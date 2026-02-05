const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const { exec } = require('child_process');

let mainWindow;
let connectionCheckInterval;
let lastConnectionState = false;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 650,
    minWidth: 600,
    minHeight: 500,
    resizable: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#1a1a2e'
  });

  mainWindow.loadFile('index.html');

  // Abrir DevTools para debugging (solo en desarrollo)
  // mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow();

  // Verificar conexión inicial
  checkDaisyConnection();

  // Iniciar polling cada 2 segundos para detectar cambios
  connectionCheckInterval = setInterval(() => {
    checkDaisyConnection();
  }, 2000);
});

app.on('window-all-closed', () => {
  // Limpiar el intervalo
  if (connectionCheckInterval) {
    clearInterval(connectionCheckInterval);
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Verificar si Daisy está conectado
function checkDaisyConnection() {
  exec('system_profiler SPUSBDataType -json', (error, stdout) => {
    if (error) {
      if (lastConnectionState !== false) {
        lastConnectionState = false;
        mainWindow.webContents.send('daisy-connected', false);
      }
      return;
    }

    try {
      const usbData = JSON.parse(stdout);
      let isDaisyConnected = false;

      // Buscar dispositivo DFU en la lista USB
      const searchForDFU = (items) => {
        if (!items) return false;
        for (const item of items) {
          if (item.vendor_id && item.vendor_id.includes('0x0483') &&
            item.product_id && item.product_id.includes('0xdf11')) {
            return true;
          }
          if (item._items && searchForDFU(item._items)) {
            return true;
          }
        }
        return false;
      };

      if (usbData.SPUSBDataType) {
        isDaisyConnected = searchForDFU(usbData.SPUSBDataType);
      }

      // Solo notificar si el estado cambió
      if (isDaisyConnected !== lastConnectionState) {
        lastConnectionState = isDaisyConnected;
        mainWindow.webContents.send('daisy-connected', isDaisyConnected);
      }
    } catch (e) {
      if (lastConnectionState !== false) {
        lastConnectionState = false;
        mainWindow.webContents.send('daisy-connected', false);
      }
    }
  });
}

// Verificar si dfu-util está instalado
ipcMain.handle('check-dfu-util', async () => {
  const fs = require('fs');

  const possiblePaths = [
    // Desarrollo
    path.join(__dirname, 'bin', 'dfu-util'),
    // Producción - extraResources
    path.join(process.resourcesPath, 'bin', 'dfu-util'),
    // Producción - app.asar.unpacked
    path.join(process.resourcesPath, 'app.asar.unpacked', 'bin', 'dfu-util')
  ];

  for (const testPath of possiblePaths) {
    if (fs.existsSync(testPath)) {
      return { installed: true, path: testPath, bundled: true };
    }
  }

  // Fallback: buscar en el sistema
  return new Promise((resolve) => {
    exec('which dfu-util', (error, stdout) => {
      if (error || !stdout.trim()) {
        resolve({ installed: false });
      } else {
        resolve({ installed: true, path: stdout.trim(), bundled: false });
      }
    });
  });
});

// Abrir diálogo para seleccionar archivo
ipcMain.handle('select-firmware', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [
      { name: 'Firmware Files', extensions: ['bin', 'hex'] },
      { name: 'Binary Files', extensions: ['bin'] },
      { name: 'Intel Hex Files', extensions: ['hex'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  });

  if (!result.canceled && result.filePaths.length > 0) {
    return { success: true, path: result.filePaths[0] };
  }
  return { success: false };
});

// Cargar firmware
ipcMain.handle('flash-firmware', async (event, firmwarePath) => {
  try {
    return new Promise((resolve) => {
      const fs = require('fs');
      const intelHex = require('intel-hex');
      let finalPath = firmwarePath;
      let isTempFile = false;

      // Si es un archivo .hex, convertirlo a .bin temporalmente
      if (firmwarePath.toLowerCase().endsWith('.hex')) {
        try {
          mainWindow.webContents.send('flash-progress', `📦 Detectado archivo .hex, convirtiendo a .bin...\n`);
          const hexData = fs.readFileSync(firmwarePath, 'utf8');
          const binData = intelHex.parse(hexData);

          const tempBinPath = path.join(app.getPath('temp'), `temp_daisy_firmware_${Date.now()}.bin`);
          fs.writeFileSync(tempBinPath, binData.data);

          finalPath = tempBinPath;
          isTempFile = true;
          mainWindow.webContents.send('flash-progress', `✅ Conversión completada con éxito\n`);
        } catch (hexError) {
          resolve({
            success: false,
            error: `Error convirtiendo .hex: ${hexError.message}`,
            output: hexError.stack
          });
          return;
        }
      }

      mainWindow.webContents.send('flash-progress', `🔍 Buscando dfu-util...\n`);
      mainWindow.webContents.send('flash-progress', `📁 __dirname: ${__dirname}\n`);
      mainWindow.webContents.send('flash-progress', `📁 process.resourcesPath: ${process.resourcesPath}\n`);

      // Función para encontrar el binario de dfu-util
      const findBinary = (binaryName) => {
        const possiblePaths = [
          // Desarrollo
          path.join(__dirname, 'bin', binaryName),
          // Producción - extraResources (ubicación principal)
          path.join(process.resourcesPath, 'bin', binaryName),
          // Producción - app.asar.unpacked (fallback)
          path.join(process.resourcesPath, 'app.asar.unpacked', 'bin', binaryName)
        ];

        for (const testPath of possiblePaths) {
          if (fs.existsSync(testPath)) {
            mainWindow.webContents.send('flash-progress', `✅ Encontrado ${binaryName} en: ${testPath}\n`);
            return testPath;
          } else {
            mainWindow.webContents.send('flash-progress', `❌ No encontrado en: ${testPath}\n`);
          }
        }

        return null;
      };

      const dfuUtilPath = findBinary('dfu-util');
      const libusbPath = findBinary('libusb-1.0.0.dylib');

      if (!dfuUtilPath) {
        const errorMsg = 'No se encontró dfu-util en ninguna ubicación';
        mainWindow.webContents.send('flash-progress', `❌ ${errorMsg}\n`);

        resolve({
          success: false,
          error: 'dfu-util no encontrado',
          output: errorMsg
        });
        return;
      }

      // Hacer el binario ejecutable
      try {
        fs.chmodSync(dfuUtilPath, 0o755);
        mainWindow.webContents.send('flash-progress', `✅ Permisos de ejecución establecidos\n`);
      } catch (e) {
        mainWindow.webContents.send('flash-progress', `⚠️  No se pudieron cambiar permisos: ${e.message}\n`);
      }

      // Comando dfu-util para Daisy (STM32F7)
      let command;
      if (libusbPath) {
        command = `DYLD_LIBRARY_PATH="${path.dirname(libusbPath)}" "${dfuUtilPath}" -a 0 -s 0x08000000:leave -D "${finalPath}"`;
      } else {
        command = `"${dfuUtilPath}" -a 0 -s 0x08000000:leave -D "${finalPath}"`;
      }

      mainWindow.webContents.send('flash-progress', `\n🚀 Ejecutando comando:\n${command}\n\n`);

      const childProcess = exec(command, (error, stdout, stderr) => {
        const fullOutput = (stdout || '') + (stderr || '');
        const isActuallyFinished = fullOutput.includes('File downloaded successfully') ||
          fullOutput.includes('Download done');

        // Limpiar archivo temporal si existe
        if (isTempFile) {
          try {
            const fs = require('fs');
            fs.unlinkSync(finalPath);
            mainWindow.webContents.send('flash-progress', `\n🧹 Archivo temporal eliminado\n`);
          } catch (e) {
            console.error('Error eliminando temporal:', e);
          }
        }

        if (error && !isActuallyFinished) {
          resolve({
            success: false,
            error: error.message,
            output: fullOutput
          });
          return;
        }

        resolve({
          success: true,
          output: fullOutput
        });
      });

      // Enviar output en tiempo real
      childProcess.stdout.on('data', (data) => {
        mainWindow.webContents.send('flash-progress', data.toString());
      });

      childProcess.stderr.on('data', (data) => {
        mainWindow.webContents.send('flash-progress', data.toString());
      });
    });
  } catch (error) {
    mainWindow.webContents.send('flash-progress', `❌ Error inesperado: ${error.message}\n`);
    mainWindow.webContents.send('flash-progress', `Stack: ${error.stack}\n`);
    return {
      success: false,
      error: error.message,
      output: error.stack
    };
  }
});

// Refrescar estado de conexión
ipcMain.handle('refresh-connection', async () => {
  checkDaisyConnection();
  return { success: true };
});
