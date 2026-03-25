# 统一虚拟标签页系统 - 任务列表

## 任务概览
将 Workbench.vue、GameDirectory.vue 和 Admin.vue 统一为项目内部的虚拟标签页，取消打开工作台时新开浏览器标签页的行为。

## 任务列表

- [x] Task 1: 修改 App.vue 中的标签页管理逻辑，支持 Workbench 作为虚拟标签页
  - [x] SubTask 1.1: 修改 `openGameTab` 方法，从 `window.open` 改为创建虚拟标签页
  - [x] SubTask 1.2: 更新路由监听逻辑，支持 Workbench 路由创建虚拟标签页
  - [x] SubTask 1.3: 确保 Workbench 标签页可以正确关闭和切换

- [x] Task 2: 修改 GameDirectory.vue 中的编辑/查看逻辑
  - [x] SubTask 2.1: 修改 `editFile` 方法，调用更新后的 `openGameTab`
  - [x] SubTask 2.2: 修改 `viewFile` 方法，调用更新后的 `openGameTab`
  - [x] SubTask 2.3: 确保创建草稿后的跳转也使用虚拟标签页

- [x] Task 3: 修改 Admin.vue 中的进入游戏目录逻辑
  - [x] SubTask 3.1: 确保 `enterGameDirectory` 方法正确调用 `openGameDirectoryTab`
  - [x] SubTask 3.2: 验证新增游戏后的跳转行为

- [x] Task 4: 测试验证
  - [x] SubTask 4.1: 测试从 GameDirectory 打开 Workbench 不新开浏览器标签页
  - [x] SubTask 4.2: 测试多个 Workbench 标签页可以共存
  - [x] SubTask 4.3: 测试标签页切换和关闭功能正常
  - [x] SubTask 4.4: 测试三个页面（Admin、GameDirectory、Workbench）可共存

## 任务依赖
- Task 2 依赖于 Task 1
- Task 3 依赖于 Task 1
- Task 4 依赖于 Task 1、Task 2、Task 3

## 关键修改点

### 1. App.vue
- 修改 `openGameTab` 方法：从 `window.open(url.toString(), '_blank')` 改为创建虚拟标签页并路由跳转
- 更新路由监听：在 `watch(() => route.path, ...)` 中添加对 `/workbench/` 路由的处理

### 2. GameDirectory.vue
- `editFile` 和 `viewFile` 方法已经调用 `window.openGameTab`，只需确保 App.vue 中的方法正确实现

### 3. Admin.vue
- `enterGameDirectory` 方法已经调用 `openGameDirectoryTab`，无需修改
