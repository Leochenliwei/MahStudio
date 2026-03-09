# 游戏属性编辑界面优化 - 实现计划

## [x] Task 1: 创建穿梭框组件 (Transfer.vue)
- **Priority**: P0
- **Depends On**: None
- **Description**: 
  - 创建一个通用的穿梭框组件，支持左右两侧数据展示
  - 实现数据的选择、移动和搜索功能
  - 支持自定义标题和数据结构
- **Acceptance Criteria Addressed**: AC-1, AC-3
- **Test Requirements**:
  - `programmatic` TR-1.1: 组件能够正确接收和显示左右两侧数据
  - `human-judgment` TR-1.2: 穿梭框交互流畅，操作直观
- **Notes**: 组件需要支持通过 id 匹配已选中的数据

## [x] Task 2: 修改 GameInfo.vue 组件，集成穿梭框
- **Priority**: P0
- **Depends On**: Task 1
- **Description**:
  - 导入并使用 Transfer 组件
  - 增加三个 APK ID 字段的表单元素
  - 集成 getAllApks() API 获取 APK 数据
  - 更新表单数据结构，包含新增的三个字段
- **Acceptance Criteria Addressed**: AC-1, AC-2, AC-4, AC-5
- **Test Requirements**:
  - `programmatic` TR-2.1: 组件能够正确加载 APK 数据
  - `programmatic` TR-2.2: 表单数据包含新增的三个 APK ID 字段
  - `human-judgment` TR-2.3: 界面布局符合设计规范
- **Notes**: 需要处理数据加载状态和错误情况

## [x] Task 3: 测试功能完整性
- **Priority**: P1
- **Depends On**: Task 2
- **Description**:
  - 测试 APK 数据加载功能
  - 测试穿梭框选择操作
  - 测试数据保存功能
  - 测试数据加载功能（编辑已有游戏）
- **Acceptance Criteria Addressed**: AC-2, AC-3, AC-4, AC-5
- **Test Requirements**:
  - `programmatic` TR-3.1: APK 数据加载成功
  - `programmatic` TR-3.2: 数据保存后包含正确的 APK ID
  - `programmatic` TR-3.3: 编辑时正确显示已保存的 APK
  - `human-judgment` TR-3.4: 整体用户体验流畅
- **Notes**: 测试时需要模拟不同的 APK 数据场景