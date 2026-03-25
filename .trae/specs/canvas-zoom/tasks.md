# 画布缩放与拖拽功能 - 任务清单

**创建时间**: 2026-03-24
**相关规格**: spec.md

---

## 任务列表

### 阶段一：基础架构

- [ ] **1.1** 在 Workbench.vue 中添加缩放相关的响应式状态变量
  - `canvasScale` (ref: 1.0)
  - `canvasPosition` (ref: { x: 0, y: 0 })
  - `isDragging` (ref: false)
  - `dragMode` (ref: null)
  - `lastMousePosition` (ref: { x: 0, y: 0 })
  - `middleMouseTimer` (ref: null)

- [ ] **1.2** 定义缩放相关的常量
  - `MIN_SCALE = 0.25`
  - `MAX_SCALE = 2.0`
  - `ZOOM_STEP = 0.1`
  - `DRAG_TRIGGER_DELAY = 200`
  - `STEP_WIDTH = 250`
  - `CONNECTOR_WIDTH = 30`
  - `STEPS_COUNT = 6`

- [ ] **1.3** 创建 `canvasContentStyle` 计算属性
  - 返回 `transform` 和 `transform-origin` 样式
  - 确保缩放以画布中心为基准

### 阶段二：初始自适应

- [ ] **2.1** 创建 `calculateInitialScale()` 函数
  - 计算水平方向缩放比例
  - 计算垂直方向缩放比例
  - 取较小值并限制在 25% ~ 200% 范围内

- [ ] **2.2** 创建 `calculateInitialPosition(scale)` 函数
  - 根据缩放比例计算居中位置

- [ ] **2.3** 在 `onMounted` 中调用初始化函数
  - 确保在 DOM 就绪后计算尺寸
  - 使用 `nextTick` 确保画布容器尺寸获取正确

### 阶段三：缩放功能

- [ ] **3.1** 创建 `zoomAtCenter(newScale)` 函数
  - 以画布中心为基准计算新位置
  - 更新 `canvasScale` 和 `canvasPosition`

- [ ] **3.2** 创建 `zoomIn()` 函数
  - 放大 10%，上限 200%

- [ ] **3.3** 创建 `zoomOut()` 函数
  - 缩小 10%，下限 25%

- [ ] **3.4** 创建 `resetZoom()` 函数
  - 重置为初始自适应状态

### 阶段四：中键拖拽

- [ ] **4.1** 修改 `handleCanvasMouseDown` 函数
  - 检测鼠标中键按下
  - 设置 200ms 延迟定时器
  - 添加 `cancelTimer` 处理提前释放

- [ ] **4.2** 修改 `handleMouseMove` 函数
  - 添加拖拽模式判断
  - 根据鼠标移动更新 `canvasPosition`

- [ ] **4.3** 修改 `handleMouseUp` 函数
  - 清理定时器
  - 重置拖拽状态

- [ ] **4.4** 在 `onMounted` 中添加全局事件监听
  - `mousemove`
  - `mouseup`

- [ ] **4.5** 在 `onUnmounted` 中清理事件监听
  - 移除 `mousemove`
  - 移除 `mouseup`
  - 清理定时器

### 阶段五：UI 组件

- [ ] **5.1** 创建缩放控制按钮组件
  - 位置：画布右下角 `position: absolute; bottom: 20px; right: 20px;`
  - 三个按钮：放大(+)、缩小(-)、重置(⟲)
  - 垂直排列

- [ ] **5.2** 实现按钮样式
  - 36px × 36px 按钮尺寸
  - 白色背景，灰色边框
  - 悬停效果

- [ ] **5.3** 绑定缩放按钮事件
  - `zoomIn` -> + 按钮
  - `zoomOut` -> - 按钮
  - `resetZoom` -> ⟲ 按钮

- [ ] **5.4** 添加按钮禁用状态
  - 放大按钮在 scale >= 2.0 时禁用
  - 缩小按钮在 scale <= 0.25 时禁用

### 阶段六：样式调整

- [ ] **6.1** 确保 `workbench-canvas` 容器样式正确
  - `position: relative` (作为缩放控制按钮的定位参考)
  - `overflow: hidden` (裁剪超出的画布内容)

- [ ] **6.2** 调整 `canvas-content` 样式
  - 确保 `transform-origin` 生效

---

## 任务依赖关系

```
1.1 -> 1.2 -> 1.3 -> 2.1 -> 2.2 -> 2.3
                      |
                      v
3.1 -> 3.2 -> 3.3 -> 3.4
          |
          v
4.1 -> 4.2 -> 4.3 -> 4.4 -> 4.5
          |
          v
5.1 -> 5.2 -> 5.3 -> 5.4 -> 6.1 -> 6.2
```

---

## 预计工时

| 阶段 | 任务数 | 预计时间 |
|-----|-------|---------|
| 阶段一 | 3 | 15 分钟 |
| 阶段二 | 3 | 20 分钟 |
| 阶段三 | 4 | 20 分钟 |
| 阶段四 | 5 | 25 分钟 |
| 阶段五 | 4 | 20 分钟 |
| 阶段六 | 2 | 10 分钟 |
| **总计** | **21** | **约 2 小时** |
