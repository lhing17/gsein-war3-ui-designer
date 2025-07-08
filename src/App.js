// src/App.js
const { useState } = require('react');
const { Classes, Tabs, Tab } = require('@blueprintjs/core');
const FunctionButtons = require('./components/FunctionButtons');
const Toolbox = require('./components/Toolbox.js');
const Canvas = require('./components/Canvas.js');
const PropertyPanel = require('./components/PropertyPanel.js');
const CodePreview = require('./components/CodePreview.js');
const PngToTgaConverter = require('./components/PngToTgaConverter.js');
const { generateJassCode } = require('./lib/jass-generator.js');
const { CANVAS_CONFIG } = require('./config/canvasConfig.js');
require("normalize.css");
require("@blueprintjs/core/lib/css/blueprint.css");
// include blueprint-icons.css for icon font support

const App = () => {
  const [components, setComponents] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  // 添加新组件
  const addComponent = (component) => {
    const newComponent = {
      ...component,
      id: `comp_${Date.now()}`,
      name: component.name || `frame_${components.length + 1}`
    };
    setComponents([...components, newComponent]);
    setSelectedId(newComponent.id);
  };

  // 移动组件
  const moveComponent = (id, newPosition) => {
    // 检查是否超出边界
    const item = components.find(c => c.id === id);
    if (newPosition.x < 0) {
      newPosition.x = 0;
    }
    if (newPosition.y < 0) {
      newPosition.y = 0;
    }
    if (newPosition.x + (item.size?.width || 100) > CANVAS_CONFIG.width) {
      newPosition.x = CANVAS_CONFIG.width - (item.size?.width || 100);
    }
    if (newPosition.y + (item.size?.height || 40) > CANVAS_CONFIG.height) {
      newPosition.y = CANVAS_CONFIG.height - (item.size?.height || 40);
    }
    setComponents(components.map(comp =>
      comp.id === id ? { ...comp, position: newPosition } : comp
    ));
    setSelectedId(id);
  };

  // 更新组件属性
  const resizeComponent = (id, newSize) => {
    setComponents(components.map(comp =>
      comp.id === id ? { ...comp, size: newSize } : comp
    ));
  };

  // 更新组件属性
  const updateComponent = (id, updates) => {
    setComponents(components.map(comp =>
      comp.id === id ? { ...comp, ...updates } : comp
    ));
  };

  // 删除组件
  const deleteComponent = (id) => {
    // 如果要删除的组件有子组件，将子组件的ID设置为null
    const items = components.map(c => c.properties.parentId === id ? { ...c, properties: { ...c.properties, parentId: null } } : c);
    setComponents(items.filter(comp => comp.id !== id));
    setSelectedId(null);
  };

  // 生成JASS代码
  const jassCode = generateJassCode(components);
  const handleSave = async() => {

    let filePath;
    if (window.api && window.api.saveJass) {
      let res = await window.api.saveJass({
        content: jassCode,
        defaultPath: 'ui_design.j'
      }).catch(err => console.error('保存失败:', err));
      filePath = res.path;
    } else {
      console.error('API未正确加载，无法保存文件');
      // 可以在这里添加一个用户提示
      alert('保存功能暂时不可用，请检查开发者控制台');
    }
    // 遍历components，如果有imageSrc属性，转成tga文件
    components.forEach(comp => {
      if (comp.properties.imageSrc) {
        if (window.api && window.api.convertPngToTga) {
          // 调用转换函数
          let tgaPath = filePath.replace('ui_design.j', comp.properties.imageName.replace('.png', '.tga'));
          window.api.convertPngToTga({
            base64Data: comp.properties.imageSrc,
            filePath: tgaPath
          }).catch(err => console.error('转换失败:', err));
        } else {
          console.error('API未正确加载，无法保存文件');
          // 可以在这里添加一个用户提示
          alert('保存功能暂时不可用，请检查开发者控制台');
        }
      }
    });
  };

  return (
    <div className={Classes.DARK} style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      backgroundColor: '#1a1c25',
      color: '#f5f8fa'
    }}>
      <Tabs id="AppTabs" renderActiveTabPanelOnly={true} defaultSelectedTabId="designer" style={{ height: '100%' }}>
        <Tab 
          id="designer" 
          title="UI设计器" 
          panel={
            <div style={{ display: 'flex', height: 'calc(100vh - 50px)' }}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  width: '200px',
                  backgroundColor: '#252836',
                  padding: '16px 0',
                  borderRight: '1px solid #1a1c25'
                }}>
                <Toolbox />

                <FunctionButtons handleSave={handleSave} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', width: CANVAS_CONFIG.width }}>
                <Canvas
                  components={components}
                  onAddComponent={addComponent}
                  onMoveComponent={moveComponent}
                  onResize={resizeComponent}
                  selectedId={selectedId}
                  onSelect={setSelectedId}
                  onDeleteComponent={deleteComponent}
                />

                <CodePreview code={jassCode} />
              </div>

              <PropertyPanel
                components={components}
                component={components.find(c => c.id === selectedId)}
                onUpdate={updateComponent}
              />
            </div>
          } 
        />
        <Tab 
          id="pngToTga" 
          title="PNG转TGA工具" 
          panel={
            <div style={{ padding: '20px', height: 'calc(100vh - 50px)', overflow: 'auto' }}>
              <PngToTgaConverter />
            </div>
          } 
        />
      </Tabs>
    </div>
  );
};

module.exports = App;
