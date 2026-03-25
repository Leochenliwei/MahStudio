# 游戏配置列表优化 - 规格文档

**创建时间**: 2026-03-25
**状态**: 待评审

---

## 1. 背景与目标

### 1.1 问题现状

当前游戏配置列表查询功能存在以下痛点：
- 无法快速精准定位单条数据（缺失ID精准查询）
- 无法一键锁定自己创建的游戏（无个人资产快速过滤）
- 无法快速筛选最近新增的内容（无时间快捷筛选）
- 交互体验缺失（无回车查询、无状态记忆）

### 1.2 优化目标

| 优化项 | 目标 |
|-------|------|
| 仅看我的状态缓存 | 用户下次进入页面自动保留勾选状态 |
| 时间筛选 | 提供快捷时间范围选项 |
| 回车触发查询 | 提升查询效率 |
| 筛选状态记忆 | 页面刷新后自动恢复用户筛选条件 |
| 默认排序 | 按编辑时间倒序 |

---

## 2. 功能详情

### 2.1 新增「时间筛选」下拉框

**位置**: 原地区下拉框右侧、查询按钮左侧

**选项**:
| 选项 | 值 | 说明 |
|-----|---|------|
| 全部 | `all` | 默认值，不限制时间 |
| 今天 | `today` | 创建时间在今天内 |
| 近7天 | `week` | 创建时间在7天内 |
| 近30天 | `month` | 创建时间在30天内 |
| 本月 | `currentMonth` | 创建时间在本月内 |

**实现逻辑**:
```javascript
function filterByTimeRange(games, timeRange) {
  if (timeRange === 'all') return games

  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  return games.filter(game => {
    const createdAt = new Date(game.createdAt)

    switch (timeRange) {
      case 'today':
        return createdAt >= today
      case 'week':
        const weekAgo = new Date(today)
        weekAgo.setDate(weekAgo.getDate() - 7)
        return createdAt >= weekAgo
      case 'month':
        const monthAgo = new Date(today)
        monthAgo.setDate(monthAgo.getDate() - 30)
        return createdAt >= monthAgo
      case 'currentMonth':
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
        return createdAt >= monthStart
      default:
        return true
    }
  })
}
```

### 2.2 「仅看我的」状态本地缓存

**实现方式**: 使用 `localStorage` 存储勾选状态

```javascript
const ONLY_MINE_KEY = 'gameManagement_onlyMine'

// 加载时恢复状态
onMounted(() => {
  const cached = localStorage.getItem(ONLY_MINE_KEY)
  if (cached !== null) {
    onlyMine.value = cached === 'true'
  }
})

// 状态变化时保存
watch(onlyMine, (newVal) => {
  localStorage.setItem(ONLY_MINE_KEY, String(newVal))
})
```

### 2.3 回车触发查询

**实现方式**: 在 ID 和名称输入框上添加 `@keyup.enter` 事件

```vue
<input
  type="text"
  v-model="searchGameId"
  placeholder="请输入游戏ID"
  class="search-input"
  @keyup.enter="handleSearch"
/>

<input
  type="text"
  v-model="searchGameName"
  placeholder="请输入游戏名称"
  class="search-input"
  @keyup.enter="handleSearch"
/>
```

### 2.4 筛选状态记忆

**存储内容**:
- `onlyMine` 勾选状态
- `searchGameId` 输入内容
- `searchGameName` 输入内容
- `searchTimeRange` 时间筛选选择

**实现方式**:
```javascript
const FILTER_STATE_KEY = 'gameManagement_filterState'

onMounted(() => {
  // 恢复筛选状态
  const cached = localStorage.getItem(FILTER_STATE_KEY)
  if (cached) {
    try {
      const state = JSON.parse(cached)
      searchGameId.value = state.searchGameId || ''
      searchGameName.value = state.searchGameName || ''
      onlyMine.value = state.onlyMine || false
      searchTimeRange.value = state.searchTimeRange || 'all'
    } catch (e) {
      console.error('恢复筛选状态失败:', e)
    }
  }
})

// 筛选状态变化时保存
watch([searchGameId, searchGameName, onlyMine, searchTimeRange], () => {
  saveFilterState()
})

function saveFilterState() {
  const state = {
    searchGameId: searchGameId.value,
    searchGameName: searchGameName.value,
    onlyMine: onlyMine.value,
    searchTimeRange: searchTimeRange.value
  }
  localStorage.setItem(FILTER_STATE_KEY, JSON.stringify(state))
}
```

### 2.5 默认排序优化

**排序规则**: 按 `updatedAt` 降序（最新编辑的排在最前面）

```javascript
function sortGamesByEditTime(games) {
  return [...games].sort((a, b) => {
    const timeA = new Date(a.updatedAt || 0).getTime()
    const timeB = new Date(b.updatedAt || 0).getTime()
    return timeB - timeA
  })
}
```

---

## 3. UI 布局

### 3.1 优化后查询栏布局

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ [仅看我的☑] │ [游戏ID输入] │ [游戏名称输入] │ [时间筛选▼] │ [查询] [重置] │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3.2 时间筛选下拉框样式

- 宽度: 120px
- 选项: 全部 / 今天 / 近7天 / 近30天 / 本月
- 默认选中: 全部

---

## 4. 影响范围

### 4.1 修改文件

- `src/views/admin/GameManagement.vue`

### 4.2 API 变更

- 无后端 API 变更，纯前端优化

---

## 5. 验收标准

### 5.1 功能验收

- [ ] 仅看我的复选框状态在页面刷新后保持
- [ ] 时间筛选下拉框可正常选择并过滤数据
- [ ] ID/名称输入框按回车可触发查询
- [ ] 筛选条件（ID、名称、仅看我的、时间）在刷新后自动恢复
- [ ] 列表默认按编辑时间倒序排列

### 5.2 交互验收

- [ ] 回车键在输入框内可触发查询
- [ ] 查询/重置按钮可正常点击
- [ ] 时间筛选下拉框可正常展开选择
