// Estado de la aplicación
let isDaisyConnected = false;
let selectedFirmwarePath = null;
let isFlashing = false;

// Elementos del DOM
const connectionDot = document.getElementById('connectionDot');
const connectionStatus = document.getElementById('connectionStatus');
const connectionSubtext = document.getElementById('connectionSubtext');
const refreshBtn = document.getElementById('refreshBtn');
const selectFileBtn = document.getElementById('selectFileBtn');
const firmwarePath = document.getElementById('firmwarePath');
const flashBtn = document.getElementById('flashBtn');
const logSection = document.getElementById('logSection');
const logOutput = document.getElementById('logOutput');
const clearLogsBtn = document.getElementById('clearLogsBtn');
const dfuWarning = document.getElementById('dfuWarning');
const instructions = document.getElementById('instructions');

// Verificar dfu-util al inicio
async function checkDfuUtil() {
    const result = await window.electronAPI.checkDfuUtil();
    if (!result.installed) {
        dfuWarning.classList.remove('hidden');
        flashBtn.disabled = true;
    } else {
        dfuWarning.classList.add('hidden');
        updateFlashButtonState();
    }
}

// Actualizar estado de conexión
function updateConnectionStatus(connected) {
    isDaisyConnected = connected;

    if (connected) {
        connectionDot.className = 'dot connected';
        connectionStatus.textContent = 'Daisy Conectado';
        connectionSubtext.textContent = 'Listo para cargar firmware';
        instructions.classList.add('hidden');
    } else {
        connectionDot.className = 'dot disconnected';
        connectionStatus.textContent = 'Daisy No Conectado';
        connectionSubtext.textContent = 'Conecta tu placa en modo DFU';
        instructions.classList.remove('hidden');
    }

    updateFlashButtonState();
}

// Actualizar estado del botón de flash
function updateFlashButtonState() {
    flashBtn.disabled = !isDaisyConnected || !selectedFirmwarePath || isFlashing;
}

// Agregar línea al log
function addLog(message, type = 'info') {
    const line = document.createElement('div');
    line.className = `log-line ${type}`;
    line.textContent = message;
    logOutput.appendChild(line);
    logOutput.scrollTop = logOutput.scrollHeight;

    if (logSection.classList.contains('hidden')) {
        logSection.classList.remove('hidden');
    }
}

// Limpiar logs
function clearLogs() {
    logOutput.innerHTML = '';
}

// Seleccionar archivo de firmware
async function selectFirmware() {
    const result = await window.electronAPI.selectFirmware();
    if (result.success) {
        selectedFirmwarePath = result.path;
        const fileName = result.path.split('/').pop();
        firmwarePath.value = fileName;
        addLog(`📁 Archivo seleccionado: ${fileName}`, 'info');
        updateFlashButtonState();
    }
}

// Cargar firmware
async function flashFirmware() {
    if (!isDaisyConnected || !selectedFirmwarePath || isFlashing) {
        return;
    }

    isFlashing = true;
    flashBtn.disabled = true;
    connectionDot.className = 'dot flashing';
    connectionStatus.textContent = 'Cargando Firmware...';
    connectionSubtext.textContent = 'No desconectes la placa';

    clearLogs();
    addLog('🚀 Iniciando carga de firmware...', 'info');
    addLog(`📄 Archivo: ${selectedFirmwarePath}`, 'info');
    addLog('⏳ Esto puede tardar unos segundos...', 'info');

    try {
        const result = await window.electronAPI.flashFirmware(selectedFirmwarePath);

        if (result.success) {
            addLog('✅ ¡Firmware cargado exitosamente!', 'success');
            addLog('🎉 Puedes desconectar tu Daisy', 'success');
            connectionStatus.textContent = 'Carga Completada';
            connectionSubtext.textContent = '¡Firmware instalado correctamente!';
        } else {
            addLog('❌ Error al cargar firmware', 'error');
            addLog(`Error: ${result.error}`, 'error');
            if (result.output) {
                addLog(result.output, 'error');
            }
            connectionStatus.textContent = 'Error en la Carga';
            connectionSubtext.textContent = 'Revisa los logs para más detalles';
        }
    } catch (error) {
        addLog('❌ Error inesperado', 'error');
        addLog(error.message, 'error');
    } finally {
        isFlashing = false;
        updateFlashButtonState();

        // Refrescar estado de conexión después de un momento
        setTimeout(() => {
            window.electronAPI.refreshConnection();
        }, 2000);
    }
}

// Refrescar conexión
async function refreshConnection() {
    refreshBtn.style.transform = 'rotate(360deg)';
    await window.electronAPI.refreshConnection();
    setTimeout(() => {
        refreshBtn.style.transform = '';
    }, 500);
}

// Event Listeners
selectFileBtn.addEventListener('click', selectFirmware);
flashBtn.addEventListener('click', flashFirmware);
refreshBtn.addEventListener('click', refreshConnection);
clearLogsBtn.addEventListener('click', clearLogs);

// Escuchar eventos de conexión
window.electronAPI.onDaisyConnected((connected) => {
    updateConnectionStatus(connected);
});

// Escuchar progreso de flash
window.electronAPI.onFlashProgress((data) => {
    // Filtrar líneas vacías
    const lines = data.trim().split('\n').filter(line => line.length > 0);
    lines.forEach(line => {
        if (line.includes('Error') || line.includes('error')) {
            addLog(line, 'error');
        } else if (line.includes('Done') || line.includes('success')) {
            addLog(line, 'success');
        } else {
            addLog(line, 'info');
        }
    });
});

// Inicializar
checkDfuUtil();
