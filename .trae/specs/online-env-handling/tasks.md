# 在线环境特殊处理 - 实现计划

## [x] 任务 1: 检查并添加正式模块的文件类型定义
- **Priority**: P0
- **Depends On**: None
- **Description**: 
  - 检查 mockData.js 中的 FileType 定义
  - 添加正式约局和正式金币的文件类型常量
- **Acceptance Criteria Addressed**: AC-4
- **Test Requirements**:
  - `programmatic` TR-1.1: 确认 FileType 中包含正式约局和正式金币的类型定义
- **Notes**: 确保文件类型命名规范与现有类型保持一致

## [x] 任务 2: 实现 online 环境下移除草稿模块的逻辑
- **Priority**: P0
- **Depends On**: None
- **Description**: 
  - 在 GameDirectory.vue 中添加环境判断逻辑
  - 仅在 test 环境下显示草稿模块
- **Acceptance Criteria Addressed**: AC-1, AC-5
- **Test Requirements**:
  - `programmatic` TR-2.1: online 环境下不显示草稿模块
  - `programmatic` TR-2.2: test 环境下正常显示草稿模块
- **Notes**: 使用 v-if 条件判断 activeEnv 的值

## [x] 任务 3: 实现测试模块到灰度模块的重命名逻辑
- **Priority**: P0
- **Depends On**: None
- **Description**: 
  - 根据当前环境动态显示模块名称
  - online 环境下显示"灰度约局"和"灰度金币"
  - test 环境下保持"测试约局"和"测试金币"
- **Acceptance Criteria Addressed**: AC-2, AC-5
- **Test Requirements**:
  - `human-judgment` TR-3.1: online 环境下模块名称显示为"灰度约局"和"灰度金币"
  - `human-judgment` TR-3.2: test 环境下模块名称保持不变
- **Notes**: 使用三元表达式根据 activeEnv 动态设置标题

## [x] 任务 4: 实现发灰度按钮到发布按钮的重命名逻辑
- **Priority**: P0
- **Depends On**: None
- **Description**: 
  - 检查 FileCard 组件是否支持自定义按钮文本
  - 如不支持，修改 FileCard 组件添加相关 props
  - 根据环境动态传递按钮文本
- **Acceptance Criteria Addressed**: AC-3
- **Test Requirements**:
  - `human-judgment` TR-4.1: online 环境下按钮显示为"发布"
  - `human-judgment` TR-4.2: test 环境下按钮显示为"发灰度"
- **Notes**: 确保按钮功能保持不变，仅修改显示文本

## [x] 任务 5: 添加正式约局和正式金币模块
- **Priority**: P0
- **Depends On**: 任务 1
- **Description**: 
  - 在 GameDirectory.vue 中添加正式约局和正式金币模块的 UI
  - 实现正式模块的文件获取逻辑
  - 确保正式模块不显示发布按钮
- **Acceptance Criteria Addressed**: AC-4
- **Test Requirements**:
  - `programmatic` TR-5.1: online 环境下显示正式约局和正式金币模块
  - `programmatic` TR-5.2: 正式模块中不显示发布按钮
  - `programmatic` TR-5.3: test 环境下不显示正式模块
- **Notes**: 参考现有灰度模块的实现方式

## [x] 任务 6: 测试环境切换功能
- **Priority**: P1
- **Depends On**: 任务 2, 3, 4, 5
- **Description**: 
  - 测试环境在 test 和 online 之间切换时的 UI 变化
  - 确保所有功能在两个环境下都正常工作
- **Acceptance Criteria Addressed**: AC-1, AC-2, AC-3, AC-4, AC-5
- **Test Requirements**:
  - `programmatic` TR-6.1: 环境切换时 UI 正确更新
  - `programmatic` TR-6.2: 所有模块在对应环境下显示正确
- **Notes**: 测试时需要确保页面刷新后状态保持正确