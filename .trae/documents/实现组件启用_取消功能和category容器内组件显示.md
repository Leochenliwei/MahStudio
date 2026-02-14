# 实现组件启用/取消功能和category容器内组件显示

## 1. 移除拖拽功能
- 移除组件列表项的 `draggable` 属性和 `@dragstart` 事件
- 移除分类容器的 `@drop` 和 `@dragover` 事件
- 移除画布的 `@drop` 和 `@dragover` 事件
- 移除 `onDragStart`、`onDrop` 和 `onCategoryDrop` 函数

## 2. 添加组件启用/取消按钮
- 在组件列表项中添加开关按钮
- 为每个组件添加 `enabled` 属性，默认为 false
- 实现 `toggleComponent` 函数来切换组件的启用状态
- 确保组件的唯一性，不允许重复启用

## 3. 实现组件在category容器中显示
- 为每个 category 添加 `components` 属性，用于存储该 category 中的组件
- 当组件启用时，根据其 category 属性添加到对应的 category.components 中
- 当组件取消启用时，从对应的 category.components 中移除

## 4. 实现category内组件的顺序排列
- 在 category 容器中添加组件列表的渲染逻辑
- 按照组件在配置文件中的顺序排列组件
- 为 category 内的组件添加适当的样式，使其按顺序对齐排列

## 5. 样式优化
- 为组件列表中的开关按钮添加样式
- 为 category 内的组件添加样式，确保它们按顺序对齐排列
- 优化整体布局，确保功能正常运行且视觉效果美观