// src/components/PropertyPanel.js
import { FormGroup, InputGroup, NumericInput, Switch } from '@blueprintjs/core';

const PropertyPanel = ({ component, onUpdate }) => {
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

  const handleChange = (property, value) => {
    onUpdate(component.id, { [property]: value });
  };

  const handlePropertyChange = (property, value) => {
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

    </div>
  );
};

export default PropertyPanel;
