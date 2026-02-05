const { contextBridge, ipcRenderer } = require('electron');

// Exponer API segura al renderer
contextBridge.exposeInMainWorld('electronAPI', {
    checkDfuUtil: () => ipcRenderer.invoke('check-dfu-util'),
    selectFirmware: () => ipcRenderer.invoke('select-firmware'),
    flashFirmware: (path) => ipcRenderer.invoke('flash-firmware', path),
    refreshConnection: () => ipcRenderer.invoke('refresh-connection'),
    onDaisyConnected: (callback) => ipcRenderer.on('daisy-connected', (event, isConnected) => callback(isConnected)),
    onFlashProgress: (callback) => ipcRenderer.on('flash-progress', (event, data) => callback(data))
});
