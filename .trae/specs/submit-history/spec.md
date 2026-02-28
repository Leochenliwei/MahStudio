# 提测记录功能 - 产品需求文档

## Overview
- **Summary**: 为测试金币和测试约局配置添加提测记录功能，允许查看提测的草稿ID、操作时间、操作人，并以时间倒序显示。
- **Purpose**: 提供提测历史记录，方便用户追踪配置变更历史，了解每次提测的具体信息。
- **Target Users**: 游戏配置管理员和开发人员。

## Goals
- 为测试金币和测试约局配置添加提测记录功能
- 记录提测的草稿ID、操作时间、操作人信息
- 以时间倒序显示提测记录
- 提供提测记录查看界面

## Non-Goals (Out of Scope)
- 提测记录的编辑和删除功能
- 提测记录的导出功能
- 提测记录的搜索和筛选功能

## Background & Context
- 当前提测操作只是简单的 alert 提示，没有记录提测历史
- 缺少提测历史记录会导致无法追踪配置变更的来源和时间
- 提测记录对于版本管理和问题排查非常重要

## Functional Requirements
- **FR-1**: 为每个游戏添加提测历史记录存储
- **FR-2**: 提测操作时记录草稿ID、操作时间、操作人信息
- **FR-3**: 为测试金币和测试约局配置添加查看提测记录的按钮
- **FR-4**: 显示提测记录弹窗，以时间倒序展示提测历史
- **FR-5**: 提测记录中显示草稿ID、操作时间、操作人信息

## Non-Functional Requirements
- **NFR-1**: 提测记录功能不应影响现有提测流程
- **NFR-2**: 提测记录弹窗应具有良好的用户体验
- **NFR-3**: 提测记录的显示应响应式，适配不同屏幕尺寸

## Constraints
- **Technical**: 基于现有的Vue 3框架和mockData数据结构
- **Dependencies**: 依赖现有的FileCard组件和提测功能

## Assumptions
- 提测记录存储在游戏对象的submitHistory数组中
- 操作人信息使用当前登录用户（这里使用固定的'admin'）
- 提测记录以时间倒序显示，最新的记录在最前面

## Acceptance Criteria

### AC-1: 提测记录存储
- **Given**: 执行提测操作
- **When**: 提测成功完成
- **Then**: 提测记录应被存储在游戏的submitHistory数组中
- **Verification**: `programmatic`

### AC-2: 提测记录查看按钮
- **Given**: 测试金币或测试约局配置存在
- **When**: 查看文件卡片
- **Then**: 应显示查看提测记录的按钮
- **Verification**: `human-judgment`

### AC-3: 提测记录弹窗
- **Given**: 点击查看提测记录按钮
- **When**: 弹窗打开
- **Then**: 应显示提测历史记录，以时间倒序排列
- **Verification**: `human-judgment`

### AC-4: 提测记录内容
- **Given**: 提测记录弹窗打开
- **When**: 查看提测记录
- **Then**: 每条记录应显示草稿ID、操作时间、操作人信息
- **Verification**: `human-judgment`

## Open Questions
- [ ] 是否需要为提测记录添加分页功能？
- [ ] 是否需要在提测记录中显示更多信息，如提测备注？