# 表达式输入框嵌套标签块优化 Spec

## Why
当前 ExpressionInput 组件虽然实现了基本的标签化展示，但缺乏对复杂游戏元素引用的支持。用户需要能够表达"当前玩家的买分值"、"庄家的进行过碰"等带有身份前缀的游戏元素，并且需要支持"为/不为"的布尔判断。需要通过嵌套标签块的形式，提供更直观、更灵活的表达式编辑体验。

## What Changes
- 实现嵌套标签块结构，外层细边框包裹整个表达式单元
- 支持游戏元素的身份前缀（当前玩家、庄家、当前赢家等）
- 身份标签默认填充"当前玩家"，点击可切换
- 实现身份选择器 Dropdown，独立面板展示6种身份选项
- 支持"为/不为"布尔判断，点击直接切换
- 数值型元素格式：[身份] 的 [状态]
- 布尔型元素格式：[身份] 的状态 [为/不为] [状态]
- 不需要身份的元素（牌局状态、创房选项）直接显示
- **BREAKING**: 表达式数据结构需要支持嵌套单元和身份字段

## Impact
- Affected specs: expression-input-tag-ui（已完成）
- Affected code:
  - `/Users/zonst/Documents/Programs/WEBconfig/src/components/editors/ExpressionInput.vue` - 标签渲染、交互逻辑
  - 新增 `/Users/zonst/Documents/Programs/WEBconfig/src/components/editors/IdentitySelector.vue` - 身份选择器组件
- 数据结构变更：
  - Token 类型需要支持嵌套结构和身份字段
  - ElementItem 需要标识是否需要身份

## ADDED Requirements

### Requirement: 嵌套标签块渲染
The system SHALL 以嵌套标签块形式展示游戏元素引用

#### Scenario: 数值型元素展示
- **GIVEN** 用户插入数值型游戏元素（value_type: 2）
- **WHEN** 渲染表达式
- **THEN** 显示为嵌套标签块，外层有1px细边框（#e5e7eb）
- **AND** 格式为：[身份标签] 的 [状态标签]
- **AND** 身份标签为蓝色（#dbeafe/#1e40af）
- **AND** 状态标签为绿色（#d1fae5/#065f46）
- **AND** "的"为灰色描述文本（#9ca3af）
- **AND** 示例：[当前玩家] 的 [买分值]

#### Scenario: 布尔型元素展示
- **GIVEN** 用户插入布尔型游戏元素（value_type: 1）
- **WHEN** 渲染表达式
- **THEN** 显示为嵌套标签块，外层有1px细边框（#e5e7eb）
- **AND** 格式为：[身份标签] 的状态 [为/不为标签] [状态标签]
- **AND** 身份标签为蓝色（#dbeafe/#1e40af）
- **AND** "的状态"为灰色描述文本（#9ca3af）
- **AND"为/不为"标签为灰色背景（#f3f4f6/#374151），可点击切换
- **AND** 状态标签为绿色（#d1fae5/#065f46）
- **AND** 示例：[当前玩家] 的状态 [为] [进行过碰]

#### Scenario: 无需身份的元素展示
- **GIVEN** 元素类型为牌局状态或创房选项
- **WHEN** 渲染表达式
- **THEN** 直接显示为绿色标签
- **AND** 不显示身份前缀
- **AND** 示例：[当前局数]

### Requirement: 身份选择功能
The system SHALL 支持选择和切换身份

#### Scenario: 默认填充当前玩家
- **GIVEN** 用户插入需要身份的游戏元素
- **WHEN** 元素插入表达式
- **THEN** 身份默认为"当前玩家"
- **AND** 显示为蓝色标签：[当前玩家]

#### Scenario: 点击身份标签打开选择器
- **GIVEN** 用户点击身份标签（如[当前玩家]）
- **WHEN** 点击事件触发
- **THEN** 弹出身份选择器 Dropdown
- **AND** 选择器为独立面板，覆盖在其他内容之上
- **AND** 显示6种身份选项：当前玩家、当前赢家、庄家、所有闲家、所有玩家、其他玩家

