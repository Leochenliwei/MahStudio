# 变量编辑组件移植规格文档

## Why
将 `/Users/zonst/Documents/Programs/WEBconfig/资料/src/components/variable-editing` 目录下的变量编辑Vue组件移植到项目中，替换工作台中现有的变量管理相关模块。新的变量编辑组件提供更丰富的功能，包括：
- 组内相加/相乘/取最大/取最小
- 判断是否成立
- 依次判断是否成立(且/或)
- 累加/累乘

## What Changes
- **新增组件**: 移植 WhetherToEstablish.vue 作为主变量编辑弹窗
- **新增子组件**: 移植 AddMultiplyMaxMin.vue 和 Establish.vue 作为变量类型编辑器
- **新增工具函数**: 移植 util.ts 中的数据转换函数
- **替换现有模块**: 用新的 WhetherToEstablish 组件替换现有的 VariableManagementModal 和 VariableEditor
- **更新工作台**: 修改 Workbench.vue 以集成新的变量管理组件
- **更新组件关系文档**: 在 component_rules.md 中添加新组件的依赖关系

## Impact
- **Affected specs**: 变量管理功能、工作台界面
- **Affected code**: 
  - src/components/VariableManagementModal.vue (将被替换)
  - src/components/VariableEditor.vue (将被替换)
  - src/views/Workbench.vue (需要更新引用)
  - .trae/rules/component_rules.md (需要更新组件关系)

## ADDED Requirements

### Requirement: 变量编辑弹窗组件 (WhetherToEstablish)
The system SHALL provide a comprehensive variable editing dialog with the following capabilities:

#### Scenario: 变量列表展示
- **WHEN** 用户打开变量管理弹窗
- **THEN** 系统应展示左侧变量列表（按类型分组）和右侧编辑区域
- **AND** 变量应按类型分组显示（组内相加、组内相乘、判断是否成立等）

#### Scenario: 新增变量
- **WHEN** 用户点击"新增变量"按钮
- **THEN** 系统应创建一个新变量并自动选中
- **AND** 变量名称应自动生成（格式：新增变量_XXXXXX）

#### Scenario: 编辑变量
- **WHEN** 用户点击列表中的变量
- **THEN** 右侧编辑区域应显示该变量的配置表单
- **AND** 表单应包含变量名称、变量类型、表达式配置

#### Scenario: 保存变量
- **WHEN** 用户修改变量后点击保存
- **THEN** 系统应将变量数据转换为API格式并保存
- **AND** 应显示保存成功提示

#### Scenario: 删除变量
- **WHEN** 用户点击删除按钮
- **THEN** 系统应弹出确认对话框
- **AND** 确认后删除该变量

#### Scenario: 未保存提示
- **WHEN** 用户切换变量或关闭弹窗时有未保存修改
- **THEN** 系统应提示用户是否保存修改

### Requirement: 变量类型编辑器 (AddMultiplyMaxMin)
The system SHALL provide editors for group calculation variable types (1-4):

#### Scenario: 组内计算配置
- **WHEN** 变量类型为组内相加/相乘/取最大/取最小
- **THEN** 应显示 AddMultiplyMaxMin 编辑器
- **AND** 允许用户添加/删除组内元素
- **AND** 每个元素包含变量选择和数值配置

### Requirement: 变量类型编辑器 (Establish)
The system SHALL provide editors for condition variable types (5,7,8,9,10):

#### Scenario: 条件表达式配置
- **WHEN** 变量类型为判断是否成立/依次判断/累加/累乘
- **THEN** 应显示 Establish 编辑器
- **AND** 允许用户配置条件表达式

### Requirement: 数据转换工具函数
The system SHALL provide utility functions for data format conversion:

#### Scenario: API数据转换
- **WHEN** 加载变量数据时
- **THEN** 应将API格式转换为组件可识别的格式 (convertToGroupItemsFormat)
- **WHEN** 保存变量数据时
- **THEN** 应将组件格式转换回API格式 (convertBackToApiFormat, toSubmitExprData, toRenderData)

## MODIFIED Requirements

### Requirement: 工作台变量管理入口
**Current**: 使用 VariableManagementModal 组件
**Modified**: 使用 WhetherToEstablish 组件

#### Scenario: 打开变量管理
- **WHEN** 用户点击底部工具栏"变量管理"按钮
- **THEN** 应打开 WhetherToEstablish 弹窗
- **AND** 弹窗应接收当前游戏的 cfg_id 参数

## REMOVED Requirements

### Requirement: 旧变量管理组件
**Reason**: 被新的 WhetherToEstablish 组件替代
**Migration**: 
- VariableManagementModal.vue 将被删除
- VariableEditor.vue 将被删除
- Workbench.vue 中的引用将更新为新的组件

## 组件依赖关系

```
Workbench.vue
└── WhetherToEstablish.vue (新的变量编辑弹窗)
    ├── AddMultiplyMaxMin.vue (组内计算编辑器)
    ├── Establish.vue (条件表达式编辑器)
    └── util.ts (数据转换工具函数)
```

## API 接口需求

新组件依赖以下API接口（需要在 gameApi.js 中添加）：
- `getVariableConfigList` - 获取变量配置列表
- `addVariableConfig` - 添加变量配置
- `updateVariableConfig` - 更新变量配置
- `deleteVariableConfig` - 删除变量配置

## 样式规范

根据 design_rule.md 中的亮色系UI规范：
- 主题色：#3b82f6
- 主背景色：#ffffff
- 表面色：#fafafa
- 边框色：#e5e7eb
- 使用 Element Plus 的 el-dialog、el-button、el-input 等组件
