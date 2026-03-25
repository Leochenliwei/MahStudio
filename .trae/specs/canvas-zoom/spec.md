# 画布缩放与拖拽功能设计

**创建时间**: 2026-03-24
**状态**: 设计中

---

## 1. 需求概述

为 Workbench.vue 的画布区域实现缩放和拖拽功能，提升用户在配置规则时对六步框体的查看体验。

### 1.1 用户场景

- 用户使用 Mac/Windows 笔记本，偶有外接显示器
- 用户需要在不同分辨率下都能完整查看六步流程
- 用户需要放大查看细节，或缩小查看全貌
- 用户需要通过鼠标中键拖拽画布进行移动

### 1.2 功能目标

| 功能 | 目标 |
|-----|------|
| 初始自适应 | 进入页面时自动缩放，确保六步框体完整显示 |
| 缩放控制 | 右下角悬浮按钮：放大/缩小/重置 |
| 画布拖拽 | 鼠标中键长按 200ms 后触发拖拽 |
| 缩放范围 | 25% ~ 200% |
| 缩放中心 | 以画布中心为基准 |

---

## 2. 技术方案

### 2.1 架构设计

采用 **分层缩放 + 中心对齐** 方案：

```
workbench-canvas (容器，overflow: auto)
└── canvas-content (缩放层，transform 应用在此)
    ├── category-steps-container (六步框体)
    └── panels (可拖拽面板)
```

**核心原理：**
- `transform: scale()` 和 `translate()` 应用在 `canvas-content` 上
- `transform-origin: center center` 确保缩放以视觉中心为基准
- 拖拽通过改变 `translate` 值实现

### 2.2 缩放逻辑

```javascript
// 缩放以画布中心为基准
canvasContentStyle = computed(() => ({
  transform: `translate(${canvasPosition.value.x}px, ${canvasPosition.value.y}px) scale(${scale})`,
  transformOrigin: 'center center'
}))
```

**缩放中心点计算：**
当用户点击缩放按钮时，画布内容应保持在视觉中心位置。

```javascript
/**
 * 以画布中心为基准进行缩放
 * @param {number} newScale - 新的缩放比例 (0.25 ~ 2.0)
 */
function zoomAtCenter(newScale) {
  const canvasRect = canvasRef.value.getBoundingClientRect()
  const centerX = canvasRect.width / 2
  const centerY = canvasRect.height / 2

  // 计算当前画布内容的中心点（相对于画布容器）
  const contentCenterX = (centerX - canvasPosition.value.x) / currentScale.value
  const contentCenterY = (centerY - canvasPosition.value.y) / currentScale.value

  // 计算新的位置，保持内容中心点不变
  canvasPosition.value = {
    x: centerX - contentCenterX * newScale,
    y: centerY - contentCenterY * newScale
  }

  canvasScale.value = newScale
}
```

### 2.3 初始自适应计算

```javascript
/**
 * 计算初始缩放比例，确保六步框体完整显示
 * 六步框体总宽度 = 6 × 250px(分类容器) + 5 × 30px(连接线) + 200px(缓冲)
 */
function calculateInitialScale() {
  const canvasWidth = canvasRef.value?.clientWidth || 800
  const canvasHeight = canvasRef.value?.clientHeight || 600

  // 六步框体尺寸
  const stepsTotalWidth = 6 * 250 + 5 * 30 + 200 // 1850px
  const stepsTotalHeight = 420

  // 计算水平方向和垂直方向所需的缩放比例
  const scaleX = (canvasWidth - 100) / stepsTotalWidth
  const scaleY = (canvasHeight - 100) / stepsTotalHeight

  // 取较小值，确保两个方向都能完整显示
  let scale = Math.min(scaleX, scaleY)

  // 限制在 25% ~ 200% 范围内
  scale = Math.max(0.25, Math.min(2.0, scale))

  return scale
}

/**
 * 计算初始位置，使六步框体居中显示
 */
function calculateInitialPosition(scale) {
  const canvasWidth = canvasRef.value?.clientWidth || 800
  const canvasHeight = canvasRef.value?.clientHeight || 600

  const stepsTotalWidth = 6 * 250 + 5 * 30
  const stepsTotalHeight = 420

  // 计算居中位置
  const x = (canvasWidth - stepsTotalWidth * scale) / 2
  const y = (canvasHeight - stepsTotalHeight * scale) / 2

  return { x, y }
}
```

