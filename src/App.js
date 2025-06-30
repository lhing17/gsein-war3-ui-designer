// src/App.js
import { useState } from 'react';
import { Classes } from '@blueprintjs/core';
import Toolbox from './components/Toolbox.js';
import Canvas from './components/Canvas.js';
import PropertyPanel from './components/PropertyPanel.js';
import CodePreview from './components/CodePreview.js';
import { generateJassCode } from './lib/jass-generator.js';
import { CANVAS_CONFIG } from './config/canvasConfig.js';

const App = () => {
  const [components, setComponents] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  
  // 添加新组件
  const addComponent = (component) => {
    const newComponent = {
      ...component,
      id: `comp_${Date.now()}`,
      name: `frame_${components.length + 1}`
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
  
  return (
    <div className={Classes.DARK} style={{ 
      display: 'flex', 
      height: '100vh',
      backgroundColor: '#1a1c25',
      color: '#f5f8fa'
    }}>
      <Toolbox />
      
      <div style={{  display: 'flex', flexDirection: 'column', width: CANVAS_CONFIG.width}}>
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
  );
};

export default App;
