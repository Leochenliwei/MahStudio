# ExpressionInput 选中状态优化计划

## 任务描述
优化 ExpressionInput.vue 中表达式单元的选中状态样式，使其更加突出和醒目。

## 当前状态分析

当前选中状态样式（第 1186-1190 行）：
```scss
&.is-selected {
  border-color: $primary-color;
  background: $primary-light;
  box-shadow: 0 0 0 2px rgba($primary-color, 0.2);
}
```

存在的问题：
1. 阴影效果较弱（0.2 透明度），在亮色背景下不够明显
2. 边框颜色与主题色相同，但对比度不够强烈
3. 缺少视觉层次感，用户难以快速识别选中状态
4. 缺少缩放效果，无法通过大小变化吸引注意力

## 优化方案

参考 UI/UX Pro Max skill 的设计原则，采用以下增强策略：

### 1. 增强阴影效果
- 增加阴影透明度从 0.2 到 0.3
- 增加阴影扩散范围，提升视觉深度

### 2. 增强边框对比
- 边框加粗（1px → 2px）
- 使用更深的主题色变体

### 3. 添加微妙的内发光效果
- 使用 inset box-shadow 创建内发光
- 增强选中状态的视觉焦点

### 4. 添加缩放效果（新增）
- 选中时轻微放大（scale 1.02-1.05）
- 配合阴影增强立体感
- 平滑的缩放过渡动画

### 5. 添加微浮动效果
- 选中时轻微上浮（translateY -1px ~ -2px）
- 增强选中元素的层次感

## 具体实现

```scss
&.is-selected {
  border-color: $primary-color;
  border-width: 2px;
  background: $primary-light;
  box-shadow: 
    0 4px 12px rgba($primary-color, 0.25),
    0 0 0 3px rgba($primary-color, 0.15),
    inset 0 0 0 1px rgba($primary-color, 0.1);
  transform: scale(1.03) translateY(-2px);
  z-index: 10;
}
```

## 实施步骤

1. **修改 SCSS 样式** - 更新 `.expression-unit.is-selected` 的样式定义
2. **验证效果** - 确保在各种背景下都能清晰识别选中状态
3. **测试交互** - 验证选中/取消选中的过渡效果流畅

## 预期效果

选中状态将更加醒目，用户能够：
- 通过缩放效果快速识别当前选中的表达式单元
- 获得更好的视觉反馈和层次感
- 提升整体编辑体验
