// src/lib/ui-model.js
const UIComponent = {
  id: 'unique-id',
  type: 'BUTTON', // 组件类型
  name: 'btnStart', // War3中的帧名称
  position: { x: 100, y: 200 }, // 在画布中的位置
  size: { width: 120, height: 40 }, // 组件尺寸
  properties: {
    text: '开始游戏',
    visible: true,
    // War3特有属性
    frameLevel: 0,
    parentFrame: null
  },
  events: {
    onClick: 'TRIGGER_StartGame()'
  }
};

// 整个UI设计状态
const UIState = {
  components: [], // 所有UI组件
  selectedId: null, // 当前选中的组件ID
  version: '1.27' // War3版本
};

export { UIComponent, UIState };
