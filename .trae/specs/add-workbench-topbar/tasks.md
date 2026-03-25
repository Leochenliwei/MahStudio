# Tasks

- [x] Task 1: 创建顶部操作栏组件结构
  - [x] SubTask 1.1: 在 workbench-container 内添加 top-action-bar 容器
  - [x] SubTask 1.2: 左侧添加游戏信息区域（标题、草稿ID、cfgID）
  - [x] SubTask 1.3: 右侧添加操作按钮区域（保存、提测）

- [x] Task 2: 实现游戏信息展示逻辑
  - [x] SubTask 2.1: 绑定游戏标题显示（selectedConfig.name）
  - [x] SubTask 2.2: 绑定草稿ID显示（从路由或数据获取）
  - [x] SubTask 2.3: 绑定 cfgID 显示（从配置数据获取）

- [x] Task 3: 实现操作按钮功能
  - [x] SubTask 3.1: 保存按钮绑定 save() 方法
  - [x] SubTask 3.2: 提测按钮绑定 publish() 方法
  - [x] SubTask 3.3: 确保快捷键功能正常（Ctrl+S、Ctrl+Enter）

- [x] Task 4: 调整原有布局
  - [x] SubTask 4.1: 移除或简化原有的 workbench-toolbar
  - [x] SubTask 4.2: 调整 workbench-main 的布局以适应新顶部栏
  - [x] SubTask 4.3: 确保三栏布局（左侧组件列表、中间画布、右侧属性面板）正常

- [x] Task 5: 添加样式
  - [x] SubTask 5.1: 顶部操作栏容器样式
  - [x] SubTask 5.2: 左侧信息区域样式（标签样式）
  - [x] SubTask 5.3: 右侧按钮区域样式
  - [x] SubTask 5.4: 响应式适配（小屏幕时信息区域可滚动）

- [x] Task 6: 测试验证
  - [x] SubTask 6.1: 使用 webapp-testing skill 进行功能测试
  - [x] SubTask 6.2: 验证保存功能正常
  - [x] SubTask 6.3: 验证提测功能正常
  - [x] SubTask 6.4: 验证快捷键功能正常

# Task Dependencies
- Task 2 依赖 Task 1
- Task 3 依赖 Task 1
- Task 4 依赖 Task 1、Task 3
- Task 5 依赖 Task 1、Task 2、Task 3
- Task 6 依赖 Task 1-5
