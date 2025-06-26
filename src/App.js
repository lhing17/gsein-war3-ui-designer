// src/App.js
import { useState } from 'react';
import { Classes } from '@blueprintjs/core';
import Toolbox from './components/Toolbox.js';
import Canvas from './components/Canvas.js';
import PropertyPanel from './components/PropertyPanel.js';
import CodePreview from './components/CodePreview.js';
import { generateJassCode } from './lib/jass-generator.js';

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
    setComponents(components.map(comp => 
      comp.id === id ? { ...comp, position: newPosition } : comp
    ));
  };
  
  // 更新组件属性
  const updateComponent = (id, updates) => {
    setComponents(components.map(comp => 
      comp.id === id ? { ...comp, ...updates } : comp
    ));
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
      
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Canvas 
          components={components}
          onAddComponent={addComponent}
          onMoveComponent={moveComponent}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
        
        <CodePreview code={jassCode} />
      </div>
      
      <PropertyPanel 
        component={components.find(c => c.id === selectedId)}
        onUpdate={updateComponent}
      />
    </div>
  );
};

export default App;
