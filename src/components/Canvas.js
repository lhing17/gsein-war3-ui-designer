// src/components/Canvas.js
import React, { useRef, useState } from 'react';
import { useDrop, useDrag } from 'react-dnd';

const Canvas = ({ components, onAddComponent, onMoveComponent }) => {
  const canvasRef = useRef(null);
  
  // 处理从工具箱拖入
  const [, drop] = useDrop({
    accept: 'TOOLBOX_ITEM',
    drop: (item, monitor) => {
      const offset = monitor.getClientOffset();
      const canvasRect = canvasRef.current.getBoundingClientRect();
      
      // 计算在画布中的位置
      const position = {
        x: offset.x - canvasRect.left,
        y: offset.y - canvasRect.top
      };
      
      // 添加新组件
      onAddComponent({
        type: item.type,
        position,
        size: { width: 100, height: 40 },
        properties: { text: '新按钮' }
      });
    }
  });

  return (
    <div 
      ref={(node) => {
        canvasRef.current = node;
        drop(node);
      }}
      className="canvas"
      style={{ 
        flex: 1, 
        backgroundColor: '#1c1e2a',
        position: 'relative'
      }}
    >
      {components.map(component => (
        <DraggableComponent 
          key={component.id}
          component={component}
          onMove={onMoveComponent}
        />
      ))}
    </div>
  );
};

// 可拖拽的UI组件
const DraggableComponent = ({ component, onMove }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'CANVAS_ITEM',
    item: { id: component.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    })
  });

  return (
    <div
      ref={drag}
      style={{
        position: 'absolute',
        left: component.position.x,
        top: component.position.y,
        width: component.size.width,
        height: component.size.height,
        backgroundColor: '#3498db',
        border: '1px solid #2980b9',
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white'
      }}
    >
      {component.properties.text}
    </div>
  );
};

export default Canvas;