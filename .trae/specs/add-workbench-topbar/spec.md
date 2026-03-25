# Workbench 顶部操作栏优化 Spec

## Why
当前 Workbench.vue 页面的工具栏位于中间工作区上方，布局不够清晰。需要将操作按钮（保存、提测）与游戏信息（游戏标题、草稿ID、cfgID）整合到一个统一的顶部操作栏中，提升用户体验和操作效率。

## What Changes
- 在 Workbench.vue 页面顶部新增一个操作栏（top-action-bar）
- 左侧显示游戏信息：游戏标题、草稿ID、cfgID
- 右侧显示操作按钮：保存、提测
- 移除原有的 workbench-toolbar（或整合到新的顶部栏）
- 保持原有功能不变（快捷键、点击事件等）

## Impact
- Affected files: `/Users/zonst/Documents/Programs/WEBconfig/src/views/Workbench.vue`
- Affected components: 无新增组件，仅修改现有页面布局
- 样式调整：需要遵循 design_rule.md 中的亮色系规范

## ADDED Requirements

### Requirement: 顶部操作栏布局
The system SHALL provide a top action bar in Workbench.vue with the following layout:

#### Scenario: 正常显示
- **GIVEN** 用户进入规则配置工作台页面
- **WHEN** 页面加载完成
- **THEN** 顶部显示操作栏，左侧显示游戏标题、草稿ID、cfgID，右侧显示保存和提测按钮

#### Scenario: 游戏信息显示
- **GIVEN** 顶部操作栏已显示
- **THEN** 左侧显示：
  - 游戏标题（从 selectedConfig.name 获取）
  - 草稿ID（从 route.params.id 或当前草稿数据获取）
  - cfgID（从当前配置数据获取）

#### Scenario: 操作按钮功能
- **GIVEN** 顶部操作栏已显示
- **WHEN** 用户点击"保存"按钮
- **THEN** 触发 save() 方法，显示保存成功提示

- **WHEN** 用户点击"提测"按钮
- **THEN** 触发 publish() 方法，显示提测弹窗

#### Scenario: 快捷键支持
- **GIVEN** 顶部操作栏已显示
- **WHEN** 用户按下 Ctrl+S
- **THEN** 触发保存功能

- **WHEN** 用户按下 Ctrl+Enter
- **THEN** 触发提测功能

## MODIFIED Requirements

### Requirement: 原有工具栏调整
- 移除或简化原有的 workbench-toolbar 区域
- 将保存、提测按钮移至新的顶部操作栏
- 保留底部悬浮工具栏（游戏表现、变量管理、创房选项）

## UI 设计规范

### 顶部操作栏样式
- 高度：56px
- 背景色：#ffffff（白色）
- 边框：底部 1px solid #e5e7eb
- 阴影：0 1px 3px rgba(0, 0, 0, 0.1)
- 内边距：0 24px

### 左侧信息区域
- 游戏标题：16px，font-weight: 600，颜色 #1f2937
- ID 标签：12px，颜色 #6b7280，使用标签样式展示
- 间距：标签之间 8px

### 右侧按钮区域
- 保存按钮：
  - 样式：默认按钮样式
  - 图标：DocumentChecked
  - 文字：保存
  - hover 效果：绿色主题

- 提测按钮：
  - 样式：主要按钮样式（主题色背景）
  - 图标：Promotion
  - 文字：提测
  - hover 效果：加深主题色

### 按钮间距
- 按钮之间间距：12px
