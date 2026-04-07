# Tasks

- [x] Task 1: 实现光标显示功能
  - [x] SubTask 1.1: 添加光标状态（cursorIndex）
  - [x] SubTask 1.2: 实现光标 DOM 元素渲染
  - [x] SubTask 1.3: 实现光标闪烁动画（CSS animation）
  - [x] SubTask 1.4: 实现光标位置跟随点击

- [x] Task 2: 实现键盘导航功能
  - [x] SubTask 2.1: 添加键盘事件监听（keydown）
  - [x] SubTask 2.2: 实现左方向键移动光标
  - [x] SubTask 2.3: 实现右方向键移动光标
  - [x] SubTask 2.4: 处理边界情况（最左/最右）

- [x] Task 3: 实现 Dropdown 激活功能
  - [x] SubTask 3.1: 点击输入框时打开 dropdown
  - [x] SubTask 3.2: 点击外部时关闭 dropdown
  - [x] SubTask 3.3: 保持输入框焦点状态
  - [x] SubTask 3.4: dropdown 定位优化

- [x] Task 4: 实现光标位置插入
  - [x] SubTask 4.1: 修改 insertElement 支持在光标位置插入
  - [x] SubTask 4.2: 插入后更新光标位置
  - [x] SubTask 4.3: 保持现有的身份默认逻辑

- [x] Task 5: 样式优化
  - [x] SubTask 5.1: 光标样式（2px 宽度，#3b82f6 颜色）
  - [x] SubTask 5.2: 光标高度自适应
  - [x] SubTask 5.3: 过渡动画优化

- [x] Task 6: 测试与验证
  - [x] SubTask 6.1: 测试光标显示和闪烁
  - [x] SubTask 6.2: 测试键盘导航
  - [x] SubTask 6.3: 测试 dropdown 激活和关闭
  - [x] SubTask 6.4: 测试光标位置插入

# Task Dependencies
- Task 2 依赖 Task 1
- Task 3 依赖 Task 1
- Task 4 依赖 Task 1、Task 3
- Task 5 依赖 Task 1、Task 2、Task 3
- Task 6 依赖 Task 5
