# 亮色系主题改造任务列表

- [x] Task 1: 更新全局CSS变量（style.css）
  - [x] SubTask 1.1: 修改主色调变量（保持蓝色系但调整为更清爽的蓝）
  - [x] SubTask 1.2: 修改背景色变量（深色→浅色）
  - [x] SubTask 1.3: 修改文本颜色变量（浅色→深色）
  - [x] SubTask 1.4: 修改边框颜色变量（适配亮色系）
  - [x] SubTask 1.5: 修改阴影变量（适配亮色系）
  - [x] SubTask 1.6: 移除color-scheme: dark设置

- [x] Task 2: 更新工作台页面样式（Workbench.vue）
  - [x] SubTask 2.1: 修改工作台容器背景色
  - [x] SubTask 2.2: 修改画布网格线颜色
  - [x] SubTask 2.3: 修改分类容器样式（边框、背景）
  - [x] SubTask 2.4: 修改步骤节点和连接线颜色
  - [x] SubTask 2.5: 修改组件项悬停效果
  - [x] SubTask 2.6: 修改面板样式

- [x] Task 3: 更新应用主框架样式（App.vue）
  - [x] SubTask 3.1: 修改应用容器背景色
  - [x] SubTask 3.2: 修改标签栏样式
  - [x] SubTask 3.3: 修改标签项样式（活跃/非活跃状态）
  - [x] SubTask 3.4: 修改窗口控制按钮区域背景

- [x] Task 4: 更新设计规范文档（design_rule.md）
  - [x] SubTask 4.1: 更新颜色规范部分
  - [x] SubTask 4.2: 更新背景色说明
  - [x] SubTask 4.3: 更新文本颜色说明

- [x] Task 5: 测试验证
  - [x] SubTask 5.1: 启动开发服务器
  - [x] SubTask 5.2: 验证首页显示
  - [x] SubTask 5.3: 验证工作台页面显示
  - [x] SubTask 5.4: 验证各组件样式正确性

# Task Dependencies
- Task 2 依赖 Task 1（需要先定义CSS变量）
- Task 3 依赖 Task 1
- Task 4 依赖 Task 1、Task 2、Task 3
- Task 5 依赖 Task 1、Task 2、Task 3、Task 4
