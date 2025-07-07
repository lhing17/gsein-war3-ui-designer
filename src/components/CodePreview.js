// src/components/CodePreview.js
const { CANVAS_CONFIG } = require('../config/canvasConfig.js');

function CodePreview(props) {
  const code = props.code;
  return (
    <div style={{ 
      width: CANVAS_CONFIG.width,
      flex: '1',
      padding: '10px 0',
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
        borderRadius: '3px',
        overflowX: 'auto'
      }}>
        {code}
      </pre>
    </div>
  );
}

module.exports = CodePreview;
