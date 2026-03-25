# 工作台与创房面板 Tab 层级调整计划

## Why
用户需求变更：
- 不再需要 Workbench 页面内的次级页签栏
- 创房面板应与规则配置工作台平级展示（一级页签）
- 创房面板内部包含两个 Tab：面板选项、选项联动列表

## What Changes

### 路由结构（不变）
- `/workbench` → 规则配置工作台
- `/room-creator/:id` → 创房面板配置（已存在）

### Tab 结构调整
**一级 Tab（路由级别切换）**：
1. **规则配置**（Workbench.vue）
2. **创房面板**（RoomCreatorPage.vue）

**创房面板内部 Tab（二级 Tab）**：
1. **面板选项** - 原有创房面板配置界面
2. **选项联动列表** - SimpleDependencyPage 列表视图

## UI 设计

### 一级 Tab 栏
- 位置：顶部操作栏下方
- 样式：符合 design_rule.md 规范
- Tab 项：规则配置、创房面板
- 默认选中：规则配置

### 创房面板内部 Tab 栏
- 位置：页面标题下方
- Tab 项：面板选项、选项联动列表
- 默认选中：面板选项

## Impact
- 修改路由配置（如需要）
- 修改 RoomCreatorPage.vue：添加内部 Tab 结构
- 创房面板内部两个 Tab 分别嵌入：
  - 面板选项：原有 Drawer/GroupManager 等组件
  - 选项联动列表：SimpleDependencyPage 列表模式

---

## Tasks

### Task 1: 分析现有组件结构
- [ ] 查看 Workbench.vue 当前结构
- [ ] 查看 RoomCreatorPage.vue 当前结构
- [ ] 查看 SimpleDependencyPage.vue 当前结构

### Task 2: 修改 RoomCreatorPage.vue 添加内部 Tab
- [ ] 在页面标题下方添加 Tab 栏
- [ ] Tab1: 面板选项（嵌入原有创房面板内容）
- [ ] Tab2: 选项联动列表（嵌入 SimpleDependencyPage）
- [ ] 添加 Tab 切换逻辑
- [ ] 添加 Tab 样式

### Task 3: 实现路由级别 Tab 切换（可选）
- [ ] 如果需要在一级切换：修改 App.vue 或 Layout 组件
- [ ] 或者保持当前 TabBar 组件结构

### Task 4: 测试验证
- [ ] 验证创房面板内部 Tab 切换正常
- [ ] 验证面板选项功能完整
- [ ] 验证选项联动列表功能完整

---

## 文件变更清单

| 文件 | 变更内容 |
|------|----------|
| `src/views/RoomCreatorPage.vue` | 添加内部 Tab 结构 |
| `src/components/...` | 无变更（复用现有组件） |
