# 纯前端项目改造 - 产品需求文档

## Overview
- **Summary**: 将现有前后端分离的游戏配置系统改造为纯前端项目，使用 localStorage 存储用户数据，移除对后端服务的依赖。
- **Purpose**: 简化部署和使用流程，消除后端服务依赖，使项目可以独立运行在浏览器中。
- **Target Users**: 游戏配置系统的所有用户，包括开发人员、运营人员等。

## Goals
- 取消前后端分离架构
- 实现纯前端运行模式
- 使用 localStorage 作为数据持久化存储
- 保持现有功能完整性
- 提供数据迁移方案（从后端到 localStorage）

## Non-Goals (Out of Scope)
- 不涉及多用户协作功能
- 不涉及云端数据同步
- 不涉及后端服务的维护
- 不涉及数据加密

## Background & Context
当前项目是一个前后端分离的 Vue 应用，后端使用 Express + SQLite 存储数据，前后端通过 REST API 通信。为了简化部署和使用，需要将其改造为纯前端项目。

## Functional Requirements
- **FR-1**: 移除对后端服务的依赖
- **FR-2**: 将现有 API 调用替换为 localStorage 操作
- **FR-3**: 实现数据初始化（首次使用时从 mockData 初始化）
- **FR-4**: 确保所有现有功能正常工作
- **FR-5**: 提供数据清理功能

## Non-Functional Requirements
- **NFR-1**: 数据持久化可靠
- **NFR-2**: 性能不受影响
- **NFR-3**: 兼容性良好（主流浏览器）
- **NFR-4**: 代码可维护性高

## Constraints
- **Technical**: 基于 Vue 3 框架，使用浏览器 localStorage API
- **Business**: 保持现有 UI 和交互不变
- **Dependencies**: 现有 mockData.js 中的数据结构

## Assumptions
- 用户浏览器支持 localStorage
- localStorage 容量足够存储项目数据
- 用户不需要跨设备数据同步

## Acceptance Criteria

### AC-1: 项目独立运行
- **Given**: 用户打开项目
- **When**: 不启动后端服务
- **Then**: 项目能够正常加载和运行
- **Verification**: `human-judgment`

### AC-2: 数据持久化
- **Given**: 用户在系统中进行数据操作
- **When**: 刷新浏览器或重新打开项目
- **Then**: 之前操作的数据仍然存在
- **Verification**: `programmatic`

### AC-3: 初始化数据正确
- **Given**: 首次使用项目（localStorage 为空）
- **When**: 打开项目
- **Then**: 数据从 mockData 正确初始化到 localStorage
- **Verification**: `programmatic`

### AC-4: 所有功能正常
- **Given**: 项目已启动
- **When**: 用户使用所有现有功能（游戏管理、文件管理、提交历史等）
- **Then**: 功能正常工作，与改造前一致
- **Verification**: `human-judgment`

### AC-5: API 调用移除
- **Given**: 查看代码
- **When**: 检查所有 API 调用
- **Then**: 所有 gameApi.js 和 apkApi.js 中的网络请求已替换为 localStorage 操作
- **Verification**: `programmatic`

## Open Questions
- 无
