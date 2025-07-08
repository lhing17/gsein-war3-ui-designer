const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  // 文件保存相关
  saveJass: (data) => ipcRenderer.invoke('save-jass', data),
  convertPngToTga: (data) => ipcRenderer.invoke('convert-png-to-tga', data),
  
  // 配置相关
  getConfig: () => ipcRenderer.invoke('get-config'),
  saveConfig: (config) => ipcRenderer.invoke('save-config', config),
  selectJassPath: () => ipcRenderer.invoke('select-jass-path'),
  selectTgaFolder: () => ipcRenderer.invoke('select-tga-folder')
});