### 2.4 中键拖拽逻辑

```javascript
// 拖拽状态
const isDragging = ref(false)
const dragMode = ref(null) // 'middleMouse'
const lastMousePosition = ref({ x: 0, y: 0 })
const middleMouseTimer = ref(null)

/**
 * 鼠标中键按下处理
 * 长按 200ms 后触发拖拽
 */
function handleCanvasMouseDown(event) {
  if (event.button === 1) { // 中键
    event.preventDefault()

    // 开始计时
    middleMouseTimer.value = setTimeout(() => {
      dragMode.value = 'middleMouse'
      isDragging.value = true
      lastMousePosition.value = { x: event.clientX, y: event.clientY }
    }, 200)

    // 如果用户在 200ms 内释放，则取消计时器
    const cancelTimer = () => {
      if (middleMouseTimer.value) {
        clearTimeout(middleMouseTimer.value)
        middleMouseTimer.value = null
      }
      document.removeEventListener('mouseup', cancelTimer)
    }
    document.addEventListener('mouseup', cancelTimer)
  }
}

/**
 * 鼠标移动处理（拖拽模式）
 */
function handleMouseMove(event) {
  if (isDragging.value && dragMode.value === 'middleMouse') {
    const deltaX = event.clientX - lastMousePosition.value.x
    const deltaY = event.clientY - lastMousePosition.value.y

    canvasPosition.value.x += deltaX
    canvasPosition.value.y += deltaY

    lastMousePosition.value = { x: event.clientX, y: event.clientY }
  }
}

/**
 * 鼠标释放处理
 */
function handleMouseUp() {
  if (dragMode.value === 'middleMouse') {
    isDragging.value = false
    dragMode.value = null
  }
}
```

### 2.5 缩放按钮交互

```javascript
// 缩放增量
const ZOOM_STEP = 0.1 // 每次缩放 10%

/**
 * 放大
 */
function zoomIn() {
  const newScale = Math.min(2.0, canvasScale.value + ZOOM_STEP)
  zoomAtCenter(newScale)
}

/**
 * 缩小
 */
function zoomOut() {
  const newScale = Math.max(0.25, canvasScale.value - ZOOM_STEP)
  zoomAtCenter(newScale)
}

/**
 * 重置为初始状态
 */
function resetZoom() {
  const initialScale = calculateInitialScale()
  const initialPosition = calculateInitialPosition(initialScale)
  canvasScale.value = initialScale
  canvasPosition.value = initialPosition
}
```

---

## 3. UI 设计

### 3.1 缩放控制按钮位置

**位置**: 画布右下角固定悬浮

```
┌─────────────────────────────────────┐
│                                     │
│           画布内容区域               │
│                                     │
│                                     │
│                              ┌────┐ │
│                              │ +  │ │
│                              │ -  │ │
│                              │ ⟲  │ │
│                              └────┘ │
└─────────────────────────────────────┘
```

### 3.2 缩放控制按钮样式

