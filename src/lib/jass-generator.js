import { CANVAS_CONFIG } from "../config/canvasConfig.js";

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
        code += generateTextCode(comp, components);
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
    call TriggerAddAction(${button.name}Trigger, function ${button.events && button.events.onClick || 'DoNothing'})
  `;
};

const generateTextCode = (text, components) => {
  // 获取父级组件
  let parent = components.find(comp => comp.id === text.properties.parentId) || {name: 'GUI', position: {x: 0, y: 0}}
  // 计算相对位置
  let relativeX = text.position.x - parent.position.x
  let relativeY = text.position.y - parent.position.y
  // 计算war3坐标下的相对位置
  let war3RelativeX = parseFloat((relativeX / CANVAS_CONFIG.width * 0.8).toFixed(4));
  let war3RelativeY = parseFloat((relativeY / CANVAS_CONFIG.height * 0.6).toFixed(4));
  return `
    // 创建文本: ${text.name || '未命名文本'}
    local Frame ${text.name} = Frame.newText1(${parent.name}, "${text.properties.text || ''}", "TXA${text.properties.fontSize || 12}")
    call ${text.name}.setPoint(TOPLEFT, ${parent.name}, TOPLEFT, ${war3RelativeX}, ${war3RelativeY})
    call ${text.name}.setColor255(${text.properties.red || 0}, ${text.properties.green || 0}, ${text.properties.blue || 0})
  `;
};