// src/components/PropertyPanel.js
const { FormGroup, InputGroup, NumericInput, Switch } = require('@blueprintjs/core');
function PropertyPanel(props) {
  const components = props.components;
  const component = props.component;
  const onUpdate = props.onUpdate;

  if (!component) {
    return (
      <div style={{
        flex: 1,
        padding: '10px',
        borderLeft: '1px solid #30404d',
        backgroundColor: '#252a31'
      }}>
        <p>请选择一个组件</p>
      </div>
    );
  }

  const handleChange = function(property, value) {
    onUpdate(component.id, { [property]: value });
  };

  const handlePropertyChange = function(property, value) {
    onUpdate(component.id, {
      properties: {
        ...component.properties,
        [property]: value
      }
    });
  };

  return (
    <div style={{
      flex: 1,
      padding: '10px',
      borderLeft: '1px solid #30404d',
      backgroundColor: '#252a31',
      overflowY: 'auto'
    }}>
      <h3>属性面板</h3>

      <FormGroup label="组件ID">
        <InputGroup value={component.id} disabled />
      </FormGroup>

      <FormGroup label="组件类型">
        <InputGroup value={component.type} disabled />
      </FormGroup>

      <FormGroup label="父组件">
        <select
          value={component.properties.parentId || ''}
          onChange={e => handlePropertyChange('parentId', e.target.value)}
          style={{ width: '100%', padding: '5px', borderRadius: '3px', backgroundColor: '#293742', color: '#f5f8fa', border: '1px solid #394b59' }}
        >
          <option value="">无</option>
          {components
            .filter(c => c.id !== component.id && (c.properties.frameLevel || 0) <= (component.properties.frameLevel || 0))
            .map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))
          }
        </select>
      </FormGroup>

      <FormGroup label="名称">
        <InputGroup
          value={component.name}
          onChange={e => handleChange('name', e.target.value)}
        />
      </FormGroup>

      <FormGroup label="位置 X">
        <NumericInput
          value={component.position.x}
          onValueChange={value => handleChange('position', { ...component.position, x: value })}
          min={0}
        />
      </FormGroup>

      <FormGroup label="位置 Y">
        <NumericInput
          value={component.position.y}
          onValueChange={value => handleChange('position', { ...component.position, y: value })}
          min={0}
        />
      </FormGroup>

      <FormGroup label="宽度">
        <NumericInput
          value={component.size.width}
          onValueChange={value => handleChange('size', { ...component.size, width: value })}
          min={10}
        />
      </FormGroup>

      <FormGroup label="高度">
        <NumericInput
          value={component.size.height}
          onValueChange={value => handleChange('size', { ...component.size, height: value })}
          min={10}
        />
      </FormGroup>



      <FormGroup label="可见">
        <Switch
          checked={component.properties.visible}
          onChange={e => handlePropertyChange('visible', e.target.checked)}
        />
      </FormGroup>

      <FormGroup label="帧层级">
        <NumericInput
          value={component.properties.frameLevel || 0}
          onValueChange={value => handlePropertyChange('frameLevel', value)}
          min={0}
        />
      </FormGroup>

      <FormGroup label="红色值">
        <NumericInput
          value={component.properties.red || 0}
          onValueChange={value => handlePropertyChange('red', value)}
          min={0}
          max={255}
        />
      </FormGroup>

      <FormGroup label="绿色值">
        <NumericInput
          value={component.properties.green || 0}
          onValueChange={value => handlePropertyChange('green', value)}
          min={0}
          max={255}
        />
      </FormGroup>

      <FormGroup label="蓝色值">
        <NumericInput
          value={component.properties.blue || 0}
          onValueChange={value => handlePropertyChange('blue', value)}
          min={0}
          max={255}
        />
      </FormGroup>

      {component.type === 'TEXT' && (
        <>
          {component.properties.text !== undefined && (
            <FormGroup label="文本">
              <InputGroup
                value={component.properties.text}
                onChange={e => handlePropertyChange('text', e.target.value)}
              />
            </FormGroup>
          )}

          <FormGroup label="字体大小">
            <NumericInput
              value={component.properties.fontSize || 12}
              onValueChange={value => handlePropertyChange('fontSize', value)}
              min={1}
              max={25}
            />
          </FormGroup>


        </>
      )}
      {(component.type === 'IMAGE' || component.type === 'IMAGE_BUTTON') && (
        <>
          <FormGroup label="图片">
            <input
              type="file"
              accept="image/*"
              onChange={e => {
                const file = e.target.files[0];
                if (file) {
                  // 先保存文件名，以便在回调中使用
                  const fileName = file.name;
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    // 在同一次更新中设置两个属性
                    onUpdate(component.id, {
                      properties: {
                        ...component.properties,
                        imageName: fileName,
                        imageSrc: event.target.result
                      }
                    });
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
          </FormGroup>
          <FormGroup label="图片名称">
            <InputGroup
              value={component.properties.imageName || ''}
              disabled
            />
          </FormGroup>
        </>
      )}

    </div>
  );
};

module.exports = PropertyPanel;
