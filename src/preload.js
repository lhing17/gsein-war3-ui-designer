const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  saveJass: (payload) => ipcRenderer.invoke('save-jass', payload),
  convertPngToTga: (payload) => ipcRenderer.invoke('convert-png-to-tga', payload)
});
