# Tasks

- [x] Task 1: 修改 GroupManager.vue 组件，添加分列数选择器
  - [x] 在分组标题区域添加分列数选择器（1、2、3、4列）
  - [x] 实现分列数变更事件，向父组件发射 update:columns 事件
  - [x] 添加分列数选择器的样式，确保与现有UI风格一致

- [x] Task 2: 修改 GroupManager.vue 组件，实现选项网格布局
  - [x] 根据分组的 columns 属性，使用 CSS Grid 布局展示选项
  - [x] 添加网格布局样式，支持 1-4 列的响应式展示
  - [x] 确保选项在网格中均匀分布，间距一致

- [x] Task 3: 修改 RoomCreatorPage.vue，处理分列数变更
  - [x] 在 addGroup 函数中，新分组默认设置 columns: 4
  - [x] 添加 updateGroupColumns 函数处理分列数变更
  - [x] 在 GroupManager 组件上绑定 @update:columns 事件

- [x] Task 4: 更新默认配置中的分组数据
  - [x] 在 defaultRoomConfig 中，为所有默认分组添加 columns: 4
  - [x] 确保现有保存的配置能兼容（无 columns 字段时默认为 4）

# Task Dependencies
- Task 2 依赖 Task 1（需要先有分列数选择器才能看到布局效果）
- Task 3 依赖 Task 1（需要事件发射才能处理变更）
- Task 4 可以与其他任务并行执行
