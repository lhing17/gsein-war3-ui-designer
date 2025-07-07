// Apply patches and polyfills
try {
  // Add error logger first to catch any issues
  require('./patches/error-logger');
  // Add browser polyfill before process polyfill
  require('./patches/browser-polyfill');
  require('./patches/process-browser-polyfill');
  require('./patches/react-dnd-invariant-patch');
} catch (e) {
  console.error('Failed to load patches:', e);
}

const React = require('react');
const { createRoot } = require('react-dom/client');
const { DndProvider } = require('react-dnd');
const { HTML5Backend } = require('react-dnd-html5-backend');
// require('./index.css');
require('react-resizable/css/styles.css'); // 导入react-resizable的CSS样式
const App = require('./App.js');

// 可以安全地打印环境变量，因为 webpack 已经处理了它们
console.log('当前环境:', process.env.NODE_ENV);

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  React.createElement(DndProvider, { backend: HTML5Backend },
    React.createElement(App)
  )
);