# 任务列表

- [x] Task 1: 在RoomCreatorPage.vue中添加简版Tab按钮
  - [x] 在Tab栏新增"选项联动（简版）"按钮
  - [x] 添加点击事件跳转到简版页面
  - [x] 使用Icon组件添加合适的图标

- [x] Task 2: 新增简版页面路由
  - [x] 在router/index.js中添加简版页面路由配置
  - [x] 路径格式：/workbench/:id/simple-dependency

- [x] Task 3: 创建简版联动规则管理页面
  - [x] 创建SimpleDependencyPage.vue文件
  - [x] 实现页面布局和标题栏
  - [x] 实现规则列表表格展示
  - [x] 实现新增规则功能
  - [x] 实现编辑规则功能
  - [x] 实现删除规则功能
  - [x] 实现返回高阶编辑器按钮

- [x] Task 4: 数据同步
  - [x] 从localStorage读取联动规则数据
  - [x] 保存时同步回localStorage
  - [x] 确保与高阶编辑器数据一致

# Task Dependencies
- Task 2 依赖于 Task 1
- Task 3 依赖于 Task 2
- Task 4 依赖于 Task 3
