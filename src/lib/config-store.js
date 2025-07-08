// src/lib/config-store.js
const fs = require('fs');
const path = require('path');
const electron = require('electron');

// 获取用户数据目录
const userDataPath = (electron.app || electron.remote.app).getPath('userData');
const configPath = path.join(userDataPath, 'config.json');

// 默认配置
const defaultConfig = {
  jassFilePath: '',
  tgaFolderPath: ''
};

// 读取配置
function getConfig() {
  try {
    if (fs.existsSync(configPath)) {
      const configData = fs.readFileSync(configPath, 'utf8');
      return JSON.parse(configData);
    }
    return defaultConfig;
  } catch (error) {
    console.error('读取配置文件失败:', error);
    return defaultConfig;
  }
}

// 保存配置
function saveConfig(config) {
  try {
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    return true;
  } catch (error) {
    console.error('保存配置文件失败:', error);
    return false;
  }
}

module.exports = {
  getConfig,
  saveConfig
};