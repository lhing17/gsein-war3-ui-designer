import { CANVAS_CONFIG } from "../config/canvasConfig.js";

// src/lib/jass-generator.js
const generateJassCode = (components) => {
  let code = `// 自动生成的War3 UI代码\n`;
  code += "function InitCustomUI takes nothing returns nothing\n";

  components.forEach(comp => {
    switch (comp.type) {
      case 'IMAGE_BUTTON':
        code += generateButtonCode(comp, components);
        break;
      case 'TEXT':
        code += generateTextCode(comp, components);
        break;
      case 'IMAGE':
        code += generateImageCode(comp, components);
        break;
      // 其他组件类型...
    }
  });

  code += "endfunction\n";

  // 将局部变量转换为全局变量
  code = convertLocalsToGlobals(code)

  return code;
};

export { generateJassCode };

const convertLocalsToGlobals = (code) => {
  // 匹配所有局部变量声明
  // 提取所有Frame变量名
  const frameVars = [...new Set(Array.from(code.matchAll(/local Frame\s+(\w+)\s+=/g)).map(m => m[1]))];

  // 生成全局声明块
  const globalsBlock = `globals\n${frameVars.map(v => `    Frame ${v}`).join('\n')}\nendglobals\n\n`;

  // 将local Frame替换为set
  code = code.replace(/local Frame\s+(\w+)\s+=/g, 'set $1 =')

  return globalsBlock + code;
}

const generateImageCode = (image, components) => {
  // 获取父级组件
  let parent = components.find(comp => comp.id === image.properties.parentId) || { name: 'GUI', position: { x: 0, y: 0 } }
  // 计算相对位置
  let relativeX = image.position.x - parent.position.x
  let relativeY = image.position.y - parent.position.y
  // 计算war3坐标下的相对位置
  let war3RelativeX = parseFloat((relativeX / CANVAS_CONFIG.width * 0.8).toFixed(4));
  let war3RelativeY = parseFloat((relativeY / CANVAS_CONFIG.height * 0.6).toFixed(4));
  // 计算war3坐标下的宽度和高度
  let war3Width = parseFloat((image.size.width / CANVAS_CONFIG.width * 0.8).toFixed(4));
  let war3Height = parseFloat((image.size.height / CANVAS_CONFIG.height * 0.6).toFixed(4));
  // 生成jass代码
  return `
    // 创建图片: ${image.name || '未命名图片'}
    local Frame ${image.name}Widget = Frame.newImage(${parent.name}, "war3mapImported\\${image.properties.image || 'help.tga'}", ${war3Width}, ${war3Height})
    call ${image.name}Widget.setPoint(TOPLEFT, ${parent.name}, TOPLEFT, ${war3RelativeX}, ${war3RelativeY})
  `
}

const generateButtonCode = (button, components) => {

  // 获取父级组件
  let parent = components.find(comp => comp.id === button.properties.parentId) || { name: 'GUI', position: { x: 0, y: 0 } }
  // 计算相对位置
  let relativeX = button.position.x - parent.position.x
  let relativeY = button.position.y - parent.position.y
  // 计算war3坐标下的相对位置
  let war3RelativeX = parseFloat((relativeX / CANVAS_CONFIG.width * 0.8).toFixed(4));
  let war3RelativeY = parseFloat((relativeY / CANVAS_CONFIG.height * 0.6).toFixed(4));
  // 计算war3坐标下的宽度和高度
  let war3Width = parseFloat((button.size.width / CANVAS_CONFIG.width * 0.8).toFixed(4));
  let war3Height = parseFloat((button.size.height / CANVAS_CONFIG.height * 0.6).toFixed(4));
  return `
    // 创建按钮: ${button.name || '未命名按钮'}
    local Frame ${button.name}Widget = Frame.newImageButton1(${parent.name}, "war3mapImported\\${button.properties.image || 'help.tga'}", ${war3Width}, ${war3Height})
    call ${button.name}Widget.setPoint(TOPLEFT, ${parent.name}, TOPLEFT, ${war3RelativeX}, ${war3RelativeY})

    local Frame ${button.name}Button = Frame.newTextButton(${button.name}Widget)
    call ${button.name}Button.setAllPoints(${button.name}Widget)
    call ${button.name}Button.registerEvent(FRAME_EVENT_PRESSED, function ${button.events && button.events.onClick || 'DoNothing'})
    call ${button.name}Button.registerEvent(FRAME_EVENT_ENTER, function ${button.events && button.events.onEnter || 'DoNothing'})
    call ${button.name}Button.registerEvent(FRAME_EVENT_LEAVE, function ${button.events && button.events.onLeave || 'DoNothing'})

  `;
};

const generateTextCode = (text, components) => {
  // 获取父级组件
  let parent = components.find(comp => comp.id === text.properties.parentId) || { name: 'GUI', position: { x: 0, y: 0 } }
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