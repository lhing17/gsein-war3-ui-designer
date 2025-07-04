import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('api', {
  saveJass: (payload) => ipcRenderer.invoke('save-jass', payload)
});
