# Tasks

- [x] Task 1: 创建 EditorDialogContainer.vue 弹窗容器组件
  - [x] SubTask 1.1: 创建基础弹窗容器结构
  - [x] SubTask 1.2: 实现弹窗状态管理（visible、currentEditor、editorData）
  - [x] SubTask 1.3: 实现 openEditor 和 closeEditor 方法

- [x] Task 2: 移植并改造 MahjongStackDialog.vue（牌堆选择器）
  - [x] SubTask 2.1: 复制参考代码到 src/components/editors/
  - [x] SubTask 2.2: 改造为支持 mock 数据模式
  - [x] SubTask 2.3: 添加 confirm 和 close 事件处理
  - [x] SubTask 2.4: 使用占位图片替代真实麻将图片

- [x] Task 3: 移植并改造 ScoreCalculationFormulaEditing.vue（算分公式编辑器）
  - [x] SubTask 3.1: 复制参考代码到 src/components/editors/
  - [x] SubTask 3.2: 改造为支持 mock 数据模式（mock 玩家列表）
  - [x] SubTask 3.3: 集成 ConfigFormulaPure 组件（如可用）或简化实现
  - [x] SubTask 3.4: 添加 confirm 和 close 事件处理

- [x] Task 4: 改造 Workbench.vue 集成弹窗系统
  - [x] SubTask 4.1: 导入 EditorDialogContainer 组件
  - [x] SubTask 4.2: 修改 handleButtonClick 方法，根据 editorType 打开对应弹窗
  - [x] SubTask 4.3: 添加弹窗确认回调处理（同步值到 propertyValues）
  - [x] SubTask 4.4: 在模板中添加 EditorDialogContainer 组件

- [x] Task 5: 创建 mock 数据文件
  - [x] SubTask 5.1: 创建 src/mock/editorMockData.ts
  - [x] SubTask 5.2: 定义 mock 牌堆数据
  - [x] SubTask 5.3: 定义 mock 玩家数据（庄家、闲家等）

- [x] Task 6: 测试验证
  - [x] SubTask 6.1: 启动开发服务器
  - [x] SubTask 6.2: 验证牌堆选择器弹窗正常打开和关闭
  - [x] SubTask 6.3: 验证算分公式编辑器弹窗正常打开和关闭
  - [x] SubTask 6.4: 验证弹窗值正确同步到属性面板

# Task Dependencies
- Task 2 depends on Task 1
- Task 3 depends on Task 1
- Task 4 depends on Task 2 and Task 3
- Task 5 can be done in parallel with Task 2 and Task 3
- Task 6 depends on Task 4
