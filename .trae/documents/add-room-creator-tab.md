# 新增创房页面虚拟 Tab 计划

## Why
当用户点击"创房选项"按钮跳转到独立的 `/room-creator/:id` 页面时，需要在顶部标签栏显示一个虚拟标签页，格式为"创房-{{gameName}}-{{cfgId}}"，方便用户识别和切换。

## What Changes

### App.vue 修改
在路由监听逻辑中新增对 `/room-creator/` 路由的处理：

| 路由 | Tab 名称格式 | 示例 |
|------|-------------|------|
| `/room-creator/:id` | `创房-{gameName}-{cfgId}` | `创房-麻城痞子杠-1` |

### 获取游戏信息
- 从 `localStorage` 或 `route.query` 获取游戏名称和 cfgId
- 如果没有游戏名称，使用默认名称 `创房-{cfgId}`

## 修改文件清单

| 文件 | 变更内容 |
|------|----------|
| `src/App.vue` | 在 watch route 逻辑中添加 `/room-creator/` 路由处理，创建虚拟标签页 |

## Tasks

### Task 1: 修改 App.vue 路由监听逻辑
- [ ] 在 watch route 回调中添加对 `/room-creator/` 路由的识别
- [ ] 解析路由参数获取 gameId、gameName、cfgId
- [ ] 创建虚拟标签页，格式：`创房-{gameName}-{cfgId}`
- [ ] 更新标签页活跃状态

### Task 2: 修改 onMounted 初始化逻辑
- [ ] 添加对当前路径为 `/room-creator/` 的处理

### Task 3: 测试验证
- [ ] 验证从 Workbench 跳转后标签页正确显示
- [ ] 验证标签名称格式正确
