const { Button } = require('@blueprintjs/core');

function FunctionButtons({ handleSave }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      padding: '10px 20px',
      borderBottom: '1px solid #394b59'
    }}>
      <h3 style={{ color: '#ecf0f1', marginTop: 0 }}>功能按钮区</h3>
      <Button
        text="保存设计"
        intent="success"
        onClick={handleSave}
      />
    </div>
  );
}

module.exports = FunctionButtons;
