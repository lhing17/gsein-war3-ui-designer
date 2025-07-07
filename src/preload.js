const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  saveJass: (payload) => ipcRenderer.invoke('save-jass', payload)
});
