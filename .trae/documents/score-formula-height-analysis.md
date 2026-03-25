# 算分公式编辑器 - 滚动高度问题深度分析

## 当前布局结构

```
el-dialog (弹窗，由 Element Plus 控制)
└─ score-calc-container (max-height: 80vh, display: flex, flex-direction: column)
   ├─ section-card (赢家判定) - flex-shrink: 0 (不收缩，高度由内容决定)
   └─ section-card (计分规则) - flex: 1 (占据剩余空间)
      └─ section-content (display: flex, flex-direction: column, height: 100%)
         ├─ scenario-list (flex: 1, overflow-y: auto) - 滚动区域
         │  └─ 场景卡片...
         └─ footer-add-button - flex-shrink: 0 (不收缩，固定在底部)
```

## 现有代码分析

### 当前CSS：

```scss
.score-calc-container {
  max-height: calc(80vh);
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 0 4px;
  // 赢家判定固定在顶部，只有计分规则区域滚动
  // 整体不滚动
}

.scoring-section .section-content {
  padding: 16px;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.scenario-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
  overflow-y: auto;
  padding-right: 8px;
}
```

## 预期vs实际

### 预期：
- `el-dialog` → 弹窗自身有最大高度限制
- `.score-calc-container` → `max-height: 80vh` → 不会超出视口
- `赢家判定` → 固定高度（内容高度），不滚动
- `计分规则` → `flex: 1` → 占据剩余高度
- `section-content` → `flex-direction: column` → 内部排列
- `scenario-list` → `flex: 1` → 占据剩余空间，`overflow-y: auto` → 只有这里滚动
- `添加按钮` → 固定在底部，不滚动，始终可见

### 问题可能原因推测：

**推测1：** `section-card.scoring-section` 没有设置 `flex: 1`

现在 `section-card` 只是一个普通的块级元素，没有 `flex: 1`，所以不会收缩去占据剩余空间。它会按照内容高度撑开，导致整体超出。

**推测2：** `padding: 16px` 累计padding导致额外高度，超出弹窗

**推测3：** 外层 `.score-calc-container` 的 `max-height: 80vh` 没有考虑 dialog 的标题栏和底部按钮栏高度，导致实际内容超出。

## 需要检查的关键点

| 层级 | 元素 | 是否有 `flex` | 是否正确 |
|------|------|------|------|
| 1 | `.score-calc-container` | ✅ `display: flex; flex-direction: column; max-height: 80vh;` | 正确 |
| 2 | `.winner-section` | 没有 `flex` | 没关系，它高度由内容撑开，`flex-shrink: 0` 默认就是不收缩 | 正确 |
| 3 | `.scoring-section` | ❌ **当前缺少 `flex: 1`** | 这很可能就是问题根源！ |
| 4 | `.scoring-section .section-content` | ✅ `display: flex; flex-direction: column; height: 100%;` | 正确 |
| 5 | `.scenario-list` | ✅ `flex: 1; overflow-y: auto;` | 正确 |
| 6 | `.footer-add-button` | 没有 `flex: 0 0 auto` | 但它高度由内容决定，不收缩 → 没问题 | 正确 |

## 结论

**根本原因**：`.scoring-section` 这个外层卡片 div 缺少 `flex: 1`，导致它不会收缩去占据剩余空间，高度由内容撑开，所以整体超出了 `max-height: 80vh`，导致弹窗下方超出。

## 修复方案

给 `.scoring-section` 添加 `flex: 1`，让它占据 `score-calc-container` 剩余的可用空间。

### 具体实施步骤

1. **找到 `.scoring-section` 样式**
   - 当前：只有 `background` 和 `section-header` 样式，缺少 `flex: 1`
   - 添加 `flex: 1;` 让它占据剩余空间

2. **验证**
   - 赢家判定卡片高度由内容决定，固定在顶部
   - 计分规则卡片占据剩余高度
   - 计分规则内部 `section-content` 也是 flex 布局
   - `scenario-list` 占据剩余高度，滚动
   - `添加按钮` 固定在底部

## 验收标准

- [ ] 赢家判定固定顶部不滚动
- [ ] 计分规则占据剩余空间
- [ ] 场景列表滚动，添加按钮固定底部
- [ ] 整个内容不超出弹窗，可视区内完整显示
