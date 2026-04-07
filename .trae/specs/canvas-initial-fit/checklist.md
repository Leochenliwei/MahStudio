# 画布六步框体初始适配 - 检查清单

**创建时间**: 2026-04-01
**相关规格**: spec.md
**相关任务**: tasks.md

---

## 开发检查清单

### 预检

- [ ] 已阅读 spec.md 设计文档
- [ ] 已确认六步框体实际尺寸参数
- [ ] 已确认画布容器尺寸获取方式

### 代码修改检查

#### 常量定义
- [ ] `STEP_WIDTH` 修正为 220
- [ ] `STEP_START_X` 定义为 130
- [ ] `STEP_START_Y` 定义为 50
- [ ] `CONTENT_PADDING` 定义为 50
- [ ] `CONTENT_TOTAL_WIDTH` 计算正确
- [ ] `CONTENT_TOTAL_HEIGHT` 计算正确

#### calculateInitialScale 函数
- [ ] 使用 `canvasRef.value.clientWidth/Height` 获取画布尺寸
- [ ] 可用空间边距为 80px
- [ ] 使用 `CONTENT_TOTAL_WIDTH/HEIGHT` 计算
- [ ] 最大缩放限制为 1.0 (100%)
- [ ] 最小缩放限制为 0.25 (25%)

#### calculateInitialPosition 函数
- [ ] 使用 `CONTENT_TOTAL_WIDTH/HEIGHT` 计算内容尺寸
- [ ] 居中计算公式正确

#### initCanvas 函数
- [ ] 使用 `nextTick` 确保 DOM 就绪
- [ ] 调用 `calculateInitialScale` 和 `calculateInitialPosition`
- [ ] 更新 `canvasScale` 和 `canvasPosition`

### 功能测试

#### 基础功能
- [ ] 页面加载后六步框体完整显示
- [ ] 六步框体在画布中水平居中
- [ ] 六步框体在画布中垂直居中
- [ ] 初始缩放比例不超过 100%
- [ ] 初始缩放比例不低于 25%

#### 不同分辨率
- [ ] 1920x1080 分辨率显示正常
- [ ] 1366x768 分辨率显示正常
- [ ] 1280x720 分辨率显示正常
- [ ] 窗口 resize 后重置功能正常

#### 边界情况
- [ ] 快速刷新页面功能正常
- [ ] 切换游戏后返回工作台功能正常

---

## 代码审查检查项

- [ ] 代码符合项目编码规范
- [ ] 函数有适当的注释说明
- [ ] 常量命名清晰有意义
- [ ] 无冗余代码
- [ ] 无 console.log 调试代码残留（或已添加适当注释）
