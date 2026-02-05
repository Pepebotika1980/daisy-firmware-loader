// Referencias a elementos del DOM
const connectionStatus = document.getElementById('connectionStatus');
const connectionSubtext = document.getElementById('connectionSubtext');
const connectionDot = document.getElementById('connectionDot');
const refreshBtn = document.getElementById('refreshBtn');
const firmwarePathInput = document.getElementById('firmwarePath');
const selectFileBtn = document.getElementById('selectFileBtn');
const flashBtn = document.getElementById('flashBtn');
const logOutput = document.getElementById('logOutput');
const clearLogsBtn = document.getElementById('clearLogsBtn');
const instructions = document.getElementById('instructions');
const progressSection = document.getElementById('progressSection');
const progressBar = document.getElementById('progressBar');
const progressPercent = document.getElementById('progressPercent');
const progressTitle = document.getElementById('progressTitle');
const resultSection = document.getElementById('resultSection');
const resultTitle = document.getElementById('resultTitle');
const resultMessage = document.getElementById('resultMessage');
const resultBanner = document.getElementById('resultBanner');

let firmwarePath = '';
let isFlashing = false;

// Inicialización
document.addEventListener('DOMContentLoaded', async () => {
    updateView();
});

// Seleccionar archivo
selectFileBtn.addEventListener('click', async () => {
    const result = await window.electronAPI.selectFirmware();
    if (result.success) {
        firmwarePath = result.path;
        firmwarePathInput.value = firmwarePath.split('/').pop();
        updateView();
    }
});

// Iniciar Carga
flashBtn.addEventListener('click', async () => {
    if (!firmwarePath || isFlashing) return;

    // Resetear UI para nueva carga
    isFlashing = true;
    updateView();

    // Preparar progreso
    progressSection.classList.remove('hidden');
    resultSection.classList.add('hidden');
    progressBar.style.width = '0%';
    progressPercent.innerText = '0%';
    progressTitle.innerText = 'Iniciando carga...';

    logOutput.innerHTML += `🚀 Iniciando carga de ${firmwarePath}\n`;

    try {
        const result = await window.electronAPI.flashFirmware(firmwarePath);

        isFlashing = false;
        if (result.success) {
            handleFlashSuccess();
        } else {
            handleFlashError(result.error || result.output);
        }
    } catch (error) {
        isFlashing = false;
        handleFlashError(error.message);
    }

    updateView();
});

// Refrescar conexión manualmente
refreshBtn.addEventListener('click', async () => {
    await window.electronAPI.refreshConnection();
});

// Limpiar logs
clearLogsBtn.addEventListener('click', () => {
    logOutput.innerHTML = '';
});

// Escuchar cambios de conexión
window.electronAPI.onDaisyConnected((isConnected) => {
    if (isConnected) {
        connectionStatus.innerText = 'Daisy Conectada';
        connectionSubtext.innerText = 'Lista para cargar firmware';
        connectionDot.className = 'dot connected';
        instructions.classList.add('hidden');
    } else {
        connectionStatus.innerText = 'Buscando Daisy...';
        connectionSubtext.innerText = 'Conecta tu placa en modo DFU';
        connectionDot.className = 'dot disconnected';
        if (!isFlashing) {
            instructions.classList.remove('hidden');
        }
    }
    updateView();
});

// Escuchar progreso del flash
window.electronAPI.onFlashProgress((data) => {
    // Añadir al log técnico
    logOutput.innerHTML += data;
    logOutput.scrollTop = logOutput.scrollHeight;

    // Intentar extraer porcentaje de dfu-util (formato: 45%)
    const percentMatch = data.match(/(\d+)%/);
    if (percentMatch) {
        const percent = percentMatch[1];
        progressBar.style.width = `${percent}%`;
        progressPercent.innerText = `${percent}%`;
        progressTitle.innerText = 'Transfiriendo firmware...';
    }

    // Detectar fases finales
    if (data.includes('Download done')) {
        progressBar.style.width = '100%';
        progressPercent.innerText = '100%';
        progressTitle.innerText = 'Verificando y finalizando...';
    }
});

function handleFlashSuccess() {
    progressSection.classList.add('hidden');
    resultSection.classList.remove('hidden');
    resultBanner.className = 'result-banner success';
    resultTitle.innerText = '¡Carga Exitosa!';
    resultMessage.innerText = 'El firmware se ha instalado y la Daisy se está reiniciando.';

    logOutput.innerHTML += '\n✅ PROCESO FINALIZADO CON ÉXITO\n';
}

function handleFlashError(error) {
    progressSection.classList.add('hidden');
    resultSection.classList.remove('hidden');
    resultBanner.className = 'result-banner error';
    resultTitle.innerText = 'Error en la carga';
    resultMessage.innerText = 'No se pudo completar la operación. Revisa los detalles técnicos.';

    logOutput.innerHTML += `\n❌ ERROR: ${error}\n`;
}

function updateView() {
    const isConnected = connectionDot.classList.contains('connected');

    // El botón de flash solo se activa si hay conexión y archivo seleccionado
    flashBtn.disabled = !isConnected || !firmwarePath || isFlashing;

    // Si estamos cargando, deshabilitamos el selector
    selectFileBtn.disabled = isFlashing;

    if (isFlashing) {
        flashBtn.innerText = 'Cargando...';
    } else {
        flashBtn.innerText = 'Iniciar Carga';
    }
}
