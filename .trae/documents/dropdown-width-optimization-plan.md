# 运算单元选择 Dropdown 宽度优化计划

## 问题描述
当前 ExpressionInput 组件的 dropdown 编辑器面板宽度与输入框宽度相同，显得过宽。需要优化为只展示当前宽度的 60%，使界面更加紧凑美观。

## 当前实现
- 文件: `/Users/zonst/Documents/Programs/WEBconfig/src/components/editors/ExpressionInput.vue`
- 当前宽度设置: `width: ${rect.width}px` (与输入框同宽)
- 涉及代码位置:
  - Line 958-962: 上方显示时的样式
  - Line 966-971: 下方显示时的样式

## 优化方案

### 方案: 宽度调整为 60%

将 dropdown 宽度从 `rect.width` 改为 `rect.width * 0.6`，使编辑器面板更加紧凑。

**修改位置 1** - Line 958-962 (上方显示):
```typescript
dropdownStyle.value = {
  position: 'fixed',
  bottom: `${window.innerHeight - rect.top + 4}px`,
  left: `${rect.left + (rect.width * 0.2)}px`,  // 居中: 左侧偏移 20%
  width: `${rect.width * 0.6}px`  // 宽度改为 60%
}
```

**修改位置 2** - Line 966-971 (下方显示):
```typescript
dropdownStyle.value = {
  position: 'fixed',
  top: `${rect.bottom + 4}px`,
  left: `${rect.left + (rect.width * 0.2)}px`,  // 居中: 左侧偏移 20%
  width: `${rect.width * 0.6}px`  // 宽度改为 60%
}
```

### 居中处理
为了保持视觉平衡，dropdown 需要相对于输入框居中显示：
- 原宽度: 100% (rect.width)
- 新宽度: 60% (rect.width * 0.6)
- 左侧偏移: (100% - 60%) / 2 = 20%

即: `left: rect.left + rect.width * 0.2`

## 实施步骤

1. **修改 dropdownStyle 计算逻辑**
   - 更新上方显示时的宽度为 60%
   - 更新下方显示时的宽度为 60%
   - 添加居中偏移计算

2. **验证调整**
   - 确认 dropdown 宽度正确显示为输入框的 60%
   - 确认 dropdown 居中显示
   - 确认内容布局正常（键盘和元素面板）

## 预期效果
- Dropdown 宽度变为输入框宽度的 60%
- Dropdown 相对于输入框居中显示
- 界面更加紧凑，视觉体验更佳
