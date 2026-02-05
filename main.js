const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const { exec } = require('child_process');

let mainWindow;
let connectionCheckInterval;
let lastConnectionState = false;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 700,
    height: 600,
    resizable: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#1a1a2e'
  });

  mainWindow.loadFile('index.html');
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
      { name: 'Firmware Binary', extensions: ['bin'] },
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
  return new Promise((resolve) => {
    const fs = require('fs');

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
          console.log(`✅ Encontrado ${binaryName} en: ${testPath}`);
          return testPath;
        } else {
          console.log(`❌ No encontrado en: ${testPath}`);
        }
      }

      return null;
    };

    const dfuUtilPath = findBinary('dfu-util');
    const libusbPath = findBinary('libusb-1.0.0.dylib');

    if (!dfuUtilPath) {
      const errorMsg = 'No se encontró dfu-util. Rutas buscadas:\n' +
        `- ${path.join(__dirname, 'bin', 'dfu-util')}\n` +
        `- ${path.join(process.resourcesPath, 'app.asar.unpacked', 'bin', 'dfu-util')}\n` +
        `- ${path.join(process.resourcesPath, 'bin', 'dfu-util')}`;

      console.error(errorMsg);
      mainWindow.webContents.send('flash-progress', errorMsg);

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
    } catch (e) {
      console.log('No se pudo cambiar permisos (puede ser normal):', e.message);
    }

    // Comando dfu-util para Daisy (STM32F7)
    let command;
    if (libusbPath) {
      command = `DYLD_LIBRARY_PATH="${path.dirname(libusbPath)}" "${dfuUtilPath}" -a 0 -s 0x08000000:leave -D "${firmwarePath}"`;
    } else {
      command = `"${dfuUtilPath}" -a 0 -s 0x08000000:leave -D "${firmwarePath}"`;
    }

    console.log('Ejecutando comando:', command);
    mainWindow.webContents.send('flash-progress', `Ejecutando: ${command}\n`);

    const process = exec(command, (error, stdout, stderr) => {
      if (error) {
        resolve({
          success: false,
          error: error.message,
          output: stderr || stdout
        });
        return;
      }

      resolve({
        success: true,
        output: stdout
      });
    });

    // Enviar output en tiempo real
    process.stdout.on('data', (data) => {
      mainWindow.webContents.send('flash-progress', data.toString());
    });

    process.stderr.on('data', (data) => {
      mainWindow.webContents.send('flash-progress', data.toString());
    });
  });
});

// Refrescar estado de conexión
ipcMain.handle('refresh-connection', async () => {
  checkDaisyConnection();
  return { success: true };
});
