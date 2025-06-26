// src/components/Toolbox.js
import React from 'react';
import { Button } from '@blueprintjs/core';
import { useDrag } from 'react-dnd';

const ToolboxItem = ({ type, label, icon }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'TOOLBOX_ITEM',
    item: { type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    })
  });

  return (
    <div 
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
        padding: '8px',
        marginBottom: '8px',
        backgroundColor: '#2c3e50',
        borderRadius: '4px',
        display: 'flex',
        alignItems: 'center'
      }}
    >
      <span style={{ marginRight: '8px' }}>{icon}</span>
      {label}
    </div>
  );
};

const Toolbox = () => {
  const components = [
    { type: 'BUTTON', label: '按钮', icon: '🔘' },
    { type: 'TEXT', label: '文本框', icon: '📝' },
    { type: 'IMAGE', label: '图片', icon: '🖼️' },
    { type: 'PANEL', label: '面板', icon: '🧱' }
  ];

  return (
    <div style={{ 
      width: '200px', 
      backgroundColor: '#252836', 
      padding: '16px',
      borderRight: '1px solid #1a1c25'
    }}>
      <h3 style={{ color: '#ecf0f1', marginTop: 0 }}>组件库</h3>
      {components.map(comp => (
        <ToolboxItem 
          key={comp.type} 
          type={comp.type} 
          label={comp.label} 
          icon={comp.icon} 
        />
      ))}
    </div>
  );
};

export default Toolbox;
