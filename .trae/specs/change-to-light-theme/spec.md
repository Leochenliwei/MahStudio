# 亮色系主题改造规格说明

## Why
当前系统使用深色主题（#1e1e1e背景），需要转换为亮色系主题以提升用户体验和视觉舒适度。白底为主的配色方案更加清爽、专业，符合现代SaaS产品的设计趋势。

## What Changes
- **BREAKING**: 全局色彩系统从深色主题改为亮色系
- **BREAKING**: 工作台背景改为浅灰色（#f5f5f5）
- **BREAKING**: 主背景改为纯白色（#ffffff）
- **BREAKING**: 文本颜色从浅色改为深色（适配白底）
- **BREAKING**: 边框、阴影、卡片样式适配亮色系
- **BREAKING**: 更新design_rule.md中的颜色规范

## Impact
- Affected specs: 全局样式系统、UI组件库、工作台界面
- Affected code: 
  - `src/style.css` - CSS变量定义
  - `src/views/Workbench.vue` - 工作台页面样式
  - `src/App.vue` - 应用主框架样式
  - `.trae/rules/design_rule.md` - 设计规范文档

## ADDED Requirements

### Requirement: 亮色系色彩系统
The system SHALL provide a comprehensive light theme color system.

#### Scenario: 主色调
- **GIVEN** 用户查看界面
- **WHEN** 界面渲染时
- **THEN** 使用以下主色调：
  - 主题色：#3b82f6（蓝色，专业清爽）
  - 主题色hover：#2563eb
  - 主题色active：#1d4ed8

#### Scenario: 背景色
- **GIVEN** 用户查看不同区域
- **WHEN** 区域渲染时
- **THEN** 使用以下背景色：
  - 主背景：#ffffff（纯白）
  - 工作台背景：#f5f5f5（浅灰）
  - 表面色：#fafafa（卡片背景）
  - 表面hover：#f0f0f0
  - 表面active：#e8e8e8

#### Scenario: 文本颜色
- **GIVEN** 用户阅读文本
- **WHEN** 文本渲染时
- **THEN** 使用以下文本色：
  - 主要文本：#1f2937（深灰，接近黑色）
  - 次要文本：#4b5563
  - 三级文本：#9ca3af
  - 禁用文本：#d1d5db

#### Scenario: 边框和分隔线
- **GIVEN** 用户查看边框元素
- **WHEN** 边框渲染时
- **THEN** 使用以下边框色：
  - 边框默认：#e5e7eb
  - 边框浅色：#f3f4f6
  - 边框深色：#d1d5db

#### Scenario: 辅助色
- **GIVEN** 用户查看状态指示
- **WHEN** 状态元素渲染时
- **THEN** 保持以下辅助色：
  - 成功：#10b981
  - 警告：#f59e0b
  - 危险：#ef4444
  - 信息：#3b82f6

## MODIFIED Requirements

### Requirement: 工作台画布背景
**原需求**: 工作台使用深色背景配网格线
**修改后**: 
- 工作台画布背景：#f5f5f5（浅灰）
- 网格线颜色：rgba(0, 0, 0, 0.05)（浅灰网格）
- 分类容器边框：#d1d5db（灰色虚线）
- 分类容器背景：rgba(255, 255, 255, 0.5)（半透明白）

### Requirement: 卡片和面板样式
**原需求**: 深色卡片背景配浅色边框
**修改后**:
- 卡片背景：#ffffff（白色）
- 卡片边框：1px solid #e5e7eb
- 卡片阴影：0 1px 3px rgba(0, 0, 0, 0.1)
- 面板头部背景：#fafafa

### Requirement: 侧边栏样式
**原需求**: 深色侧边栏
**修改后**:
- 侧边栏背景：#ffffff（白色）
- 侧边栏边框：1px solid #e5e7eb
- 侧边栏头部背景：#fafafa

### Requirement: 标签栏样式
**原需求**: 深色标签栏
**修改后**:
- 标签栏背景：#ffffff（白色）
- 活跃标签背景：#f5f5f5
- 标签边框：#e5e7eb

## REMOVED Requirements
无移除的需求
