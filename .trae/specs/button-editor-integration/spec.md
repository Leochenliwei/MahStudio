# Button 组件编辑器集成 Spec

## Why
当前 Workbench.vue 中的按钮类型组件只显示一个普通按钮，无法根据不同的 editorType 打开对应的弹窗编辑器。需要参考 game-settings 下的组件实现，将牌堆选择、算分公式等编辑器集成到工作台中，实现按钮触发弹窗的完整交互流程。

## What Changes
- 在 Workbench.vue 中增加按钮组件的 editorType 识别逻辑
- 集成 MahjongStackDialog（牌堆选择器）到工作台
- 集成 ScoreCalculationFormulaEditing（算分公式编辑器）到工作台
- 创建统一的弹窗容器组件管理所有编辑器弹窗
- 支持 mock 数据便于原型展示
- **BREAKING**: 按钮组件的点击行为从简单触发变为打开对应编辑器

## Impact
- Affected specs: component-style-rendering（组件样式）
- Affected code: 
  - /Users/zonst/Documents/Programs/WEBconfig/src/views/Workbench.vue
  - /Users/zonst/Documents/Programs/WEBconfig/src/components/
- 新增组件：
  - EditorDialogContainer.vue（弹窗容器）
  - MahjongStackDialog.vue（牌堆选择）
  - ScoreCalculationFormulaEditing.vue（算分公式）

## ADDED Requirements

### Requirement: Button 组件 EditorType 识别
The system SHALL 根据 property.extend.editorType 的值打开对应的弹窗编辑器

#### Scenario: 牌堆选择器 (mahjongstack)
- **GIVEN** 按钮组件的 editorType 为 "mahjongstack"
- **WHEN** 用户点击按钮
- **THEN** 打开牌堆选择弹窗，显示万子/条子/筒子/字牌/花牌的选择界面

#### Scenario: 算分公式编辑器 (calscore)
- **GIVEN** 按钮组件的 editorType 为 "calscore"
- **WHEN** 用户点击按钮
- **THEN** 打开算分公式编辑器，支持多场景算分配置

#### Scenario: 动作约束编辑器 (motionconstraint)
- **GIVEN** 按钮组件的 editorType 为 "motionconstraint"
- **WHEN** 用户点击按钮
- **THEN** 打开动作约束编辑器

#### Scenario: 分数修正编辑器 (correctscore)
- **GIVEN** 按钮组件的 editorType 为 "correctscore"
- **WHEN** 用户点击按钮
- **THEN** 打开分数修正编辑器

### Requirement: Mock 数据支持
The system SHALL 提供 mock 数据便于原型展示

#### Scenario: Mock 牌堆数据
- **GIVEN** 使用 mock 模式
- **WHEN** 打开牌堆选择器
- **THEN** 显示预设的麻将牌数据（万子1-9、条子1-9等）

#### Scenario: Mock 玩家数据
- **GIVEN** 使用 mock 模式
- **WHEN** 打开算分公式编辑器
- **THEN** 显示模拟的玩家列表（庄家、闲家等）

### Requirement: 弹窗值同步
The system SHALL 将弹窗中的编辑值同步回属性面板

#### Scenario: 确认保存
- **GIVEN** 用户在弹窗中完成编辑
- **WHEN** 点击确认按钮
- **THEN** 将值保存到 propertyValues 并关闭弹窗

#### Scenario: 取消关闭
- **GIVEN** 用户在弹窗中点击取消
- **WHEN** 点击取消按钮
- **THEN** 不保存值并关闭弹窗

## MODIFIED Requirements
无

## REMOVED Requirements
无
