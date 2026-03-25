# 画布缩放与拖拽功能 - 检查清单

**创建时间**: 2026-03-24
**相关规格**: spec.md
**相关任务**: tasks.md

---

## 开发检查清单

### 预检

- [ ] 已阅读 spec.md 设计文档
- [ ] 已理解六步框体尺寸参数
- [ ] 已确认缩放范围：25% ~ 200%
- [ ] 已确认拖拽触发延迟：200ms

### 代码实现

#### 状态变量
- [ ] `canvasScale` ref 定义
- [ ] `canvasPosition` ref 定义
- [ ] `isDragging` ref 定义
- [ ] `dragMode` ref 定义
- [ ] `lastMousePosition` ref 定义
- [ ] `middleMouseTimer` ref 定义

#### 常量定义
- [ ] `MIN_SCALE`, `MAX_SCALE`
- [ ] `ZOOM_STEP`
- [ ] `DRAG_TRIGGER_DELAY`
- [ ] 尺寸常量 (`STEP_WIDTH`, etc.)

#### 函数实现
- [ ] `calculateInitialScale()`
- [ ] `calculateInitialPosition()`
- [ ] `zoomAtCenter()`
- [ ] `zoomIn()`
- [ ] `zoomOut()`
- [ ] `resetZoom()`

#### 事件处理
- [ ] `handleCanvasMouseDown()` - 中键长按
- [ ] `handleMouseMove()` - 拖拽移动
- [ ] `handleMouseUp()` - 拖拽释放
- [ ] 全局事件监听添加
- [ ] 全局事件监听清理

#### UI 组件
- [ ] 缩放控制按钮模板
- [ ] 缩放控制按钮样式
- [ ] 按钮事件绑定
- [ ] 按钮禁用状态

#### 样式
- [ ] `canvasContentStyle` 计算属性
- [ ] `workbench-canvas` position 设置
- [ ] `canvas-content` transform-origin

### 功能测试

#### 基础功能
- [ ] 页面加载时六步框体完整显示
- [ ] 六步框体在画布中居中
- [ ] 点击 + 按钮，画布放大
- [ ] 点击 - 按钮，画布缩小
- [ ] 点击 ⟲ 按钮，画布重置
- [ ] 放大到 200% 时，+ 按钮禁用
- [ ] 缩小到 25% 时，- 按钮禁用
- [ ] 中键长按 200ms 后可拖拽
- [ ] 中键短按不触发拖拽
- [ ] 拖拽时画布内容跟随移动
- [ ] 释放中键后拖拽结束

#### 边界情况
- [ ] 快速连续点击放大/缩小
- [ ] 拖拽过程中点击缩放按钮
- [ ] 窗口 resize 后自适应

---

## 完成后自检

- [ ] 代码符合项目编码规范
- [ ] 函数有适当的注释
- [ ] 无 console.log 调试代码残留
- [ ] 样式符合 design_rule.md 规范
- [ ] ESLint 检查通过
