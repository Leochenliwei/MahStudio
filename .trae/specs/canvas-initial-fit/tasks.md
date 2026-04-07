# 画布六步框体初始适配 - 任务清单

**创建时间**: 2026-04-01
**相关规格**: spec.md

---

## 任务列表

### 任务 1: 修正尺寸常量

- [ ] **1.1** 更新六步框体尺寸常量定义
  - 修改 `STEP_WIDTH` 从 250 改为 220（实际分类容器宽度）
  - 添加 `STEP_START_X = 130`（起始X偏移）
  - 添加 `STEP_START_Y = 50`（起始Y偏移）
  - 添加 `CONTENT_PADDING = 50`（内容边距）
  - 修改 `STEPS_TOTAL_WIDTH` 计算逻辑

- [ ] **1.2** 添加内容总尺寸常量
  - `CONTENT_TOTAL_WIDTH = STEP_START_X + STEPS_COUNT * STEP_WIDTH + (STEPS_COUNT - 1) * CONNECTOR_WIDTH + CONTENT_PADDING`
  - `CONTENT_TOTAL_HEIGHT = STEP_START_Y + STEP_HEIGHT + CONTENT_PADDING`

### 任务 2: 修正 calculateInitialScale 函数

- [ ] **2.1** 修改可用空间计算
  - 边距从 100px 改为 80px（更紧凑）

- [ ] **2.2** 修改内容尺寸引用
  - 使用 `CONTENT_TOTAL_WIDTH` 替代旧的计算方式
  - 使用 `CONTENT_TOTAL_HEIGHT` 替代 `STEP_HEIGHT`

- [ ] **2.3** 限制最大初始缩放为 100%
  - `Math.min(scaleX, scaleY, 1.0)` 确保初始不超过100%

### 任务 3: 修正 calculateInitialPosition 函数

- [ ] **3.1** 修改内容尺寸引用
  - 使用 `CONTENT_TOTAL_WIDTH` 计算内容宽度
  - 使用 `CONTENT_TOTAL_HEIGHT` 计算内容高度

- [ ] **3.2** 确保居中计算正确
  - `(canvasWidth - contentWidth * scale) / 2`
  - `(canvasHeight - contentHeight * scale) / 2`

### 任务 4: 优化 initCanvas 函数

- [ ] **4.1** 确保使用 nextTick
  - DOM 更新完成后再计算尺寸

- [ ] **4.2** 添加调试日志
  - 输出计算后的 scale 和 position 便于调试

### 任务 5: 测试验证

- [ ] **5.1** 不同分辨率测试
  - 1920x1080 分辨率
  - 1366x768 分辨率
  - 1280x720 分辨率

- [ ] **5.2** 功能测试
  - 页面加载后六步框体完整显示
  - 六步框体居中
  - 重置按钮功能正常

---

## 任务依赖关系

```
1.1 -> 1.2 -> 2.1 -> 2.2 -> 2.3 -> 3.1 -> 3.2 -> 4.1 -> 4.2 -> 5.1 -> 5.2
```

---

## 预计工时

| 任务 | 预计时间 |
|-----|---------|
| 任务 1: 修正尺寸常量 | 10 分钟 |
| 任务 2: 修正 calculateInitialScale | 15 分钟 |
| 任务 3: 修正 calculateInitialPosition | 10 分钟 |
| 任务 4: 优化 initCanvas | 10 分钟 |
| 任务 5: 测试验证 | 15 分钟 |
| **总计** | **约 1 小时** |
