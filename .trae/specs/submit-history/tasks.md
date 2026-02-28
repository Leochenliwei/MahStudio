# 提测记录功能 - 实施计划

## [ ] Task 1: 修改mockData.js数据结构，添加提测记录存储
- **Priority**: P0
- **Depends On**: None
- **Description**: 
  - 在每个游戏对象中添加submitHistory数组
  - 为现有的测试约局和测试金币文件添加初始提测记录
  - 确保submitHistory数组以时间倒序存储
- **Acceptance Criteria Addressed**: AC-1
- **Test Requirements**:
  - `programmatic` TR-1.1: 每个游戏对象应包含submitHistory数组
  - `programmatic` TR-1.2: 初始提测记录应正确存储
- **Notes**: 提测记录结构应包含id、draftId、targetType、createdAt、createdBy字段

## [ ] Task 2: 修改提测处理逻辑，记录提测历史
- **Priority**: P0
- **Depends On**: Task 1
- **Description**:
  - 修改GameDirectory.vue中的handleSubmitTest函数
  - 提测时创建提测记录并添加到游戏的submitHistory数组
  - 确保提测记录以时间倒序排列
- **Acceptance Criteria Addressed**: AC-1
- **Test Requirements**:
  - `programmatic` TR-2.1: 执行提测操作后，submitHistory数组应添加新记录
  - `programmatic` TR-2.2: 新记录应包含正确的草稿ID、操作时间和操作人信息
- **Notes**: 提测记录的createdBy字段使用固定的'admin'

## [ ] Task 3: 创建提测记录弹窗组件
- **Priority**: P1
- **Depends On**: None
- **Description**:
  - 创建SubmitHistoryModal.vue组件
  - 实现提测记录的显示，以时间倒序排列
  - 显示每条记录的草稿ID、操作时间、操作人信息
- **Acceptance Criteria Addressed**: AC-3, AC-4
- **Test Requirements**:
  - `human-judgment` TR-3.1: 弹窗应正确显示提测记录
  - `human-judgment` TR-3.2: 记录应按时间倒序排列
  - `human-judgment` TR-3.3: 每条记录应显示完整的信息
- **Notes**: 弹窗应具有响应式设计，适配不同屏幕尺寸

## [ ] Task 4: 修改FileCard组件，添加查看提测记录按钮
- **Priority**: P1
- **Depends On**: Task 3
- **Description**:
  - 修改FileCard.vue组件
  - 为测试金币和测试约局文件添加查看提测记录按钮
  - 添加点击事件处理
- **Acceptance Criteria Addressed**: AC-2
- **Test Requirements**:
  - `human-judgment` TR-4.1: 测试金币和测试约局文件卡片应显示查看提测记录按钮
  - `human-judgment` TR-4.2: 点击按钮应打开提测记录弹窗
- **Notes**: 只在测试金币和测试约局文件卡片上显示该按钮

## [ ] Task 5: 修改GameDirectory.vue，集成提测记录功能
- **Priority**: P1
- **Depends On**: Task 2, Task 3, Task 4
- **Description**:
  - 导入SubmitHistoryModal组件
  - 添加提测记录弹窗状态管理
  - 实现查看提测记录的逻辑
- **Acceptance Criteria Addressed**: AC-3, AC-4
- **Test Requirements**:
  - `human-judgment` TR-5.1: 提测记录弹窗应能正常打开和关闭
  - `human-judgment` TR-5.2: 弹窗应显示正确的提测记录
- **Notes**: 确保提测记录弹窗只显示对应文件类型的提测历史

## [ ] Task 6: 测试提测记录功能
- **Priority**: P2
- **Depends On**: All previous tasks
- **Description**:
  - 测试提测操作是否正确记录提测历史
  - 测试提测记录弹窗是否正确显示
  - 测试提测记录是否按时间倒序排列
- **Acceptance Criteria Addressed**: All
- **Test Requirements**:
  - `human-judgment` TR-6.1: 提测操作应正确记录到submitHistory数组
  - `human-judgment` TR-6.2: 提测记录弹窗应显示所有提测历史
  - `human-judgment` TR-6.3: 提测记录应按时间倒序排列
- **Notes**: 测试时应执行多次提测操作，验证记录的顺序和内容