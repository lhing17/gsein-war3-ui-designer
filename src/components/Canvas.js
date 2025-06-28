import { useState, useEffect } from 'react';// src/components/Canvas.js
import { useRef } from 'react';
import { useDrop, useDrag } from 'react-dnd';
import { Resizable } from 'react-resizable';
import { CANVAS_CONFIG } from '../config/canvasConfig.js';

const Canvas = ({ components, onMoveComponent, onAddComponent, selectedId, onSelect, onResize }) => {
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
        x: offset.x - canvasRect.left - (initialOffset.x - initialSourceOffset.x),
        y: offset.y - canvasRect.top - (initialOffset.y - initialSourceOffset.y)
      };

      // 如果是来自工具箱的组件，需要转换为画布项目
      if (item.type) {
        // 添加新组件
        let props = {
          type: item.type,
          position,
          size: { width: 100, height: 40 },
        }

        if (item.type === 'TEXT') {
          props.properties = { text: '文本' };
        } else {
          props.properties = { };
        }
        onAddComponent(props);
      } else {
        // 否则直接移动组件

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
        width: CANVAS_CONFIG.width,
        height: CANVAS_CONFIG.height
      }}
    >
      {components.map(component => (
        <DraggableComponent
          key={component.id}
          component={component}
          onMove={onMoveComponent}
          onSelect={onSelect}
          onResize={onResize}
        />
      ))}
    </div>
  );
};

// 可拖拽的UI组件
const DraggableComponent = ({ component, onMove, onSelect, onResize }) => {
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

  const calculateNewPosition = (handle, position, size, newSize) => {
    const newPosition = { ...position };

    if (handle.includes('w')) {
      const widthDelta = size.width - newSize.width;
      newPosition.x = position.x + widthDelta;
    }

    if (handle.includes('n')) {
      const heightDelta = size.height - newSize.height;
      newPosition.y = position.y + heightDelta;
    }

    return newPosition;
  };

  const applyBoundaryConstraints = (position, size, canvasWidth, canvasHeight) => {
    const constrainedPosition = { ...position };
    let constrainedSize = { ...size };

    constrainedPosition.x = Math.max(0, constrainedPosition.x);
    constrainedPosition.y = Math.max(0, constrainedPosition.y);

    constrainedSize.width = Math.min(constrainedSize.width, canvasWidth - constrainedPosition.x);
    constrainedSize.height = Math.min(constrainedSize.height, canvasHeight - constrainedPosition.y);

    return { constrainedPosition, constrainedSize };
  };

  // 处理调整大小
  const handleResize = (e, { size: newSize, handle }) => {
    e.stopPropagation();

    const newPosition = calculateNewPosition(handle, position, size, newSize);

    // 检查是否超出边界
    const { constrainedPosition, constrainedSize } = applyBoundaryConstraints(
      newPosition,
      newSize,
      CANVAS_CONFIG.width,
      CANVAS_CONFIG.height
    );

    setSize(constrainedSize);
    setPosition(constrainedPosition);
    onResize(component.id, constrainedSize);
  };

  const handleResizeStop = (e) => {
    e.stopPropagation();
    setIsResizing(false);
    onMove(component.id, position);
  };

  // 创建一个包装div来处理拖拽和调整大小
  const wrapperRef = useRef(null);

  const styleMap = {
    TEXT: {
      backgroundColor: 'transparent',
      border: 'none',
      color: `rgb(${component.properties.red || 0}, ${component.properties.green || 0}, ${component.properties.blue || 0})`,
      fontSize: `${component.properties.fontSize || 12}px`,
    },
    DEFAULT: {
      backgroundColor: `rgb(${component.properties.red || 0}, ${component.properties.green || 0}, ${component.properties.blue || 0})`,
      border: '1px solid #2980b9',
      color: 'white'
    }
  };

  const resizeHandles = component.type === 'TEXT' ? [] : ['s', 'w', 'e', 'n', 'sw', 'nw', 'se', 'ne'];

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
        zIndex: component.properties.frameLevel
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
        resizeHandles={resizeHandles} // 添加这一行，显示所有8个方向的调整手柄
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
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: isResizing ? 'auto' : 'move',
            ...(styleMap[component.type] || styleMap.DEFAULT)
          }}
        >
          {component.type === 'IMAGE' && component.properties.imageSrc ? (
            <img 
              src={component.properties.imageSrc} 
              alt="" 
              style={{ width: '100%', height: '100%', objectFit: 'fill' }}
            />
          ) : (
            component.properties.text
          )}
        </div>
      </Resizable>
    </div>
  );
};

export default Canvas;