import { useState, useEffect  } from 'react';// src/components/Canvas.js
import { useRef } from 'react';
import { useDrop, useDrag } from 'react-dnd';
import { Resizable } from 'react-resizable';

const Canvas = ({ components, onMoveComponent, onAddComponent, selectedId, onSelect }) => {
  const canvasRef = useRef(null);
  
  // 处理从工具箱拖入，或在画布上拖动
  const [, drop] = useDrop({
    accept: ['TOOLBOX_ITEM', 'CANVAS_ITEM'],
    drop: (item, monitor) => {
      const offset = monitor.getClientOffset();
      const canvasRect = canvasRef.current.getBoundingClientRect();
      
      // 计算在画布中的位置
      const initialOffset = monitor.getInitialClientOffset();
      const initialSourceOffset = monitor.getInitialSourceClientOffset();
      const position = {
      x : offset.x - canvasRect.left - (initialOffset.x - initialSourceOffset.x),
      y : offset.y - canvasRect.top - (initialOffset.y - initialSourceOffset.y)
      };
      
      // 如果是来自工具箱的组件，需要转换为画布项目
      if (item.type) {
        // 添加新组件
        onAddComponent({
          type: item.type,
          position,
          size: { width: 100, height: 40 },
          properties: { text: '新按钮' }
        });
      } else {
        onMoveComponent(item.id, position);
      }
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
        backgroundColor: '#1c1e2a',
        position: 'relative',
        width: 800,
        height: 600
      }}
    >
      {components.map(component => (
        <DraggableComponent 
          key={component.id}
          component={component}
          onMove={onMoveComponent}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
};

// 可拖拽的UI组件
const DraggableComponent = ({ component, onMove, onSelect }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'CANVAS_ITEM',
    item: { id: component.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    }),
    end: (item, monitor) => {
      if (!monitor.didDrop()) {
        return;
      }
      // 拖拽结束后更新内部position状态
      const dropResult = monitor.getDropResult();
      if (dropResult && dropResult.position) {
        setPosition(dropResult.position);
      }
    }
  });
  
  const [size, setSize] = useState(component.size);
  const [position, setPosition] = useState(component.position);
  const [isResizing, setIsResizing] = useState(false);
  
  // 当父组件中的component.position更新时，同步更新内部状态
  useEffect(() => {
    setPosition(component.position);
  }, [component.position]);
  
  const handleResizeStart = (e) => {
    // 阻止事件冒泡，防止触发拖拽
    e.stopPropagation();
    setIsResizing(true);
  };
  
  const handleResize = (e, { size: newSize, handle }) => {
    e.stopPropagation();
    
    // 根据调整手柄的方向调整位置
    const newPosition = { ...position };
    
    // 处理左侧调整
    if (handle.includes('w')) {
      const widthDelta = size.width - newSize.width;
      newPosition.x = position.x + widthDelta;
    }
    
    // 处理顶部调整
    if (handle.includes('n')) {
      const heightDelta = size.height - newSize.height;
      newPosition.y = position.y + heightDelta;
    }
    
    setSize(newSize);
    setPosition(newPosition);
  };
  
  const handleResizeStop = (e) => {
    e.stopPropagation();
    setIsResizing(false);
    onMove(component.id, position);
  };

  // 创建一个包装div来处理拖拽和调整大小
  const wrapperRef = useRef(null);

  return (
    <div 
      ref={(node) => {
        wrapperRef.current = node;
        // 只有在不调整大小时才允许拖拽
        if (!isResizing) {
          drag(node);
        }
      }}
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        opacity: isDragging ? 0.5 : 1,
        // 移除cursor: 'move'，让调整手柄的光标样式能够正常显示
      }}
      onClick={(e) => {
        if (!isResizing) {
          e.stopPropagation();
          onSelect(component.id);
        }
      }}
    >
      <Resizable
        width={size.width}
        height={size.height}
        onResize={handleResize}
        onResizeStart={handleResizeStart}
        onResizeStop={handleResizeStop}
        resizeHandles={['s', 'w', 'e', 'n', 'sw', 'nw', 'se', 'ne']} // 添加这一行，显示所有8个方向的调整手柄
        handleStyles={{
          top: { cursor: 'n-resize', zIndex: 999 },
          right: { cursor: 'e-resize', zIndex: 999 },
          bottom: { cursor: 's-resize', zIndex: 999 },
          left: { cursor: 'w-resize', zIndex: 999 },
          topRight: { cursor: 'ne-resize', zIndex: 999 },
          bottomRight: { cursor: 'se-resize', zIndex: 999 },
          bottomLeft: { cursor: 'sw-resize', zIndex: 999 },
          topLeft: { cursor: 'nw-resize', zIndex: 999 }
        }}
        enable={{
          top: true,
          right: true,
          bottom: true,
          left: true,
          topRight: true,
          bottomRight: true,
          bottomLeft: true,
          topLeft: true
        }}
      >
        <div
          style={{
            width: size.width,
            height: size.height,
            backgroundColor: '#3498db',
            border: '1px solid #2980b9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            cursor: isResizing ? 'auto' : 'move' // 根据状态切换光标样式
          }}
        >
          {component.properties.text}
        </div>
      </Resizable>
    </div>
  );
};

export default Canvas;