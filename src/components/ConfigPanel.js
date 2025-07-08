// src/components/ConfigPanel.js
const React = require('react');
const { useState, useEffect } = React;
const { FormGroup, InputGroup, Button, Card, Elevation, Toaster, Position, Intent } = require('@blueprintjs/core');

// 创建一个toaster实例
let toaster;
// 在组件渲染后初始化toaster
const initToaster = () => {
  if (!toaster && typeof document !== 'undefined') {
    toaster = Toaster.create({
      position: Position.TOP
    });
  }
  return toaster;
};

// 显示消息的辅助函数
const showToast = (message, intent) => {
  const t = initToaster();
  if (t) {
    t.show({
      message,
      intent
    });
  } else {
    console.error('无法显示提示:', message);
  }
};

const ConfigPanel = () => {
  const [config, setConfig] = useState({
    jassFilePath: '',
    tgaFolderPath: ''
  });
  const [loading, setLoading] = useState(true);

  // 加载配置
  useEffect(() => {
    const loadConfig = async () => {
      try {
        if (window.api && window.api.getConfig) {
          const savedConfig = await window.api.getConfig();
          setConfig(savedConfig);
        }
      } catch (error) {
        console.error('加载配置失败:', error);
        showToast(
          '加载配置失败: ' + error.message,
          Intent.DANGER
        );
      } finally {
        setLoading(false);
      }
    };

    loadConfig();
  }, []);

  // 保存配置
  const handleSaveConfig = async () => {
    try {
      if (window.api && window.api.saveConfig) {
        const result = await window.api.saveConfig(config);
        if (result.success) {
          showToast(
            '配置保存成功',
            Intent.SUCCESS
          );
        } else {
          throw new Error('保存失败');
        }
      } else {
        throw new Error('API未正确加载');
      }
    } catch (error) {
      console.error('保存配置失败:', error);
      showToast(
        '保存配置失败: ' + error.message,
        Intent.DANGER
      );
    }
  };

  // 选择JASS文件路径
  const handleSelectJassPath = async () => {
    try {
      if (window.api && window.api.selectJassPath) {
        const result = await window.api.selectJassPath();
        if (result.path) {
          setConfig(prev => ({ ...prev, jassFilePath: result.path }));
        }
      } else {
        throw new Error('API未正确加载');
      }
    } catch (error) {
      console.error('选择JASS文件路径失败:', error);
      showToast(
        '选择JASS文件路径失败: ' + error.message,
        Intent.DANGER
      );
    }
  };

  // 选择TGA文件夹路径
  const handleSelectTgaFolder = async () => {
    try {
      if (window.api && window.api.selectTgaFolder) {
        const result = await window.api.selectTgaFolder();
        if (result.path) {
          setConfig(prev => ({ ...prev, tgaFolderPath: result.path }));
        }
      } else {
        throw new Error('API未正确加载');
      }
    } catch (error) {
      console.error('选择TGA文件夹路径失败:', error);
      showToast(
        '选择TGA文件夹路径失败: ' + error.message,
        Intent.DANGER
      );
    }
  };

  if (loading) {
    return <div>加载中...</div>;
  }

  return (
    <Card elevation={Elevation.TWO} style={{ padding: 20, maxWidth: 600, margin: '0 auto' }}>
      <h2 style={{ marginTop: 0, color: '#f5f8fa' }}>应用配置</h2>
      
      <FormGroup
        label="JASS文件保存路径"
        labelFor="jass-path-input"
        helperText="设置JASS文件的保存路径，用于保存生成的UI代码"
      >
        <div style={{ display: 'flex', gap: 10 }}>
          <InputGroup
            id="jass-path-input"
            placeholder="请选择JASS文件保存路径"
            value={config.jassFilePath}
            onChange={(e) => setConfig(prev => ({ ...prev, jassFilePath: e.target.value }))}
            style={{ flex: 1 }}
          />
          <Button
            icon="folder-open"
            onClick={handleSelectJassPath}
            text="浏览..."
          />
        </div>
      </FormGroup>

      <FormGroup
        label="TGA文件保存文件夹"
        labelFor="tga-folder-input"
        helperText="设置TGA文件的保存文件夹，用于保存转换后的图片文件"
      >
        <div style={{ display: 'flex', gap: 10 }}>
          <InputGroup
            id="tga-folder-input"
            placeholder="请选择TGA文件保存文件夹"
            value={config.tgaFolderPath}
            onChange={(e) => setConfig(prev => ({ ...prev, tgaFolderPath: e.target.value }))}
            style={{ flex: 1 }}
          />
          <Button
            icon="folder-open"
            onClick={handleSelectTgaFolder}
            text="浏览..."
          />
        </div>
      </FormGroup>

      <div style={{ marginTop: 20 }}>
        <Button
          intent="primary"
          text="保存配置"
          icon="floppy-disk"
          onClick={handleSaveConfig}
        />
      </div>
    </Card>
  );
};

module.exports = ConfigPanel;