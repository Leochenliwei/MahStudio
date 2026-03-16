# 替换为 Element Plus Icon 系统规格文档

## Why
项目目前使用自定义的 Icon 组件（基于 SVG sprite）来显示图标，但为了更好地与 Element Plus 组件库集成，简化图标管理，需要将所有自定义图标替换为 Element Plus 的 el-icon 系统。

## What Changes
- 全局替换所有自定义 Icon 组件引用为 Element Plus 的 el-icon
- 安装并配置 `@element-plus/icons-vue` 图标库
- 将所有 sprite.svg 图标名称映射到 Element Plus 图标名称
- 删除不再使用的 Icon.vue 组件和相关 sprite.svg 文件

## Impact
- 受影响的文件：所有 Vue 组件文件（26个文件）
- 需要安装：`@element-plus/icons-vue` 依赖
- 需要删除：`src/components/Icon.vue`, `public/icons/sprite.svg`

## ADDED Requirements

### Requirement: Element Plus 图标系统
系统 SHALL 使用 Element Plus 的 `@element-plus/icons-vue` 作为唯一的图标显示方式

#### Scenario: 图标组件使用
- **GIVEN** 项目中的任意 Vue 组件
- **WHEN** 需要显示图标时
- **THEN** 使用 `<el-icon><IconName /></el-icon>` 或 `<IconName />` 格式
- **AND** 图标必须从 `@element-plus/icons-vue` 导入

### Requirement: 图标名称映射
系统 SHALL 维护 sprite.svg 图标名称到 Element Plus 图标名称的映射关系

#### Scenario: 图标名称转换
- **GIVEN** sprite.svg 图标名称（如 `grid`, `box`, `arrow-undo`）
- **WHEN** 替换为 Element Plus 图标系统
- **THEN** 转换为对应的 Element Plus 图标组件（如 `Grid`, `Box`, `ArrowUndo`）

## MODIFIED Requirements

### Requirement: 图标组件导入
所有 Vue 组件 SHALL 从 `@element-plus/icons-vue` 导入需要的图标组件

### Requirement: 图标使用方式
所有图标 SHALL 使用以下格式之一：
- `<el-icon><IconName /></el-icon>` - 配合 Element Plus 组件使用
- `<IconName />` - 独立使用图标组件

## REMOVED Requirements

### Requirement: 自定义 Icon 组件
**Reason**: 统一使用 Element Plus 图标系统
**Migration**: 
- 删除 `src/components/Icon.vue`
- 删除 `public/icons/sprite.svg`
- 删除 `public/icons/` 目录
- 将所有 `<Icon name="xxx" />` 替换为对应的 Element Plus 图标组件
