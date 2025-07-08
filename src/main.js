// src/main.js
const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const tga = require('tga');

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

// 保存jass
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

// 将base64存储的png转为tga
ipcMain.handle('convert-png-to-tga', async (event, { base64Data, filePath }) => {
  try {
    // 从base64中提取数据
    const base64Image = base64Data.replace(/^data:image\/png;base64,/, '');
    // 解码base64数据
    const imageBuffer = Buffer.from(base64Image, 'base64');

    // 使用pngjs解析PNG图像
    const PNG = require('pngjs').PNG;
    const png = PNG.sync.read(imageBuffer);

    // 获取宽度、高度和像素数据
    const { width, height, data } = png;

    console.log(`PNG解析成功: 宽度=${width}, 高度=${height}, 像素数据长度=${data.length}`);

    // 创建TGA缓冲区
    const tgaData = tga.createTgaBuffer(width, height, data);

    console.log(`当前写入路径：${filePath}`);
    // 写入文件
    fs.writeFileSync(filePath, tgaData);
    return { success: true, path: filePath, width, height };

  } catch (error) {
    console.error('PNG转TGA过程中出错:', error);
    return { success: false, error: error.message };
  }
});

