// src/components/CodePreview.js
import React from 'react';

const CodePreview = ({ code }) => {
  return (
    <div style={{ 
      height: '200px', 
      padding: '10px',
      backgroundColor: '#293742',
      borderTop: '1px solid #30404d',
      overflowY: 'auto'
    }}>
      <h3>JASS代码预览</h3>
      <pre style={{ 
        fontFamily: 'monospace', 
        fontSize: '12px',
        color: '#d9e1e8',
        backgroundColor: '#182026',
        padding: '10px',
        borderRadius: '3px',
        overflowX: 'auto'
      }}>
        {code}
      </pre>
    </div>
  );
};

export default CodePreview;
