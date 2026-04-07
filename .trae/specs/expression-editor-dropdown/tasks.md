# Tasks

- [x] Task 1: 重构 ExpressionInput.vue 基础结构
  - [x] SubTask 1.1: 创建组件容器，使用相对定位
  - [x] SubTask 1.2: 分离输入框和编辑器面板为独立区域
  - [x] SubTask 1.3: 实现输入框单行显示样式（40-48px高度）
  - [x] SubTask 1.4: 添加下拉箭头图标到输入框右侧

- [x] Task 2: 实现 Dropdown 展开/关闭逻辑
  - [x] SubTask 2.1: 实现点击输入框展开 dropdown
  - [x] SubTask 2.2: 实现点击外部区域关闭 dropdown
  - [x] SubTask 2.3: 实现按 Esc 键关闭 dropdown
  - [x] SubTask 2.4: 实现 dropdown 定位逻辑（下方/上方自适应）
  - [x] SubTask 2.5: 添加 dropdown 展开/关闭动画

- [x] Task 3: 实现 Dropdown 内编辑器面板
  - [x] SubTask 3.1: 创建 dropdown 容器（最小高度 300px）
  - [x] SubTask 3.2: 实现左右布局（键盘 50-55%，元素面板 45-50%）
  - [x] SubTask 3.3: 迁移虚拟键盘到 dropdown 内
  - [x] SubTask 3.4: 迁移元素选择面板到 dropdown 内
  - [x] SubTask 3.5: 确保选择元素后 dropdown 保持打开

- [x] Task 4: 优化输入框内容显示
  - [x] SubTask 4.1: 在输入框中显示元素标签（主题色）
  - [x] SubTask 4.2: 实现标签和普通文本混合显示
  - [x] SubTask 4.3: 实现内容溢出时显示省略号
  - [x] SubTask 4.4: 保持 placeholder 显示逻辑

- [x] Task 5: 保持键盘快捷键功能
  - [x] SubTask 5.1: 确保 Ctrl+E 在 dropdown 展开时聚焦搜索框
  - [x] SubTask 5.2: 确保 Ctrl+D 在 dropdown 展开时清空表达式
  - [x] SubTask 5.3: 确保 ↑/↓ 在元素列表中导航
  - [x] SubTask 5.4: 确保 Enter 选择高亮元素

- [x] Task 6: 样式和交互优化
  - [x] SubTask 6.1: 统一 dropdown 边框和阴影样式
  - [x] SubTask 6.2: 优化 dropdown 与输入框的视觉连接
  - [x] SubTask 6.3: 确保所有按钮保持 44×44px 最小点击区域
  - [x] SubTask 6.4: 添加过渡动画（展开/关闭 200ms）

- [x] Task 7: 测试与验证
  - [x] SubTask 7.1: 测试 dropdown 展开/关闭功能
  - [x] SubTask 7.2: 测试点击外部关闭功能
  - [x] SubTask 7.3: 测试 Esc 键关闭功能
  - [x] SubTask 7.4: 测试键盘和元素选择功能在 dropdown 内正常
  - [x] SubTask 7.5: 测试输入框内容显示正确
  - [x] SubTask 7.6: 测试与 ActionLimitEditor 集成正常

# Task Dependencies
- Task 2 依赖 Task 1
- Task 3 依赖 Task 2
- Task 4 依赖 Task 1
- Task 5 依赖 Task 3
- Task 6 依赖 Task 3
- Task 7 依赖 Task 5、Task 6
