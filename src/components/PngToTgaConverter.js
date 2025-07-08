// src/components/PngToTgaConverter.js
const { useState, useRef } = require('react');
const { Button, FormGroup, FileInput, Card, Elevation, Toaster, Position, Intent } = require('@blueprintjs/core');

function PngToTgaConverter() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [converting, setConverting] = useState(false);
  const [previewSrc, setPreviewSrc] = useState(null);
  const fileInputRef = useRef(null);
  const toasterRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'image/png') {
      setSelectedFile(file);
      
      // 创建预览
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewSrc(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedFile(null);
      setPreviewSrc(null);
      showToast('请选择PNG格式的图片', Intent.WARNING);
    }
  };

  const showToast = (message, intent = Intent.PRIMARY) => {
    if (toasterRef.current) {
      toasterRef.current.show({ message, intent });
    }
  };

  const handleConvert = async () => {
    if (!selectedFile) {
      showToast('请先选择PNG图片', Intent.WARNING);
      return;
    }

    setConverting(true);

    try {
      // 读取文件为base64
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64Data = e.target.result;
        
        // 使用文件名作为默认保存路径
        const defaultPath = selectedFile.name.replace(/\.png$/i, '.tga');
        
        try {
          // 调用Electron的API进行转换
          const result = await window.api.convertPngToTga({
            base64Data,
            filePath: defaultPath
          });
          
          if (result.success) {
            showToast(`TGA文件已保存至: ${result.path}`, Intent.SUCCESS);
            showToast(`图像尺寸: ${result.width}x${result.height}`, Intent.PRIMARY);
          } else {
            showToast(`转换失败: ${result.error}`, Intent.DANGER);
          }
        } catch (error) {
          showToast(`转换过程中出错: ${error.message}`, Intent.DANGER);
        } finally {
          setConverting(false);
        }
      };
      
      reader.onerror = () => {
        showToast('读取文件失败', Intent.DANGER);
        setConverting(false);
      };
      
      reader.readAsDataURL(selectedFile);
    } catch (error) {
      showToast(`发生错误: ${error.message}`, Intent.DANGER);
      setConverting(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewSrc(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card elevation={Elevation.TWO} style={{ margin: '10px', padding: '15px' }}>
      <h3>PNG转TGA工具</h3>
      
      <FormGroup
        label="选择PNG图片"
        helperText="选择要转换为TGA格式的PNG图片"
      >
        <FileInput
          text={selectedFile ? selectedFile.name : "选择文件..."}
          onInputChange={handleFileChange}
          inputProps={{
            accept: '.png,image/png',
            ref: fileInputRef
          }}
          fill={true}
        />
      </FormGroup>
      
      {previewSrc && (
        <div style={{ marginBottom: '15px', textAlign: 'center' }}>
          <p>预览:</p>
          <img 
            src={previewSrc} 
            alt="预览" 
            style={{ 
              maxWidth: '100%', 
              maxHeight: '200px', 
              border: '1px solid #30404d' 
            }} 
          />
        </div>
      )}
      
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button 
          intent={Intent.PRIMARY} 
          onClick={handleConvert} 
          loading={converting}
          disabled={!selectedFile || converting}
          icon="export"
        >
          转换为TGA
        </Button>
        
        <Button 
          onClick={handleReset} 
          disabled={!selectedFile || converting}
          icon="refresh"
        >
          重置
        </Button>
      </div>
      
      <Toaster ref={toasterRef} position={Position.TOP} />
    </Card>
  );
}

module.exports = PngToTgaConverter;