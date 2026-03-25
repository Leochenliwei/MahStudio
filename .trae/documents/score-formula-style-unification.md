# 算分公式编辑器 - 样式统一移植计划

## 需求分析

需要将 `ActionLimitEditor.vue` 中一组规则的UI样式和布局，移植到 `ScoreCalculationFormulaEditing.vue` 的多场景卡片中，实现全局样式统一。

**参考样式（来源：ActionLimitEditor）：**
- 卡片头部可点击展开/折叠
- 头部包含序号+标题+操作菜单（更多按钮下拉）
- 内容区域默认折叠，点击展开后显示
- 使用折叠过渡动画 `el-collapse-transition`
- 整体圆角阴影，hover效果

**当前问题：**
- 算分规则所有卡片始终全屏展开，没有折叠，内容多的时候页面很长
- 操作按钮直接显示在右上角，样式不够统一
- 需要和 ActionLimitEditor 保持一致的交互体验

## 设计方案

### 结构变化

**当前结构：**
```
场景卡片（始终展开）
├─ 头部：徽章 + 标题 + 删除按钮
└─ 表单内容（始终显示）
```

**目标结构（参考 ActionLimitEditor）：**
```
场景卡片（可折叠）
├─ 头部（可点击切换展开）
│  ├─ 左侧：序号 + 可双击编辑的标题
│  └─ 右侧：展开图标 + 更多操作下拉
│           ├─ 复制规则
│           ├─ 下方添加
│           └─ 删除
└─ 内容区域（只有展开时显示，带动画）
   ├─ 场景说明
   ├─ 出分玩家
   └─ 条件+计分（两栏）
```

### 新增状态管理

- `expandedIndices`：`Set<number>` - 记录哪些场景卡片是展开的
- `editingIndex`：`number | null` - 当前正在编辑标题的索引
- `titleInputRef` - 引用标题输入框，自动聚焦

### 新增方法

| 方法 | 功能 |
|------|------|
| `isExpanded(index)` | 判断卡片是否展开 |
| `toggleExpand(index)` | 切换展开/折叠状态 |
| `startEditing(index)` | 开始编辑标题 |
| `stopEditing()` | 停止编辑标题 |
| `handleCommand(command, index)` | 处理下拉菜单命令 |
| `copyItem(index)` | 复制当前规则 |

### 下拉菜单选项

参考 ActionLimitEditor：
1. **复制规则** - 复制当前规则到下方，自动展开
2. **下方添加** - 在下方添加一个空规则
3. **删除规则** - 删除当前规则（仅剩一条时禁用）

### 样式移植

- 卡片背景：白色，边框圆角，阴影
- 头部背景：渐变浅灰，悬停变色
- 内容区域：浅灰背景，顶部分隔线
- 添加折叠过渡动画
- 保持和 ActionLimitEditor 一致的间距、颜色、字体

## 实现步骤

### 步骤 1：添加状态变量
- 新增 `expandedIndices` ref
- 新增 `editingIndex` ref
- 新增 `titleInputRef` ref

### 步骤 2：新增方法
- 实现 `isExpanded` 判断
- 实现 `toggleExpand` 切换
- 实现 `startEditing` / `stopEditing` 标题编辑
- 实现 `handleCommand` 下拉菜单命令分发
- 实现 `copyItem` 复制规则

### 步骤 3：重构模板结构
- 头部改为可点击，点击切换展开
- 右侧改为「更多」下拉菜单，包含复制/添加/删除
- 使用 `el-collapse-transition` 包裹内容区域
- `v-show="isExpanded(index)"` 控制内容显示
- 标题改为双击编辑模式

### 步骤 4：样式调整
- 复制 ActionLimitEditor 的样式变量和规则
- 调整间距、颜色、阴影，保持一致
- 添加过渡动画

### 步骤 5：验证构建
- 确认无类型错误
- 构建成功

## 兼容性保证

- 数据结构保持不变，不影响输出格式
- 已有数据加载后，默认展开第一个（类似 ActionLimitEditor）
- 新增复制功能提升用户体验
- 向后兼容，不破坏已有配置

## 验收标准

- [ ] 每个场景卡片支持点击头部展开/折叠
- [ ] 标题支持双击编辑
- [ ] 右上角更多下拉菜单，包含复制/添加/删除
- [ ] 展开/折叠有平滑过渡动画
- [ ] 样式和 ActionLimitEditor 保持一致
- [ ] 新增场景自动展开
- [ ] 复制场景正确工作
- [ ] 项目构建成功
