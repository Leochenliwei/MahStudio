# 修复条件树数据流 Spec

## Why
弹窗（ConditionTree/RuleEditorModalPro）未能从创房面板的配置界面获取到实际的数据。当前数据流存在问题：SimpleDependencyPage 通过 localStorage 加载数据，而不是直接从 RoomCreatorPage 接收实时的 roomConfig.groups 数据，导致数据不同步或为空。

## What Changes
- **BREAKING**: 修改 SimpleDependencyPage.vue，添加 formSchema prop 支持
- 修改 RoomCreatorPage.vue，将 roomConfig.groups 传递给 SimpleDependencyPage
- 优化 SimpleDependencyPage 的数据加载逻辑：优先使用 prop 传入的数据，回退到 localStorage
- 确保 ConditionTree 能正确接收到 allComponents 数据

## Impact
- Affected specs: 选项联动（简版）功能
- Affected code: 
  - RoomCreatorPage.vue
  - SimpleDependencyPage.vue
  - RuleEditorModalPro.vue（验证数据传递）
  - ConditionTree.vue（验证数据接收）

## ADDED Requirements

### Requirement: 数据流修复
The system SHALL ensure ConditionTree receives actual component data from RoomCreatorPage.

#### Scenario: 从创房面板传递数据到弹窗
- **GIVEN** 用户在创房面板配置了组件（groups）
- **WHEN** 用户打开"选项联动（简版P0）"标签页并点击"新增规则"
- **THEN** 弹窗中的条件树应该显示创房面板的所有组件列表

#### Scenario: 数据优先级
- **GIVEN** RoomCreatorPage 传递了 formSchema 数据给 SimpleDependencyPage
- **WHEN** SimpleDependencyPage 初始化 formSchema
- **THEN** 优先使用 prop 传入的数据，如果 prop 为空则回退到 localStorage

## MODIFIED Requirements

### Requirement: SimpleDependencyPage 数据接收
**Current**: SimpleDependencyPage 只通过 gameId 从 localStorage 加载数据
**Modified**: SimpleDependencyPage 接收 formSchema prop，优先使用 prop 数据

### Requirement: RoomCreatorPage 数据传递
**Current**: RoomCreatorPage 只传递 game-id 给 SimpleDependencyPage
**Modified**: RoomCreatorPage 同时传递 :form-schema="roomConfig.groups"

## REMOVED Requirements
None
