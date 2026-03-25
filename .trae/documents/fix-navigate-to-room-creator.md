# 修复导航到独立创房页面计划

## Why
当前点击 Workbench 底栏"创房选项"按钮时，路由跳转到 `/workbench/:id/room-creator`，但这个路由仍然是 Workbench 的子路由。用户希望创房面板作为独立页面打开。

## What Changes

### 路由结构调整
将路由从 `/workbench/:id/room-creator` 改为 `/room-creator/:id`，使其成为独立页面，不再嵌套在 Workbench 下。

### 修改文件清单

| 文件 | 变更内容 |
|------|----------|
| `src/router/index.js` | 修改 RoomCreator 路由 path 为 `/room-creator/:id` |
| `src/views/Workbench.vue` | 修改 navigateToRoomCreator 函数使用新路由 |

## Tasks

### Task 1: 修改路由配置
- [ ] 将 `path: '/workbench/:id/room-creator'` 改为 `path: '/room-creator/:id'`

### Task 2: 修改导航函数
- [ ] 更新 `navigateToRoomCreator` 函数使用新路由

### Task 3: 测试验证
- [ ] 验证路由跳转正常
- [ ] 验证页面显示正确（作为独立页面）