#### Scenario: 选择新身份
- **GIVEN** 身份选择器已打开
- **WHEN** 用户点击某个身份选项
- **THEN** 关闭选择器
- **AND** 更新身份标签为选中的身份
- **AND** 更新表达式数据

#### Scenario: 泛身份标识
- **GIVEN** 用户选择泛身份（所有闲家、所有玩家、其他玩家）
- **WHEN** 渲染身份标签
- **THEN** 在标签上显示特殊标识（如*号或不同颜色边框）
- **AND** 提示用户这是泛身份

### Requirement: 为/不为切换功能
The system SHALL 支持布尔判断的切换

#### Scenario: 点击切换为/不为
- **GIVEN"为/不为"标签显示在表达式中
- **WHEN** 用户点击该标签
- **THEN"为"切换为"不为"，或"不为"切换为"为"
- **AND** 切换有过渡动画（150ms ease）
- **AND"不为"显示时，标签背景色略深或添加删除线样式

### Requirement: 表达式单元删除
The system SHALL 支持删除整个表达式单元

#### Scenario: 删除嵌套标签块
- **GIVEN** 用户点击嵌套标签块内的任意标签
- **WHEN** 标签被选中（显示高亮边框）
- **THEN** 显示删除按钮（×）
- **AND** 点击删除按钮移除整个表达式单元
- **AND** 更新表达式数据

### Requirement: 身份选择器组件
The system SHALL 提供独立的身份选择器组件

#### Scenario: 身份选择器展示
- **GIVEN** 身份选择器被触发打开
- **WHEN** 渲染选择器面板
- **THEN** 显示6个身份选项按钮
- **AND** 布局为2列3行或1列6行
- **AND** 当前选中的身份有高亮样式

#### Scenario: 身份选项样式
- **GIVEN** 身份选择器显示选项
- **WHEN** 渲染每个选项
- **THEN** 普通身份：当前玩家、当前赢家、庄家 - 蓝色系
- **AND** 泛身份：所有闲家、所有玩家、其他玩家 - 橙色系或带特殊标识

## MODIFIED Requirements

### Requirement: Token 数据结构扩展
The system SHALL 扩展 Token 类型以支持嵌套表达式单元

#### Scenario: 嵌套单元 Token 定义
- **GIVEN** 解析表达式字符串
- **WHEN** 生成 Token 列表
- **THEN** Token 包含字段：
  - type: 'unit' | 'element' | 'operator' | 'number' | 'text'
  - value: string
  - category?: 'identity' | 'status' | 'fanxing' | 'variable' | 'game' | 'roomOption'
  - valueType?: 1 | 2  // 1=布尔, 2=数值
  - identity?: string  // 身份key：cur_player, winner, dealer...
  - isNegated?: boolean  // 是否为"不为"
  - children?: Token[]  // 嵌套子token（用于unit类型）

#### Scenario: 表达式单元数据结构
- **GIVEN** 定义表达式单元
- **WHEN** 创建 ExpressionUnit
- **THEN** 包含字段：
  - identity: string  // 身份key
  - element: ElementItem  // 元素定义
  - isNegated: boolean  // 是否为否定
  - rawValue: string  // 原始表达式字符串

### Requirement: ElementItem 数据结构扩展
The system SHALL 标识元素是否需要身份

#### Scenario: 元素身份需求标识
- **GIVEN** 定义游戏元素
- **WHEN** 创建 ElementItem
- **THEN** 包含字段：
  - key: string
  - name: string
  - category: 'status' | 'fanxing' | 'variable' | 'game' | 'roomOption'
  - requiresIdentity: boolean  // 是否需要身份前缀
  - valueType?: 1 | 2
  - description?: string

## REMOVED Requirements
无
