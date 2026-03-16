# Tasks

- [x] Task 1: 修改 SimpleDependencyPage.vue 添加 formSchema prop 支持
  - [x] SubTask 1.1: 在 props 中添加 formSchema 定义
  - [x] SubTask 1.2: 修改 loadConfig 逻辑，优先使用 prop 数据
  - [x] SubTask 1.3: 添加 watch 监听 prop 变化

- [x] Task 2: 修改 RoomCreatorPage.vue 传递 formSchema 数据
  - [x] SubTask 2.1: 在 SimpleDependencyPage 组件上添加 :form-schema="roomConfig.groups"

- [x] Task 3: 验证数据流完整性
  - [x] SubTask 3.1: 验证 RuleEditorModalPro 正确接收 formSchema
  - [x] SubTask 3.2: 验证 ConditionTree 正确接收 allComponents
  - [x] SubTask 3.3: 使用 webapp-testing skill 进行端到端测试

# Task Dependencies
- Task 2 depends on Task 1
- Task 3 depends on Task 2
