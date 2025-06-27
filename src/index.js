import React from 'react';
import { createRoot } from 'react-dom/client';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
// require('./index.css');
import 'react-resizable/css/styles.css'; // 导入react-resizable的CSS样式
import App from './App.js';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <DndProvider backend={HTML5Backend}>
    <App />
  </DndProvider>
);