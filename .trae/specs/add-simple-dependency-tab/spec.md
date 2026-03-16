# 添加简版选项联动Tab规格文档

## Why
当前RoomCreatorPage.vue中已有"选项联动（高阶）"Tab，使用复杂的可视化编辑器（DependencyEditor）来管理联动规则。但对于一些简单场景，用户需要一个更简洁、传统的CRUD界面来快速查看和管理所有联动规则，而不需要进入复杂的可视化编辑器。

## What Changes
- 在RoomCreatorPage.vue的Tab栏新增"选项联动（简版）"Tab按钮
- 点击简版Tab跳转到新的简版联动规则管理页面
- 简版页面以传统CRUD表格形式展示所有创建的联动规则
- 支持查看、新增、编辑、删除联动规则的基础操作

## Impact
- 受影响文件:
  - src/views/RoomCreatorPage.vue - 新增Tab按钮和路由跳转逻辑
  - src/router/index.js - 新增简版页面路由
  - src/views/SimpleDependencyPage.vue - 新建简版联动规则管理页面

## ADDED Requirements

### Requirement: 简版Tab按钮
The system SHALL provide a "选项联动（简版）" tab button in RoomCreatorPage.vue.

#### Scenario: Tab切换
- **WHEN** 用户点击"选项联动（简版）"按钮
- **THEN** 页面跳转到简版联动规则管理页面

### Requirement: 简版联动规则页面
The system SHALL provide a simple CRUD page for managing dependency rules.

#### Scenario: 规则列表展示
- **WHEN** 用户进入简版页面
- **THEN** 系统以表格形式展示所有联动规则，包含以下列：
  - 规则ID
  - 触发条件描述
  - 目标组件
  - 操作类型（显示/隐藏/禁用等）
  - 操作按钮（编辑/删除）

#### Scenario: 新增规则
- **WHEN** 用户点击"新增规则"按钮
- **THEN** 弹出表单供用户配置新的联动规则

#### Scenario: 编辑规则
- **WHEN** 用户点击某条规则的"编辑"按钮
- **THEN** 弹出表单预填充该规则数据供修改

#### Scenario: 删除规则
- **WHEN** 用户点击某条规则的"删除"按钮
- **THEN** 系统弹出确认对话框，确认后删除该规则

#### Scenario: 返回高阶页面
- **WHEN** 用户点击"返回高阶编辑器"按钮
- **THEN** 页面返回到RoomCreatorPage的dependency Tab

## UI设计规范
遵循.trae/rules/design_rule.md中的亮色系设计规范：
- 主题色：#3b82f6
- 表格使用斑马纹样式
- 按钮使用圆角矩形
- 间距遵循规范（小间距8px，中等间距12px/16px）
