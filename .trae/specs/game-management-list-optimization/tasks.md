# 游戏配置列表优化 - 任务清单

**创建时间**: 2026-03-25
**相关规格**: spec.md

---

## 任务列表

### 任务 1: 添加时间筛选相关状态和常量

- [ ] **1.1** 添加 `searchTimeRange` ref 状态变量，初始值为 `'all'`
- [ ] **1.2** 添加时间筛选选项常量 `TIME_RANGE_OPTIONS`

### 任务 2: 实现时间筛选功能

- [ ] **2.1** 添加 `filterByTimeRange()` 函数，实现时间范围过滤逻辑
- [ ] **2.2** 在 `handleSearch()` 函数中集成时间筛选逻辑
- [ ] **2.3** 在 `handleReset()` 函数中重置 `searchTimeRange`

### 任务 3: 添加仅看我的状态本地缓存

- [ ] **3.1** 定义 `localStorage` key 常量 `ONLY_MINE_KEY`
- [ ] **3.2** 在 `onMounted` 中从 `localStorage` 恢复 `onlyMine` 状态
- [ ] **3.3** 添加 `watch` 监听 `onlyMine` 变化并保存到 `localStorage`

### 任务 4: 实现筛选状态记忆功能

- [ ] **4.1** 定义 `FILTER_STATE_KEY` 常量
- [ ] **4.2** 添加 `saveFilterState()` 函数保存筛选状态到 `localStorage`
- [ ] **4.3** 添加 `loadFilterState()` 函数从 `localStorage` 恢复筛选状态
- [ ] **4.4** 在 `onMounted` 中调用 `loadFilterState()`
- [ ] **4.5** 添加 `watch` 监听所有筛选条件，状态变化时调用 `saveFilterState()`

### 任务 5: 添加回车触发查询

- [ ] **5.1** 在 `searchGameId` 输入框添加 `@keyup.enter="handleSearch"`
- [ ] **5.2** 在 `searchGameName` 输入框添加 `@keyup.enter="handleSearch"`

### 任务 6: 实现默认按编辑时间倒序排序

- [ ] **6.1** 添加 `sortGamesByEditTime()` 函数
- [ ] **6.2** 在 `loadGames()` 函数中对结果调用排序函数
- [ ] **6.3** 在 `handleReset()` 函数中保持排序不变

### 任务 7: 添加时间筛选下拉框 UI

- [ ] **7.1** 在模板中添加时间筛选下拉框
- [ ] **7.2** 添加下拉框样式

---

## 任务依赖关系

```
任务1 -> 任务2 -> 任务7
任务3 -> 任务4 -> 任务7
任务5 -> 任务7
任务6 (独立)
```

---

## 预计工时

| 任务 | 预计时间 |
|-----|---------|
| 任务1 | 5 分钟 |
| 任务2 | 15 分钟 |
| 任务3 | 10 分钟 |
| 任务4 | 15 分钟 |
| 任务5 | 5 分钟 |
| 任务6 | 10 分钟 |
| 任务7 | 15 分钟 |
| **总计** | **约 75 分钟** |
