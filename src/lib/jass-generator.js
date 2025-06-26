// src/lib/jass-generator.js
const generateJassCode = (components) => {
  let code = "// 自动生成的War3 UI代码\n";
  code += "function InitCustomUI takes nothing returns nothing\n";
  
  components.forEach(comp => {
    switch(comp.type) {
      case 'BUTTON':
        code += generateButtonCode(comp);
        break;
      case 'TEXT':
        code += generateTextCode(comp);
        break;
      // 其他组件类型...
    }
  });
  
  code += "endfunction\n";
  return code;
};

export { generateJassCode };

const generateButtonCode = (button) => {
  return `
    // 创建按钮: ${button.name || '未命名按钮'}
    local framehandle ${button.name} = BlzCreateFrame("ScriptDialogButton", BlzGetOriginFrame(ORIGIN_FRAME_GAME_UI, 0), 0, 0)
    call BlzFrameSetAbsPoint(${button.name}, FRAMEPOINT_CENTER, ${button.position.x}, ${button.position.y})
    call BlzFrameSetSize(${button.name}, ${button.size.width}, ${button.size.height})
    call BlzFrameSetText(${button.name}, "${button.properties.text || ''}")
    
    // 按钮事件
    local trigger ${button.name}Trigger = CreateTrigger()
    call BlzTriggerRegisterFrameEvent(${button.name}Trigger, ${button.name}, FRAMEEVENT_CONTROL_CLICK)
    call TriggerAddAction(${button.name}Trigger, function ${button.events.onClick || 'DoNothing'})
  `;
};

const generateTextCode = (text) => {
  return `
    // 创建文本: ${text.name || '未命名文本'}
    local framehandle ${text.name} = BlzCreateFrameByType("TEXT", "", BlzGetOriginFrame(ORIGIN_FRAME_GAME_UI, 0), "", 0)
    call BlzFrameSetAbsPoint(${text.name}, FRAMEPOINT_CENTER, ${text.position.x}, ${text.position.y})
    call BlzFrameSetSize(${text.name}, ${text.size.width}, ${text.size.height})
    call BlzFrameSetText(${text.name}, "${text.properties.text || ''}")
    call BlzFrameSetTextAlignment(${text.name}, TEXT_JUSTIFY_CENTER, TEXT_JUSTIFY_MIDDLE)
  `;
};