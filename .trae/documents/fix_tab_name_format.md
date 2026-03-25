# 修复标签页名称格式不一致问题

## 问题描述

从游戏管理页面进入游戏目录时，标签页名称显示为 `游戏目录 ${gameId}` 而不是预期的 `控制台-${gameName}`。

## 问题分析

有两个地方会创建/更新游戏目录标签页：

### 1. `openGameDirectoryTab` 函数（App.vue 第308-330行）
- 被 `GameManagement.vue` 调用
- 正确生成标签页名称：`控制台-${gameName}` 或 `控制台- ${gameId}`
- 创建标签页后执行 `router.push()` 跳转

### 2. 路由监听 `watch(() => route.path, ...)`（App.vue 第384-400行）
- 监听路由变化，当路径包含 `/game-directory/` 时触发
- 从 `route.query.gameName` 获取游戏名称
- **问题**：使用错误的默认名称格式 `游戏目录 ${gameId}`
- 如果找不到对应标签页，会创建新标签页覆盖之前的

### 流程冲突
1. `GameManagement.vue` 调用 `openGameDirectoryTab()`
2. `openGameDirectoryTab` 创建正确名称的标签页
3. `router.push()` 触发路由变化
4. 路由监听到变化，由于 `gameName` 可能为 undefined，使用默认名称创建/更新标签页
5. 最终显示的是路由监听中设置的名称 `游戏目录 ${gameId}`

## 修复方案

统一标签页命名格式，将路由监听中的默认名称从 `游戏目录 ${gameId}` 改为 `控制台- ${gameId}`。

需要修改的位置：
1. **App.vue 第395行**：路由监听中创建新标签页时的默认名称
2. **App.vue 第391行**：路由监听中更新现有标签页时的名称
3. **App.vue 第468行**：`onMounted` 中初始化标签页时的默认名称

## 修改内容

### 修改1：路由监听 - 更新现有标签页（第391行）
```javascript
// 修改前
if (gameName) existingTab.name = gameName

// 修改后
if (gameName) existingTab.name = `控制台-${gameName}`
```

### 修改2：路由监听 - 创建新标签页（第395行）
```javascript
// 修改前
name: gameName || `游戏目录 ${gameId}`,

// 修改后
name: gameName ? `控制台-${gameName}` : `控制台- ${gameId}`,
```

### 修改3：onMounted 初始化 - 创建新标签页（第468行）
```javascript
// 修改前
name: gameName || `游戏目录 ${gameId}`,

// 修改后
name: gameName ? `控制台-${gameName}` : `控制台- ${gameId}`,
```

## 验证步骤

1. 从游戏管理页面点击"进入"按钮
2. 检查新打开的标签页名称是否为 `控制台-xxx游戏`
3. 刷新页面后，检查标签页名称是否保持一致