**设计规范**:
- 按钮尺寸：36px × 36px
- 按钮间距：4px
- 圆角：8px
- 背景色：白色 (#ffffff)
- 边框：1px solid #e5e7eb
- 悬停背景：#f3f4f6
- 激活背景：#e5e7eb
- 阴影：0 2px 8px rgba(0, 0, 0, 0.1)
- 图标颜色：#374151
- 图标大小：18px

### 3.3 组件结构

```vue
<!-- 画布缩放控制 -->
<div class="canvas-zoom-controls">
  <button class="zoom-btn" @click="zoomIn" title="放大">
    <el-icon :size="18"><Plus /></el-icon>
  </button>
  <button class="zoom-btn" @click="zoomOut" title="缩小">
    <el-icon :size="18"><Minus /></el-icon>
  </button>
  <button class="zoom-btn" @click="resetZoom" title="重置">
    <el-icon :size="18"><Refresh /></el-icon>
  </button>
</div>
```

```css
.canvas-zoom-controls {
  position: absolute;
  bottom: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.zoom-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  color: #374151;
  transition: all 0.2s;
}

.zoom-btn:hover {
  background: #f3f4f6;
}

.zoom-btn:active {
  background: #e5e7eb;
}
```

---

## 4. 数据结构

### 4.1 响应式状态

```javascript
// 画布缩放比例 (1.0 = 100%)
const canvasScale = ref(1.0)

// 画布位置 (translate 的 x, y 值)
const canvasPosition = ref({ x: 0, y: 0 })

// 当前是否在拖拽中
const isDragging = ref(false)

// 拖拽模式: null | 'middleMouse'
const dragMode = ref(null)

// 上一次鼠标位置
const lastMousePosition = ref({ x: 0, y: 0 })
```

### 4.2 常量定义

```javascript
// 缩放范围
const MIN_SCALE = 0.25  // 25%
const MAX_SCALE = 2.0    // 200%

// 缩放增量
const ZOOM_STEP = 0.1   // 每次 10%

// 拖拽触发延迟 (ms)
const DRAG_TRIGGER_DELAY = 200

// 六步框体尺寸
const STEP_WIDTH = 250      // 单个分类容器宽度
const STEP_HEIGHT = 420     // 分类容器高度
const CONNECTOR_WIDTH = 30   // 连接线宽度
const STEPS_COUNT = 6       // 步骤数量
const CANVAS_PADDING = 100  // 画布内边距

// 六步框体总宽度
const STEPS_TOTAL_WIDTH = STEPS_COUNT * STEP_WIDTH + (STEPS_COUNT - 1) * CONNECTOR_WIDTH
```

---

## 5. 交互细节

### 5.1 初始化流程

1. 组件挂载后，获取画布容器的实际尺寸
2. 计算初始缩放比例：`scale = min(availableWidth / STEPS_TOTAL_WIDTH, availableHeight / STEP_HEIGHT)`
3. 确保缩放比例在 25% ~ 200% 范围内
4. 计算居中位置
5. 应用初始缩放和位置

### 5.2 缩放交互

| 操作 | 行为 |
|-----|------|
| 点击 + 按钮 | 以画布中心为基准，放大 10% |
| 点击 - 按钮 | 以画布中心为基准，缩小 10% |
| 点击 ⟲ 按钮 | 重置为初始自适应状态 |
| 达到缩放上限 | + 按钮禁用，显示提示 |
| 达到缩放下限 | - 按钮禁用，显示提示 |

### 5.3 拖拽交互

| 操作 | 行为 |
|-----|------|
| 按下中键 < 200ms 释放 | 取消拖拽 |
| 按下中键 ≥ 200ms | 开始拖拽模式 |
| 拖拽中移动鼠标 | 画布内容跟随移动 |
| 释放中键 | 退出拖拽模式 |

### 5.4 边界处理

- **缩放过界**：按钮自动禁用，防止超出范围
- **拖拽边界**：不设置硬性边界，允许用户拖出画布边缘
- **初始过小屏**：强制完整显示，最小缩放 25%

---

## 6. 兼容性考虑

### 6.1 浏览器兼容

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### 6.2 触摸设备

- 暂不支持触摸板的双指缩放（未来可扩展）
- 中键拖拽在触控板上有替代方案（两条手指拖动）

### 6.3 键盘快捷键（未来可扩展）

| 快捷键 | 功能 |
|-------|------|
| Ctrl/Cmd + + | 放大 |
| Ctrl/Cmd + - | 缩小 |
| Ctrl/Cmd + 0 | 重置 |

---

## 7. 测试要点

### 7.1 功能测试

- [ ] 初始化时六步框体完整显示且居中
- [ ] 点击放大按钮，画布内容以中心为基准放大
- [ ] 点击缩小按钮，画布内容以中心为基准缩小
- [ ] 点击重置按钮，画布恢复到初始自适应状态
- [ ] 达到缩放上限时，放大按钮禁用
- [ ] 达到缩放下限时，缩小按钮禁用
- [ ] 中键长按 200ms 后可以拖拽画布
- [ ] 中键短按不触发拖拽

### 7.2 响应式测试

- [ ] 1280x800 分辨率下完整显示
- [ ] 1920x1080 分辨率下完整显示
- [ ] 2560x1440 分辨率下完整显示
- [ ] 3840x2160 (4K) 分辨率下完整显示
- [ ] MacBook 13" Retina 屏幕下完整显示
- [ ] 外接显示器 27" 下完整显示

### 7.3 边界测试

- [ ] 快速连续点击放大/缩小按钮，功能正常
- [ ] 拖拽过程中快速切换到其他操作，功能正常
- [ ] 窗口resize后，画布自适应调整
