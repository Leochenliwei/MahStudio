# 算分公式编辑器 - 滚动区域重构计划

## 需求分析

当前问题：
- `score-calc-container` 整体滚动，导致「赢家判定」卡片也会被滚出去看不见
- 需要：**赢家判定固定在顶部**，只让**计分规则内的场景列表滚动**，「添加场景」按钮固定在计分规则底部

## 设计方案

### 结构变化

**当前结构：**
```
score-calc-container (max-height: 600px, overflow-y: auto)
├─ 赢家判定卡片
└─ 计分规则卡片
   └─ scenario-list (max-height: 380px, overflow-y: auto)
      ├─ 场景卡片...
      └─ (添加按钮在 scenario-list 外，但被整体滚动包含)
```

**目标结构：**
```
score-calc-container (flex 布局，不需要整体滚动)
├─ 赢家判定卡片 (fixed height，不滚动)
└─ 计分规则卡片 (flex 1，需要高度自适应)
   ├─ section-content (flex-direction: column)
   │  ├─ scenario-list (flex 1，overflow-y: auto，只在这里滚动)
   │  │  └─ 场景卡片...
   │  └─ 添加场景按钮 (fixed at bottom，不滚动，始终可见)
```

### CSS 变化

1. `score-calc-container`：
   - 改为 `display: flex; flex-direction: column; gap: 16px;`
   - 移除 `overflow-y: auto` 和 `max-height`

2. `scoring-section .section-content`：
   - 添加 `display: flex; flex-direction: column; height: 100%;`

3. `.scenario-list`：
   - 添加 `flex: 1;` 让它占据剩余空间
   - 保留 `overflow-y: auto;` 只在这里滚动

### 实现步骤

#### 步骤 1：修改最外层容器样式
- 将 `.score-calc-container` 改为 flex 布局
- 赢家判定卡片会自动固定在顶部

#### 步骤 2：修改计分规则 section-content 布局
- 添加 flex 布局
- 让内部内容占据完整高度

#### 步骤 3：修改 scenario-list 样式
- 添加 `flex: 1` 占据剩余可用空间
- 保持 `overflow-y: auto` 只在这里滚动

#### 步骤 4：验证构建
- 确认无类型错误
- 构建成功

## 预期效果

- ✅ 赢家判定卡片始终固定在顶部，不会滚动出去
- ✅ 只有场景卡片列表在计分规则区域内滚动
- ✅ 添加场景按钮始终固定在计分规则底部，可见可点击
- ✅ 整体布局自适应高度，空间利用更合理
