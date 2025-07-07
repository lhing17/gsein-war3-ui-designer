// src/main.js
const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false
    },
    title: 'War3 UI设计器',
    icon: path.join(__dirname, 'public/icon.png')
  });

  // 加载React应用
  // 检查多种方式来确定是否为开发模式
  const isDev = process.env.NODE_ENV === 'development' || 
                process.argv.includes('--dev') || 
                process.argv.includes('--development');
  
  console.log('Command line arguments:', process.argv);
  console.log('Current NODE_ENV:', process.env.NODE_ENV);
  console.log('Is development mode:', isDev);
  
  const loadUrl = isDev
    ? 'http://localhost:8080'
    : `file://${path.join(__dirname, '../dist/index.html')}`;
  
  console.log('Loading URL:', loadUrl);
  mainWindow.loadURL(loadUrl);

  // 打开开发者工具
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
    // 可以在这里添加日志来检查preload脚本是否正确加载
    console.log('Preload path:', path.join(__dirname, 'preload.js'));
  }
};

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// 在主进程中添加
ipcMain.handle('save-jass', async (event, { content, defaultPath }) => {
  const { filePath } = await dialog.showSaveDialog({
    defaultPath,
    filters: [{ name: 'JASS Files', extensions: ['j'] }]
  });
  if (filePath) {
    fs.writeFileSync(filePath, content);
    return { success: true, path: filePath };
  }
  return { success: false };
});