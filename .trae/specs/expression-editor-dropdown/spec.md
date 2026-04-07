# 表达式编辑器 Dropdown 优化 Spec

## Why
当前 ExpressionInput 组件的虚拟键盘和元素选择面板始终显示，占用较多空间。需要优化为输入框和编辑器面板分离的布局，当用户激活输入框时才以 dropdown 形式展示编辑器，减少界面占用，提升用户体验。

## What Changes
- 重构 ExpressionInput.vue，分离输入框和编辑器面板
- 输入框默认只显示表达式内容，不显示键盘和元素面板
- 当输入框获得焦点时，以 dropdown/popover 形式展开编辑器面板
- 编辑器面板包含虚拟键盘和元素选择面板（左右布局）
- 点击外部区域或按 Esc 键关闭 dropdown
- **BREAKING**: ExpressionInput 组件结构和交互方式变更

## Impact
- Affected specs: expression-editor-optimization
- Affected code:
  - `/Users/zonst/Documents/Programs/WEBconfig/src/components/editors/ExpressionInput.vue` - 需要重构
- 依赖组件：ActionLimitEditor.vue（已集成 ExpressionInput）

## ADDED Requirements

### Requirement: 分离式布局
The system SHALL 将输入框和编辑器面板分离，输入框独立显示

#### Scenario: 默认状态
- **GIVEN** 页面加载完成
- **WHEN** 用户查看 ExpressionInput 组件
- **THEN** 只显示表达式输入框（带标签显示）
- **AND** 不显示虚拟键盘和元素选择面板
- **AND** 输入框显示 placeholder 提示

#### Scenario: 输入框样式
- **GIVEN** 输入框处于默认状态
- **WHEN** 用户查看输入框
- **THEN** 显示为单行输入框样式
- **AND** 高度约 40-48px
- **AND** 边框、圆角与 Element Plus 输入框一致
- **AND** 右侧显示下拉箭头图标（表示可展开）

### Requirement: Dropdown 展开
The system SHALL 当输入框激活时以 dropdown 形式展开编辑器面板

#### Scenario: 点击展开
- **GIVEN** 输入框处于默认状态
- **WHEN** 用户点击输入框
- **THEN** 在输入框下方展开 dropdown 面板
- **AND** dropdown 包含虚拟键盘和元素选择面板
- **AND** dropdown 宽度与输入框一致或更宽

#### Scenario: Dropdown 布局
- **GIVEN** dropdown 已展开
- **WHEN** 用户查看 dropdown 内容
- **THEN** 采用左右布局：左侧虚拟键盘，右侧元素选择面板
- **AND** 键盘区占 50-55% 宽度
- **AND** 元素面板占 45-50% 宽度
- **AND** dropdown 最小高度 300px

#### Scenario: Dropdown 定位
- **GIVEN** dropdown 需要展开
- **WHEN** 计算 dropdown 位置
- **THEN** 默认在输入框下方展开
- **AND** 如果下方空间不足，则在上方展开
- **AND** dropdown 与输入框左对齐

### Requirement: Dropdown 关闭
The system SHALL 提供多种方式关闭 dropdown

#### Scenario: 点击外部关闭
- **GIVEN** dropdown 已展开
- **WHEN** 用户点击 dropdown 外部区域
- **THEN** dropdown 关闭
- **AND** 输入框失去焦点

#### Scenario: 按 Esc 关闭
- **GIVEN** dropdown 已展开且处于焦点状态
- **WHEN** 用户按下 Esc 键
- **THEN** dropdown 关闭
- **AND** 输入框失去焦点

#### Scenario: 选择元素后保持打开
- **GIVEN** dropdown 已展开
- **WHEN** 用户选择元素插入表达式
- **THEN** 元素插入到输入框
- **AND** dropdown 保持打开状态
- **AND** 用户可继续编辑

### Requirement: 虚拟键盘（Dropdown 内）
The system SHALL 在 dropdown 内提供虚拟键盘

#### Scenario: 键盘布局
- **GIVEN** dropdown 已展开
- **WHEN** 用户查看键盘区域
- **THEN** 显示 4 行按钮网格
- **AND** 按钮尺寸 48-52px
- **AND** 与之前设计保持一致

#### Scenario: 键盘按钮功能
- **GIVEN** 用户点击键盘按钮
- **WHEN** 按钮被点击
- **THEN** 对应字符插入到表达式
- **AND** 输入框实时更新显示
- **AND** dropdown 保持打开

### Requirement: 元素选择面板（Dropdown 内）
The system SHALL 在 dropdown 内提供元素选择面板

#### Scenario: 面板结构
- **GIVEN** dropdown 已展开
- **WHEN** 用户查看元素面板
- **THEN** 顶部显示搜索框
- **AND** 显示分类 Tab
- **AND** 显示元素列表

#### Scenario: 元素选择
- **GIVEN** 用户点击元素列表中的元素
- **WHEN** 元素被选中
- **THEN** 元素以标签形式插入表达式
- **AND** 输入框更新显示
- **AND** dropdown 保持打开

### Requirement: 输入框内容显示
The system SHALL 在输入框中正确显示表达式内容

#### Scenario: 显示标签
- **GIVEN** 表达式中包含元素
- **WHEN** 用户查看输入框（dropdown 关闭状态）
- **THEN** 元素显示为主题色标签样式
- **AND** 标签显示元素名称（非 key）
- **AND** 普通文本正常显示

#### Scenario: 标签截断
- **GIVEN** 表达式内容较多
- **WHEN** 超出输入框宽度
- **THEN** 显示省略号
- **AND** 保持标签完整显示优先

### Requirement: 键盘快捷键
The system SHALL 支持键盘快捷键操作

#### Scenario: 快捷键在 Dropdown 内有效
- **GIVEN** dropdown 已展开
- **WHEN** 用户按下 Ctrl+E
- **THEN** 聚焦到元素面板搜索框

#### Scenario: 清空快捷键
- **GIVEN** dropdown 已展开
- **WHEN** 用户按下 Ctrl+D
- **THEN** 清空表达式内容

## MODIFIED Requirements

### Requirement: ExpressionInput 组件重构
The system SHALL 重构 ExpressionInput.vue 实现分离式布局

#### Scenario: 组件结构变更
- **GIVEN** ExpressionInput 组件
- **WHEN** 渲染组件
- **THEN** 使用相对定位容器
- **AND** 输入框作为触发器
- **AND** dropdown 使用绝对定位

#### Scenario: Props 保持兼容
- **GIVEN** 组件重构
- **WHEN** 检查 props 接口
- **THEN** 保持 v-model 绑定
- **AND** 保持 placeholder 属性
- **AND** 保持其他原有功能

## REMOVED Requirements
无
