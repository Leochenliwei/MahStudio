# 草稿列表按钮收纳优化 Spec

## Why
根据截图参考，草稿列表项需要展示更多操作按钮（编辑/查看规则、复制、复制到、提测、删除）。为了保持界面整洁，需要将低频操作按钮收纳到下拉菜单中。编辑和查看规则根据角色权限互斥显示。

## What Changes
- 在草稿列表项中添加"编辑/查看规则"按钮（互斥显示）
- 在草稿列表项中添加"删除"按钮（收纳到下拉菜单）
- 使用 `<el-dropdown>` 将低频按钮（复制、复制到、提测、删除）收纳到"更多"下拉菜单中
- 高频按钮（编辑/查看规则）保持直接显示
- 实现3秒动态切换效果演示权限变化

## Impact
- 受影响文件: `/Users/zonst/Documents/Programs/WEBconfig/src/views/GameDirectory.vue`
- UI区域: 草稿列表项操作按钮区域 (`.file-list-item-actions`)

## ADDED Requirements

### Requirement: 按钮收纳功能
The system SHALL provide organized action buttons for draft list items.

#### Scenario: 按钮展示
- **WHEN** 用户查看草稿列表
- **THEN** 每个草稿项显示：编辑/查看规则按钮（根据权限显示其一）、更多操作下拉菜单
- **AND** 下拉菜单中包含：复制、复制到、提测、删除

#### Scenario: 权限切换演示
- **WHEN** 页面加载后
- **THEN** 每3秒自动切换编辑/查看规则按钮的显示状态
- **AND** 用于演示权限区分效果

#### Scenario: 删除功能
- **WHEN** 用户点击删除按钮
- **THEN** 弹出确认对话框
- **AND** 确认后删除该草稿文件

#### Scenario: 查看规则
- **WHEN** 用户点击查看规则按钮
- **THEN** 以只读模式打开规则配置工作台

## MODIFIED Requirements

### Requirement: 草稿列表操作区
**现有实现**: 四个平铺按钮（编辑、复制、复制到、提测）
**修改后**: 
- 直接显示：编辑 或 查看规则（根据权限互斥显示，3秒切换演示）
- 下拉菜单（更多）：复制、复制到、提测、删除

## UI规范
- 使用 Element Plus 的 `<el-dropdown>` 组件
- 下拉菜单触发按钮样式：outline 风格
- 下拉菜单项图标使用 Element Plus 图标
- 删除按钮使用 danger 样式（红色）
- 编辑/查看规则按钮使用主题色
