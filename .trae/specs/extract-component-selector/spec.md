# 提取选项联动组件选择器为独立页面规格文档

## Why
当前 Drawer.vue 文件中包含了选项配置和组件选择器（选项联动）两个功能模块，代码量较大（约1879行）。为了提高代码的可维护性和复用性，需要将组件选择器功能独立成一个单独的 Vue 组件页面，保持当前结构和交互不变。

## What Changes
- 将 Drawer.vue 中的组件选择器（drawer-component-selector）部分提取为独立的 Vue 组件
- 新组件保持原有的所有功能和交互逻辑
- Drawer.vue 通过引用新组件的方式使用组件选择器功能
- 保持原有的 Props 和 Events 接口不变

## Impact
- 受影响文件:
  - src/components/Drawer.vue - 移除组件选择器相关代码，引入新组件
  - src/components/ComponentSelector.vue - 新建组件选择器组件

## ADDED Requirements

### Requirement: 新建 ComponentSelector 组件
The system SHALL provide a standalone ComponentSelector.vue component.

#### Scenario: 组件结构
- **WHEN** 创建 ComponentSelector.vue 文件
- **THEN** 组件应包含以下部分：
  - 左侧组件列表面板（搜索、分类文件夹、组件列表）
  - 右侧属性面板（属性瀑布流展示）
  - 底部操作按钮（取消/确定）
  - 视觉连接线（connection-line）

#### Scenario: Props 接口
- **WHEN** 父组件使用 ComponentSelector
- **THEN** 组件应接受以下 props：
  - `show`: Boolean - 控制显示/隐藏
  - `components`: Array - 组件列表数据
  - `editingOptionIndex`: Number - 当前编辑的选项索引
  - `editingOptionLabel`: String - 当前编辑的选项标签

#### Scenario: Events 接口
- **WHEN** 用户与组件选择器交互
- **THEN** 组件应触发以下事件：
  - `close` - 关闭组件选择器
  - `confirm` - 确认选择，携带 selectedComponents 数据
  - `toggle-component-status` - 切换组件状态
  - `update-component-property` - 更新组件属性

#### Scenario: 功能保持
- **WHEN** 用户使用组件选择器
- **THEN** 应保持以下原有功能：
  - 组件搜索过滤
  - 分类文件夹展开/折叠
  - 组件多选（复选框）
  - 组件启用/禁用切换
  - 属性勾选和编辑
  - 属性类型支持（switch、toggle、select、checkbox、text）

## MODIFIED Requirements

### Requirement: Drawer.vue 改造
The Drawer.vue file SHALL be refactored to use the new ComponentSelector component.

#### Scenario: 代码移除
- **WHEN** 改造 Drawer.vue
- **THEN** 应移除以下代码：
  - 组件选择器的 template 部分（drawer-component-selector div）
  - 组件选择器相关的 script 逻辑（searchKeyword、expandedCategories、selectedComponents 等）
  - 组件选择器相关的 style（保持通用样式）

#### Scenario: 组件引用
- **WHEN** 改造 Drawer.vue
- **THEN** 应添加：
  - 导入 ComponentSelector 组件
  - 使用 ComponentSelector 替换原有的组件选择器代码
  - 保持原有的 Props 和 Events 传递

## UI设计规范
遵循.trae/rules/design_rule.md中的亮色系设计规范：
- 主题色：#3b82f6
- 保持原有的左右分栏布局（左侧300px，右侧自适应）
- 保持原有的样式和动画效果
