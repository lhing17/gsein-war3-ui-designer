// test-png-to-tga.js
const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');
const tga = require('tga');

// 测试函数：将PNG文件转换为TGA文件
function convertPngToTga(pngFilePath, tgaFilePath) {
  try {
    // 读取PNG文件
    const pngData = fs.readFileSync(pngFilePath);
    
    // 解析PNG图像
    const png = PNG.sync.read(pngData);
    
    // 获取宽度、高度和像素数据
    const { width, height, data } = png;
    
    console.log(`PNG解析成功: 宽度=${width}, 高度=${height}, 像素数据长度=${data.length}`);
    
    // 创建TGA缓冲区
    const tgaData = tga.createTgaBuffer(width, height, data);
    
    // 写入TGA文件
    fs.writeFileSync(tgaFilePath, tgaData);
    
    console.log(`TGA文件已保存至: ${tgaFilePath}`);
    return true;
  } catch (error) {
    console.error('PNG转TGA过程中出错:', error);
    return false;
  }
}

// 测试函数：将base64编码的PNG转换为TGA文件
function convertBase64PngToTga(base64Data, tgaFilePath) {
  try {
    // 从base64中提取数据
    const base64Image = base64Data.replace(/^data:image\/png;base64,/, '');
    
    // 解码base64数据
    const imageBuffer = Buffer.from(base64Image, 'base64');
    
    // 解析PNG图像
    const png = PNG.sync.read(imageBuffer);
    
    // 获取宽度、高度和像素数据
    const { width, height, data } = png;
    
    console.log(`PNG解析成功: 宽度=${width}, 高度=${height}, 像素数据长度=${data.length}`);
    
    // 创建TGA缓冲区
    const tgaData = tga.createTgaBuffer(width, height, data);
    
    // 写入TGA文件
    fs.writeFileSync(tgaFilePath, tgaData);
    
    console.log(`TGA文件已保存至: ${tgaFilePath}`);
    return true;
  } catch (error) {
    console.error('PNG转TGA过程中出错:', error);
    return false;
  }
}

// 如果有命令行参数，则使用参数中的PNG文件路径
if (process.argv.length > 2) {
  const pngFilePath = process.argv[2];
  const tgaFilePath = process.argv[3] || pngFilePath.replace(/\.png$/i, '.tga');
  
  console.log(`正在将PNG文件 ${pngFilePath} 转换为TGA文件 ${tgaFilePath}...`);
  convertPngToTga(pngFilePath, tgaFilePath);
} else {
  console.log('用法: node test-png-to-tga.js <png文件路径> [tga文件路径]');
}