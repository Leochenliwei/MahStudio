# 任务列表

- [x] Task 1: 创建 ComponentSelector.vue 组件
  - [x] 创建 src/components/ComponentSelector.vue 文件
  - [x] 实现组件选择器模板结构（左侧组件列表+右侧属性面板）
  - [x] 实现 Props 定义（show、components、editingOptionIndex、editingOptionLabel）
  - [x] 实现 Events 定义（close、confirm、toggle-component-status、update-component-property）
  - [x] 实现组件搜索过滤功能
  - [x] 实现分类文件夹展开/折叠功能
  - [x] 实现组件多选功能
  - [x] 实现组件启用/禁用切换功能
  - [x] 实现属性勾选和编辑功能
  - [x] 实现属性类型支持（switch、toggle、select、checkbox、text）
  - [x] 实现视觉连接线动态定位
  - [x] 复制原有样式到组件中

- [x] Task 2: 改造 Drawer.vue 使用新组件
  - [x] 导入 ComponentSelector 组件
  - [x] 移除原有的组件选择器模板代码
  - [x] 移除原有的组件选择器 script 逻辑
  - [x] 使用 ComponentSelector 组件替换原有代码
  - [x] 保持 Props 和 Events 传递
  - [x] 确保组件选择器显示/隐藏逻辑正常

# Task Dependencies
- Task 2 依赖于 Task 1
