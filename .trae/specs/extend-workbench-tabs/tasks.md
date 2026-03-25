# Tasks

- [x] Task 1: 创建 Tab 栏组件结构
  - [x] SubTask 1.1: 在 top-action-bar 下方添加 tab-bar 容器
  - [x] SubTask 1.2: 添加三个 Tab 项：规则配置、创房选项、选项联动
  - [x] SubTask 1.3: 添加当前选中 Tab 的状态管理

- [x] Task 2: 实现 Tab 切换功能
  - [x] SubTask 2.1: 点击 Tab 切换当前活动 Tab
  - [x] SubTask 2.2: 选中的 Tab 显示高亮样式
  - [x] SubTask 2.3: 添加 Tab 切换动画效果

- [x] Task 3: 实现规则配置 Tab 内容
  - [x] SubTask 3.1: 将原有工作台内容移至规则配置 Tab
  - [x] SubTask 3.2: 确保三栏布局正常工作
  - [x] SubTask 3.3: 保持原有功能不变（组件列表、画布、属性面板）

- [x] Task 4: 实现创房选项 Tab 内容
  - [x] SubTask 4.1: 导入 RoomCreatorPage 组件
  - [x] SubTask 4.2: 以嵌入模式显示 RoomCreatorPage
  - [x] SubTask 4.3: 传递必要的 props（gameId、embedded）

- [x] Task 5: 实现选项联动 Tab 内容
  - [x] SubTask 5.1: 导入 SimpleDependencyPage 组件
  - [x] SubTask 5.2: 以嵌入模式显示 SimpleDependencyPage
  - [x] SubTask 5.3: 传递必要的 props（gameId、embedded、formSchema）

- [x] Task 6: 添加 Tab 栏样式
  - [x] SubTask 6.1: Tab 栏容器样式（高度、背景、边框）
  - [x] SubTask 6.2: Tab 项样式（默认、hover、选中状态）
  - [x] SubTask 6.3: 选中指示器样式
  - [x] SubTask 6.4: Tab 内容区域布局

- [x] Task 7: 测试验证
  - [x] SubTask 7.1: 使用 webapp-testing skill 进行功能测试
  - [x] SubTask 7.2: 验证 Tab 切换正常
  - [x] SubTask 7.3: 验证规则配置 Tab 功能完整
  - [x] SubTask 7.4: 验证创房选项 Tab 功能完整
  - [x] SubTask 7.5: 验证选项联动 Tab 功能完整

# Task Dependencies
- Task 2 依赖 Task 1
- Task 3 依赖 Task 1
- Task 4 依赖 Task 1
- Task 5 依赖 Task 1
- Task 6 依赖 Task 1-5
- Task 7 依赖 Task 1-6
