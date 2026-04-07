# 表达式输入框光标定位与导航 Spec

## Why
当前 ExpressionInput 组件虽然实现了嵌套标签块的渲染，但缺乏光标定位和键盘导航功能。用户无法直观地看到当前编辑位置，也无法通过键盘快速移动光标和插入元素。需要实现光标显示、键盘导航和 dropdown 激活功能，提升编辑体验。

## What Changes
- 实现光标显示功能，在表达式输入框中显示闪烁光标
- 实现键盘导航，支持左右方向键移动光标（每次移动一个运算单元）
- 实现 dropdown 激活，点击输入框时显示可插入的运算单元列表
- 光标位置决定插入位置，从列表选择元素后在光标位置插入
- 保持现有的嵌套标签块渲染和身份选择功能

## Impact
- Affected specs: expression-input-nested-tags（已完成）
- Affected code:
  - `/Users/zonst/Documents/Programs/WEBconfig/src/components/editors/ExpressionInput.vue` - 光标、键盘导航、dropdown 激活

## ADDED Requirements

### Requirement: 光标显示功能
The system SHALL 在表达式输入框中显示光标

#### Scenario: 点击输入框显示光标
- **GIVEN** 用户点击表达式输入框
- **WHEN** 输入框获得焦点
- **THEN** 在点击位置显示闪烁光标
- **AND** 光标高度与输入框内容高度一致
- **AND** 光标颜色为 #3b82f6（主题蓝色）
- **AND** 光标宽度为 2px

#### Scenario: 光标闪烁动画
- **GIVEN** 光标显示在输入框中
- **WHEN** 正常状态
- **THEN** 光标以 1s 周期闪烁（淡入淡出）
- **AND** 使用 CSS animation 实现

#### Scenario: 光标位置跟随点击
- **GIVEN** 用户点击输入框的不同位置
- **WHEN** 点击事件触发
- **THEN** 光标定位到最近的运算单元之间
- **AND** 如果点击在单元内部，光标定位到单元边界

### Requirement: 键盘导航功能
The system SHALL 支持键盘方向键移动光标

#### Scenario: 按左方向键移动光标
- **GIVEN** 光标在输入框中
- **WHEN** 用户按下左方向键（ArrowLeft）
- **THEN** 光标向左移动一个运算单元
- **AND** 如果光标已在最左侧，保持在最左侧

#### Scenario: 按右方向键移动光标
- **GIVEN** 光标在输入框中
- **WHEN** 用户按下右方向键（ArrowRight）
- **THEN** 光标向右移动一个运算单元
- **AND** 如果光标已在最右侧，保持在最右侧

#### Scenario: 光标移动到单元边界
- **GIVEN** 用户按方向键移动光标
- **WHEN** 光标移动到运算单元边界
- **THEN** 光标显示在两个单元之间
- **AND** 光标位置对应插入位置

### Requirement: Dropdown 激活功能
The system SHALL 点击输入框时显示运算单元列表

#### Scenario: 点击输入框激活 dropdown
- **GIVEN** 用户点击表达式输入框
- **WHEN** 输入框获得焦点
- **THEN** 显示运算单元 dropdown 列表
- **AND** 列表显示在输入框下方
- **AND** 列表包含所有可插入的游戏元素

#### Scenario: Dropdown 定位
- **GIVEN** dropdown 被激活显示
- **WHEN** 渲染 dropdown 面板
- **THEN** 面板宽度与输入框一致
- **AND** 面板最大高度为 320px
- **AND** 超出高度时显示滚动条

#### Scenario: Dropdown 关闭
- **GIVEN** dropdown 处于打开状态
- **WHEN** 用户点击输入框外部
- **THEN** 关闭 dropdown 面板
- **AND** 保持输入框焦点状态

### Requirement: 光标位置插入
The system SHALL 在光标位置插入运算单元

#### Scenario: 选择元素插入到光标位置
- **GIVEN** 光标在输入框中某位置
- **WHEN** 用户从 dropdown 选择游戏元素
- **THEN** 在光标位置插入元素
- **AND** 插入后光标移动到插入元素的右侧

#### Scenario: 插入带身份的元素
- **GIVEN** 光标在输入框中某位置
- **WHEN** 用户选择需要身份的游戏元素（如"买分值"）
- **THEN** 在光标位置插入：[当前玩家] 的 [买分值]
- **AND** 身份默认为"当前玩家"

## MODIFIED Requirements

### Requirement: 表达式数据结构扩展
The system SHALL 支持光标位置追踪

#### Scenario: 光标位置索引
- **GIVEN** 表达式包含多个运算单元
- **WHEN** 定义光标位置
- **THEN** 使用单元索引表示光标位置（0 到 N）
- **AND** 索引 0 表示在最左侧
- **AND** 索引 N 表示在最右侧（N 为单元数量）

## REMOVED Requirements
无
