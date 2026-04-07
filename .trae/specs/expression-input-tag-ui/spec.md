# 表达式输入框标签化UI优化 Spec

## Why
当前 ExpressionInput 组件的标签展示样式单一，所有元素都使用相同的蓝色标签样式。用户难以区分不同类型的对象（身份、状态、数值、操作符），降低了表达式的可读性和编辑效率。需要优化为标签化展示，用不同颜色区分对象类型，提升可视化体验。

## What Changes
- 优化 ExpressionInput.vue 中的标签渲染逻辑，支持四类对象的颜色区分
- 身份类标签使用蓝色系（#dbeafe 背景，#1e40af 文字）
- 状态类标签使用绿色系（#d1fae5 背景，#065f46 文字）
- 数值类标签使用灰色系（#f3f4f6 背景，#374151 文字）
- 描述文本（的、状态、为/不为）使用灰色文字（#9ca3af）弱化显示
- 操作符使用纯文本灰色（#6b7280），无背景
- 标签样式：圆角矩形（4px）、舒适间距（4px）、标准内边距（2px 8px）
- 删除按钮悬停显示，位于标签右侧
- **BREAKING**: 标签的数据结构需要支持 type 字段区分对象类型

## Impact
- Affected specs: 无
- Affected code:
  - `/Users/zonst/Documents/Programs/WEBconfig/src/components/editors/ExpressionInput.vue` - 标签渲染和样式
- 数据结构变更：
  - Token 类型需要增加 `category` 字段（identity/status/number/operator/description）

## ADDED Requirements

### Requirement: 多类型标签渲染
The system SHALL 根据元素类型渲染不同样式的标签

#### Scenario: 身份类标签显示
- **GIVEN** 表达式中包含身份类元素（如"当前玩家"、"庄家"）
- **WHEN** 用户查看输入区域
- **THEN** 显示为蓝色标签
- **AND** 背景色 #dbeafe，文字色 #1e40af
- **AND** 圆角 4px，内边距 2px 8px

#### Scenario: 状态类标签显示
- **GIVEN** 表达式中包含状态类元素（如"买分值"、"吃的次数"）
- **WHEN** 用户查看输入区域
- **THEN** 显示为绿色标签
- **AND** 背景色 #d1fae5，文字色 #065f46
- **AND** 圆角 4px，内边距 2px 8px

#### Scenario: 数值类标签显示
- **GIVEN** 表达式中包含数值常量（如"8"、"16"）
- **WHEN** 用户查看输入区域
- **THEN** 显示为灰色标签
- **AND** 背景色 #f3f4f6，文字色 #374151
- **AND** 圆角 4px，内边距 2px 8px

#### Scenario: 描述文本显示
- **GIVEN** 表达式中包含描述性文本（如"的"、"状态"、"为/不为"）
- **WHEN** 用户查看输入区域
- **THEN** 显示为灰色文字 #9ca3af
- **AND** 无背景色
- **AND** 字体大小 13px

#### Scenario: 操作符显示
- **GIVEN** 表达式中包含操作符（如"+"、"-"、">"、"<"）
- **WHEN** 用户查看输入区域
- **THEN** 显示为灰色文字 #6b7280
- **AND** 无背景色
- **AND** 字体大小 14px

### Requirement: 标签删除功能
The system SHALL 支持删除标签

#### Scenario: 悬停显示删除按钮
- **GIVEN** 用户鼠标悬停在标签上
- **WHEN** hover 状态触发
- **THEN** 标签右侧显示 × 删除按钮
- **AND** 删除按钮颜色 #9ca3af，hover 时 #ef4444
- **AND** 过渡动画 150ms ease

#### Scenario: 点击删除标签
- **GIVEN** 标签显示删除按钮
- **WHEN** 用户点击删除按钮
- **THEN** 从表达式中移除该标签
- **AND** 更新 v-model 值

### Requirement: 数据类型差异化展示
The system SHALL 根据数据类型展示不同结构的标签组合

#### Scenario: 数值型元素展示
- **GIVEN** 元素数据类型为数值（value_type: 2）
- **WHEN** 渲染表达式
- **THEN** 格式为：[身份类] 的 [状态类]
- **AND** 示例：当前玩家的 买分值

#### Scenario: 布尔型元素展示
- **GIVEN** 元素数据类型为布尔（value_type: 1）
- **WHEN** 渲染表达式
- **THEN** 格式为：[身份类] 的状态 [状态类]
- **AND** 或：[身份类] 的状态 为/不为 [状态类]（带条件时）
- **AND** 示例：当前玩家 的状态 进行过碰

### Requirement: 标签间距和布局
The system SHALL 保持标签间的合理间距

#### Scenario: 标签容器布局
- **GIVEN** 表达式包含多个标签
- **WHEN** 渲染标签列表
- **THEN** 使用 flex 布局，gap: 4px
- **AND** 标签垂直居中对齐
- **AND** 支持换行显示

#### Scenario: 输入框自适应高度
- **GIVEN** 表达式内容较多
- **WHEN** 标签需要换行
- **THEN** 输入框高度自动增加
- **AND** 最小高度 40px
- **AND** 最大高度 120px，超出显示滚动条

## MODIFIED Requirements

### Requirement: Token 数据结构
The system SHALL 扩展 Token 类型以支持多类型标签

#### Scenario: Token 类型定义
- **GIVEN** 解析表达式字符串
- **WHEN** 生成 Token 列表
- **THEN** Token 包含字段：
  - type: 'element' | 'text' | 'operator'
  - value: string
  - category?: 'identity' | 'status' | 'number' | 'description'
  - valueType?: 1 | 2  // 1=布尔类, 2=数值类

#### Scenario: 元素数据结构扩展
- **GIVEN** 元素数据定义
- **WHEN** 定义 ElementItem
- **THEN** 包含字段：
  - key: string
  - name: string
  - category: 'identity' | 'status' | 'game' | 'variable'
  - valueType?: 1 | 2  // 接口返回字段：1=布尔类, 2=数值类
  - description?: string

## REMOVED Requirements
无
