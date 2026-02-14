// 解析 JSON 文件并提取 tabcontainer 组件及其属性
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 读取 JSON 文件
const jsonPath = path.join(__dirname, '资料/rule_config fixlaizi.json');
const jsonContent = fs.readFileSync(jsonPath, 'utf8');
const config = JSON.parse(jsonContent);

// 提取 tabcontainer 组件
const components = [];

if (config.elements && Array.isArray(config.elements)) {
  config.elements.forEach(element => {
    if (element.type === 'tab_container') {
      const component = {
        id: element.id,
        name: element.title,
        category: element.category,
        properties: []
      };

      // 提取子元素作为属性
      if (element.elements && Array.isArray(element.elements)) {
        element.elements.forEach(prop => {
          const property = {
            id: prop.id,
            name: prop.title,
            type: prop.type,
            defaultValue: prop.defaultValue
          };

          // 添加其他相关属性
          if (prop.datas) property.datas = prop.datas;
          if (prop.visibleWhen) property.visibleWhen = prop.visibleWhen;
          if (prop.description) property.description = prop.description;
          if (prop.titleWidth) property.titleWidth = prop.titleWidth;
          if (prop.itemWidth) property.itemWidth = prop.itemWidth;
          if (prop.extend) property.extend = prop.extend;
          if (prop.multiSelect) property.multiSelect = prop.multiSelect;
          if (prop.columnCount) property.columnCount = prop.columnCount;
          if (prop.layout) property.layout = prop.layout;
          if (prop.isFullWidth) property.isFullWidth = prop.isFullWidth;

          component.properties.push(property);
        });
      }

      components.push(component);
    }
  });
}

// 生成结果
const result = {
  components: components,
  totalComponents: components.length
};

// 保存结果到新文件
const outputPath = path.join(__dirname, 'components_list.json');
fs.writeFileSync(outputPath, JSON.stringify(result, null, 2), 'utf8');

console.log(`成功提取 ${components.length} 个组件`);
console.log(`结果已保存到: ${outputPath}`);

// 打印组件列表
console.log('\n组件列表:');
components.forEach((component, index) => {
  console.log(`${index + 1}. ${component.name} (${component.category}) - ${component.properties.length} 个属性`);
});
