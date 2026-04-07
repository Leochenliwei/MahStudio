# 表达式编辑器交互与UI优化 Spec

## Why
当前 ActionLimitEditor.vue 中的触发条件输入框使用简单的 textarea，用户构建表达式时体验不佳：需要手动输入所有内容，没有可视化的元素选择和键盘辅助。需要优化为可视化的表达式编辑器，提升用户构建复杂条件表达式的效率和体验。

## What Changes
- 将 ActionLimitEditor.vue 中的 condition textarea 替换为 ExpressionInput 组件
- ExpressionInput 组件包含：表达式显示区域、虚拟键盘、元素选择面板
- 采用左右布局，键盘和元素选择面板同时可见
- 元素选择支持分类Tab切换和全局搜索
- 优化键盘按钮排列，逻辑运算符（且/或/非）单独一行
- 增强选中状态的视觉反馈（主题色竖条+✓图标）
- **BREAKING**: condition 输入方式从纯文本输入变为可视化编辑器

## Impact
- Affected specs: 无
- Affected code:
  - `/Users/zonst/Documents/Programs/WEBconfig/src/components/editors/ActionLimitEditor.vue` - 第154-161行的 el-input 需要替换
- 新增组件：
  - `ExpressionInput.vue` - 表达式编辑器主组件（包含输入区域、键盘、元素面板）

## ADDED Requirements

### Requirement: ExpressionInput 组件
The system SHALL 创建 ExpressionInput.vue 组件，集成表达式输入、虚拟键盘和元素选择功能

#### Scenario: 组件基本结构
- **GIVEN** ExpressionInput 组件被使用
- **WHEN** 组件渲染
- **THEN** 顶部显示表达式输入区域
- **AND** 下方分为左右两栏：左侧虚拟键盘，右侧元素选择面板

#### Scenario: 值绑定
- **GIVEN** ExpressionInput 组件有 v-model 绑定
- **WHEN** 用户通过键盘或元素选择修改表达式
- **THEN** 组件实时更新 v-model 的值
- **AND** 值格式为字符串形式的表达式

### Requirement: 表达式输入区域
The system SHALL 在 ExpressionInput 组件顶部提供表达式输入区域

#### Scenario: 输入区域显示
- **GIVEN** ExpressionInput 组件已渲染
- **WHEN** 用户查看组件顶部
- **THEN** 显示表达式输入框，背景白色，圆角8px
- **AND** 已插入的元素显示为主题色标签
- **AND** 清空按钮显示在输入区域右上角

#### Scenario: 元素标签显示
- **GIVEN** 表达式中包含元素（如"当前玩家"、"买分/下漂/下嘴的值"）
- **WHEN** 用户查看输入区域
- **THEN** 元素显示为圆角标签，背景#3b82f6，白色文字
- **AND** 标签hover显示删除图标（×）
- **AND** 点击删除图标可移除该元素

#### Scenario: 清空操作
- **GIVEN** 输入区域有内容
- **WHEN** 用户点击右上角清空按钮
- **THEN** 清空整个表达式
- **AND** 支持快捷键 Ctrl+D

### Requirement: 虚拟键盘
The system SHALL 在 ExpressionInput 左侧提供虚拟键盘

#### Scenario: 键盘布局
- **GIVEN** 虚拟键盘已显示
- **WHEN** 用户查看键盘区域
- **THEN** 显示4行按钮网格
- **AND** 按钮尺寸统一为52×48px，间距8px

#### Scenario: 第一行（数字7-9和基本运算符）
- **GIVEN** 虚拟键盘已显示
- **WHEN** 用户查看第一行
- **THEN** 显示：7、8、9、+、-
- **AND** 数字按钮背景#f9fafb
- **AND** 运算符按钮背景#eff6ff，文字#3b82f6

#### Scenario: 第二行（数字4-6和比较运算符）
- **GIVEN** 虚拟键盘已显示
- **WHEN** 用户查看第二行
- **THEN** 显示：4、5、6、×、÷、(、)
- **AND** 运算符和括号使用主题色背景区分

#### Scenario: 第三行（数字1-3和逻辑运算符）
- **GIVEN** 虚拟键盘已显示
- **WHEN** 用户查看第三行
- **THEN** 显示：1、2、3、=、^、⌫
- **AND** 删除按钮使用红色系背景#fef2f2

#### Scenario: 第四行（数字0和逻辑运算符）
- **GIVEN** 虚拟键盘已显示
- **WHEN** 用户查看第四行
- **THEN** 显示：0、.、且、或、非、!
- **AND** 逻辑运算符（且、或、非）使用绿色系背景#f0fdf4
- **AND** 4个按钮均分宽度

#### Scenario: 按钮点击效果
- **GIVEN** 用户点击键盘按钮
- **WHEN** 按钮被点击
- **THEN** 将对应字符插入到表达式光标位置
- **AND** 按钮有视觉反馈（背景加深）

