# Checklist

- [x] ExpressionInput.vue 基础结构重构完成
  - [x] 组件容器使用相对定位
  - [x] 输入框和编辑器面板分离为独立区域
  - [x] 输入框单行显示样式（40-48px 高度）
  - [x] 输入框右侧显示下拉箭头图标
  - [x] 输入框边框、圆角与 Element Plus 一致

- [x] Dropdown 展开/关闭逻辑实现正确
  - [x] 点击输入框展开 dropdown
  - [x] 点击外部区域关闭 dropdown
  - [x] 按 Esc 键关闭 dropdown
  - [x] Dropdown 定位逻辑正确（下方/上方自适应）
  - [x] Dropdown 展开/关闭动画流畅（200ms）

- [x] Dropdown 内编辑器面板实现正确
  - [x] Dropdown 容器最小高度 300px
  - [x] 左右布局比例正确（键盘 50-55%，元素面板 45-50%）
  - [x] 虚拟键盘在 dropdown 内正常显示
  - [x] 元素选择面板在 dropdown 内正常显示
  - [x] 选择元素后 dropdown 保持打开

- [x] 输入框内容显示优化完成
  - [x] 输入框中正确显示元素标签（主题色背景）
  - [x] 标签和普通文本混合显示正常
  - [x] 内容溢出时显示省略号
  - [x] Placeholder 显示逻辑正常

- [x] 键盘快捷键功能保持正常
  - [x] Ctrl+E 在 dropdown 展开时聚焦搜索框
  - [x] Ctrl+D 在 dropdown 展开时清空表达式
  - [x] ↑/↓ 在元素列表中导航正常
  - [x] Enter 选择高亮元素正常

- [x] 样式和交互优化完成
  - [x] Dropdown 边框和阴影样式统一
  - [x] Dropdown 与输入框视觉连接自然
  - [x] 所有按钮满足 44×44px 最小点击区域
  - [x] 过渡动画时长 200ms

- [x] 功能测试通过
  - [x] Dropdown 展开/关闭功能正常
  - [x] 点击外部关闭功能正常
  - [x] Esc 键关闭功能正常
  - [x] 键盘按钮功能在 dropdown 内正常
  - [x] 元素选择功能在 dropdown 内正常
  - [x] 输入框内容显示正确
  - [x] 与 ActionLimitEditor 集成正常
