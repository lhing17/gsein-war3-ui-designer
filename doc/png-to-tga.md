# PNG转TGA功能说明

## 概述

本文档说明如何将PNG图像转换为TGA格式，特别是如何从PNG中提取宽度、高度和像素数据（r,g,b,a,r,g,b,a...）。

## 技术实现

我们使用了以下库来实现PNG到TGA的转换：

1. `pngjs` - 用于解析PNG图像并提取像素数据
2. `tga` - 用于创建TGA文件

## 从PNG中提取数据的步骤

1. **解码base64数据**（如果PNG是以base64格式提供的）
   ```javascript
   const base64Image = base64Data.replace(/^data:image\/png;base64,/, '');
   const imageBuffer = Buffer.from(base64Image, 'base64');
   ```

2. **解析PNG图像**
   ```javascript
   const PNG = require('pngjs').PNG;
   const png = PNG.sync.read(imageBuffer);
   ```

3. **获取宽度、高度和像素数据**
   ```javascript
   const { width, height, data } = png;
   ```
   
   其中：
   - `width` - 图像宽度（像素）
   - `height` - 图像高度（像素）
   - `data` - 像素数据，格式为 [r,g,b,a,r,g,b,a...]，每个值范围为0-255

4. **创建TGA缓冲区**
   ```javascript
   const tga = require('tga');
   const tgaData = tga.createTgaBuffer(width, height, data);
   ```

5. **保存TGA文件**
   ```javascript
   const fs = require('fs');
   fs.writeFileSync(filePath, tgaData);
   ```

## 在Electron应用中的使用

在我们的Electron应用中，我们通过IPC通道提供了这个功能：

```javascript
// 在渲染进程中调用
window.api.convertPngToTga({
  base64Data: 'data:image/png;base64,...', // base64编码的PNG数据
  filePath: '/path/to/output.tga' // 输出TGA文件的路径
}).then(result => {
  if (result.success) {
    console.log(`TGA文件已保存至: ${result.path}`);
    console.log(`图像尺寸: ${result.width}x${result.height}`);
  } else {
    console.error(`转换失败: ${result.error}`);
  }
});
```

## 测试

我们提供了一个测试脚本 `test-png-to-tga.js`，可以用来测试PNG到TGA的转换功能：

```bash
node test-png-to-tga.js <png文件路径> [tga文件路径]
```

如果不提供TGA文件路径，将使用与PNG文件相同的路径，但扩展名改为.tga。

## 注意事项

1. TGA格式支持透明度（alpha通道），我们的转换过程保留了PNG的透明度信息。
2. 像素数据的格式是RGBA，每个通道一个字节（8位），与TGA格式兼容。
3. 如果PNG使用了其他颜色空间或位深度，可能需要进行额外的转换。