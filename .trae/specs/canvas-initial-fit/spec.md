# 画布六步框体初始适配规格书

**创建时间**: 2026-04-01
**状态**: 设计中
**关联文件**: `/Users/zonst/Documents/Programs/WEBconfig/src/views/Workbench.vue`

---

## 1. 需求概述

### 1.1 问题描述
工作台初始化时，画布中的6步框体（六个分类容器）需要根据画布实际尺寸进行缩放，使其完整显示在可视区域内。

### 1.2 当前问题
- 页面加载时六步框体可能超出画布可视区域
- 用户需要手动缩放才能看到完整的流程
- 初始位置可能不居中

### 1.3 预期行为
- 页面加载完成后，自动计算合适的缩放比例
- 六步框体完整显示在画布中央
- 缩放比例限制在 25% ~ 100% 之间（初始状态不建议超过100%）

---

## 2. 技术方案

### 2.1 六步框体尺寸参数

```
分类容器宽度: 220px
分类容器间距: 30px (连接线宽度)
起始偏移: 130px
顶部偏移: 50px
分类容器高度: 420px

六步框体总宽度计算:
- 6个分类容器: 6 × 220px = 1320px
- 5个连接线: 5 × 30px = 150px
- 起始偏移: 130px
- 右侧留白: 50px
总宽度 ≈ 1550px

六步框体总高度:
- 顶部偏移: 50px
- 分类容器高度: 420px
- 底部留白: 50px
总高度 ≈ 520px
```

### 2.2 初始缩放计算逻辑

```javascript
/**
 * 计算初始缩放比例，确保六步框体完整显示
 * @returns {number} 缩放比例 (0.25 ~ 1.0)
 */
function calculateInitialScale() {
  if (!canvasRef.value) return 1.0

  const canvasWidth = canvasRef.value.clientWidth
  const canvasHeight = canvasRef.value.clientHeight

  // 可用空间（留出边距）
  const availableWidth = canvasWidth - 80  // 左右各40px边距
  const availableHeight = canvasHeight - 80 // 上下各40px边距

  // 六步框体实际占用尺寸
  const contentWidth = 1550  // 130 + 6*220 + 5*30 + 50
  const contentHeight = 520  // 50 + 420 + 50

  // 计算水平和垂直方向的缩放比例
  const scaleX = availableWidth / contentWidth
  const scaleY = availableHeight / contentHeight

  // 取较小值确保完整显示，限制在 25% ~ 100%
  let scale = Math.min(scaleX, scaleY, 1.0)
  scale = Math.max(0.25, scale)

  return scale
}
```

### 2.3 居中位置计算

```javascript
/**
 * 计算初始位置，使六步框体居中显示
 * @param {number} scale - 当前缩放比例
 * @returns {{x: number, y: number}} 画布偏移位置
 */
function calculateInitialPosition(scale) {
  if (!canvasRef.value) return { x: 0, y: 0 }

  const canvasWidth = canvasRef.value.clientWidth
  const canvasHeight = canvasRef.value.clientHeight

  // 内容实际尺寸
  const contentWidth = 1550 * scale
  const contentHeight = 520 * scale

  // 计算居中偏移
  return {
    x: (canvasWidth - contentWidth) / 2,
    y: (canvasHeight - contentHeight) / 2
  }
}
```

### 2.4 初始化流程

```javascript
/**
 * 初始化画布缩放和位置
 */
function initCanvas() {
  // 等待 DOM 更新完成
  nextTick(() => {
    if (!canvasRef.value) return

    const scale = calculateInitialScale()
    const position = calculateInitialPosition(scale)

    canvasScale.value = scale
    canvasPosition.value = position

    console.log('画布初始化完成:', { scale, position })
  })
}
```

---

## 3. 修改范围

### 3.1 需要修改的函数

1. **`calculateInitialScale()`** - 重新计算逻辑，修正尺寸参数
2. **`calculateInitialPosition()`** - 重新计算逻辑，修正尺寸参数
3. **`initCanvas()`** - 确保在正确时机调用

### 3.2 常量更新

```javascript
// 六步框体尺寸常量（修正）
const STEP_WIDTH = 220           // 分类容器宽度
const STEP_HEIGHT = 420          // 分类容器高度
const CONNECTOR_WIDTH = 30       // 连接线宽度
const STEPS_COUNT = 6            // 步骤数量
const STEP_START_X = 130         // 起始X偏移
const STEP_START_Y = 50          // 起始Y偏移
const CONTENT_PADDING = 50       // 内容边距

// 六步框体总尺寸
const CONTENT_TOTAL_WIDTH = STEP_START_X + STEPS_COUNT * STEP_WIDTH + (STEPS_COUNT - 1) * CONNECTOR_WIDTH + CONTENT_PADDING
const CONTENT_TOTAL_HEIGHT = STEP_START_Y + STEP_HEIGHT + CONTENT_PADDING
```

---

## 4. 验收标准

### 4.1 功能验收

- [ ] 页面加载后六步框体完整显示在画布内
- [ ] 六步框体在画布中水平垂直居中
- [ ] 缩放比例不超过 100%（避免初始状态过大）
- [ ] 缩放比例不低于 25%
- [ ] 窗口大小变化后，点击重置按钮可重新适配

### 4.2 视觉验收

- [ ] 六步框体不超出画布边界
- [ ] 各步骤之间间距合理
- [ ] 整体布局美观居中

---

## 5. 关联需求

- 基于现有画布缩放功能（canvas-zoom spec）进行优化
- 不影响现有的缩放按钮、拖拽等功能