#### Scenario: 按钮Hover动效
- **GIVEN** 用户hover在键盘按钮上
- **WHEN** hover状态触发
- **THEN** 按钮向上移动2px（translateY(-2px)）
- **AND** 显示阴影 0 4px 12px rgba(0,0,0,0.08)
- **AND** 过渡动画150ms ease

### Requirement: 元素选择面板
The system SHALL 在 ExpressionInput 右侧提供元素选择面板

#### Scenario: 面板结构
- **GIVEN** 元素选择面板已显示
- **WHEN** 用户查看面板
- **THEN** 顶部显示搜索框
- **AND** 下方显示分类Tab（牌局、状态、身份、牌型）
- **AND】 Tab下方显示元素列表

#### Scenario: 搜索功能
- **GIVEN** 元素选择面板已显示
- **WHEN** 用户在搜索框输入关键词
- **THEN** 实时过滤所有分类的元素（防抖200ms）
- **AND】 显示匹配的元素列表
- **AND】 搜索支持跨分类全局搜索

#### Scenario: 分类切换
- **GIVEN** 元素选择面板已显示
- **WHEN** 用户点击分类Tab
- **THEN】 切换到对应分类的元素列表
- **AND】 当前Tab显示主题色下划线
- **AND】 状态分类可能包含几百个元素

#### Scenario: 元素列表项
- **GIVEN】 元素列表已显示
- **WHEN】 用户查看列表项
- **THEN】 每项高度44px，文字14px
- **AND】 hover背景变为#f9fafb
- **AND】 支持Tooltip显示元素详细说明

#### Scenario: 元素选中状态
- **GIVEN】 某个元素被选中（最近插入的）
- **WHEN】 用户查看该元素
- **THEN】 背景变为#eff6ff
- **AND】 文字变为#3b82f6
- **AND】 左侧显示3px主题色竖条
- **AND】 右侧显示✓图标

#### Scenario: 元素插入
- **GIVEN】 用户点击元素列表中的某一项
- **WHEN】 点击触发
- **THEN】 该元素以标签形式插入到表达式
- **AND】 元素格式为「分类.元素名」（如「状态.买分/下漂/下嘴的值」）

### Requirement: 键盘快捷键
The system SHALL 支持键盘快捷键操作

#### Scenario: 聚焦搜索框
- **GIVEN】 ExpressionInput 处于焦点状态
- **WHEN】 用户按下 Ctrl+E
- **THEN】 焦点移动到元素选择面板的搜索框

#### Scenario: 清空表达式
- **GIVEN】 ExpressionInput 处于焦点状态
- **WHEN】 用户按下 Ctrl+D
- **THEN】 清空表达式输入区域的所有内容

#### Scenario: 列表导航
- **GIVEN】 元素选择面板搜索框有焦点
- **WHEN】 用户按 ↑/↓ 键
- **THEN】 在元素列表中上下移动高亮项

#### Scenario: 选择元素
- **GIVEN】 元素列表中有高亮项
- **WHEN】 用户按 Enter 键
- **THEN】 将高亮元素插入到表达式

### Requirement: 响应式布局
The system SHALL 支持不同屏幕尺寸的布局适配

#### Scenario: 宽屏布局（≥1200px）
- **GIVEN】 屏幕宽度≥1200px
- **WHEN】 渲染 ExpressionInput
- **THEN】 键盘区占55%宽度
- **AND】 元素面板占45%宽度

#### Scenario: 中等屏幕布局（768px-1199px）
- **GIVEN】 屏幕宽度在768px-1199px之间
- **WHEN】 渲染 ExpressionInput
- **THEN】 键盘区占50%宽度
- **AND】 元素面板占50%宽度

#### Scenario: 小屏幕布局（<768px）
- **GIVEN】 屏幕宽度<768px
- **WHEN】 渲染 ExpressionInput
- **THEN】 采用上下布局
- **AND】 键盘在上，元素面板在下

## MODIFIED Requirements

### Requirement: ActionLimitEditor 触发条件输入
The system SHALL 将 ActionLimitEditor.vue 中的 condition 输入从 textarea 改为 ExpressionInput 组件

#### Scenario: 替换输入组件
- **GIVEN】 ActionLimitEditor.vue 规则内容区域
- **WHEN】 渲染触发条件输入
- **THEN】 使用 ExpressionInput 组件替代 el-input textarea
- **AND】 v-model 绑定 item.condition
- **AND】 placeholder 为"请输入条件表达式"

#### Scenario: 数据格式兼容
- **GIVEN】 用户通过 ExpressionInput 编辑条件
- **WHEN】 保存规则时
- **THEN】 表达式值以字符串格式保存
- **AND】 与现有数据格式兼容

## REMOVED Requirements
无
