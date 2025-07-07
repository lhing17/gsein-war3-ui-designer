# War3 UI Designer

## 功能
- 设计war3的界面
- 生成jass代码
- 将传入的png图片转为tga格式
- 支持滚动条
- 将jass代码和tga文件一起导入到war3工程中

## 启动应用程序

由于PowerShell执行策略的限制，推荐使用以下方法启动应用程序：

### 方法1：使用批处理文件启动（推荐）

双击 `start-dev.cmd` 文件，它会自动启动webpack开发服务器和Electron应用程序。

### 方法2：使用PowerShell绕过执行策略

```powershell
powershell -ExecutionPolicy Bypass -Command "npm run dev"
```

### 方法3：直接启动Electron（如果webpack服务器已经运行）

```powershell
powershell -ExecutionPolicy Bypass -Command "npm run start-electron-direct"
```

## 开发说明

- `npm run start-react` - 启动webpack开发服务器
- `npm run start-electron` - 启动Electron应用程序（需要webpack服务器已运行）
- `npm run dev` - 同时启动webpack服务器和Electron应用程序
- `npm run build` - 构建生产版本

