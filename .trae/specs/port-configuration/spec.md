# 端口配置统一管理 - 产品需求文档

## Overview
- **Summary**: 将项目中的端口配置从硬编码改为使用环境文件进行统一管理，包括服务器端口和API基础URL。
- **Purpose**: 实现配置与代码分离，便于在不同环境（开发、测试、生产）中使用不同的配置，提高代码可维护性和灵活性。
- **Target Users**: 开发人员和运维人员

## Goals
- 将服务器端口配置从硬编码改为环境变量
- 将API基础URL中的端口配置从硬编码改为环境变量
- 确保在不同环境中能够使用不同的端口配置
- 提供默认值以确保系统在没有环境变量时仍能正常运行

## Non-Goals (Out of Scope)
- 不修改其他配置项
- 不改变现有的API结构和功能
- 不影响系统的正常运行

## Background & Context
目前项目中的端口配置存在以下问题：
1. 服务器端口在 `server.js` 中硬编码为 8001
2. API基础URL在 `apkApi.js` 和 `gameApi.js` 中硬编码为 `http://localhost:8001/api`
3. 当需要在不同环境中使用不同端口时，需要修改代码，容易出错且不易管理

## Functional Requirements
- **FR-1**: 服务器端口应从环境变量读取，默认值为 8001
- **FR-2**: API基础URL中的端口应从环境变量读取，默认值为 8001
- **FR-3**: 环境变量应从 `.env` 文件中加载

## Non-Functional Requirements
- **NFR-1**: 代码应保持简洁清晰，遵循现有代码风格
- **NFR-2**: 变更应向后兼容，确保在没有环境变量时系统仍能正常运行
- **NFR-3**: 应提供环境变量配置示例文件

## Constraints
- **Technical**: 项目使用 Node.js 环境，需要使用 `dotenv` 包来加载环境变量
- **Dependencies**: 需要添加 `dotenv` 依赖包

## Assumptions
- 项目使用 npm 作为包管理器
- 开发人员熟悉环境变量的配置和使用

## Acceptance Criteria

### AC-1: 服务器端口从环境变量读取
- **Given**: 项目运行环境中设置了 PORT 环境变量
- **When**: 启动服务器
- **Then**: 服务器应使用环境变量中的端口
- **Verification**: `programmatic`

### AC-2: 服务器端口使用默认值
- **Given**: 项目运行环境中未设置 PORT 环境变量
- **When**: 启动服务器
- **Then**: 服务器应使用默认端口 8001
- **Verification**: `programmatic`

### AC-3: API基础URL从环境变量读取
- **Given**: 项目运行环境中设置了 API_PORT 环境变量
- **When**: 前端代码构建或运行
- **Then**: API基础URL应使用环境变量中的端口
- **Verification**: `programmatic`

### AC-4: API基础URL使用默认值
- **Given**: 项目运行环境中未设置 API_PORT 环境变量
- **When**: 前端代码构建或运行
- **Then**: API基础URL应使用默认端口 8001
- **Verification**: `programmatic`

### AC-5: 环境变量从.env文件加载
- **Given**: 项目根目录存在 .env 文件，其中设置了 PORT 环境变量
- **When**: 启动服务器
- **Then**: 服务器应使用 .env 文件中的端口
- **Verification**: `programmatic`

## Open Questions
- [ ] 是否需要为不同环境（开发、测试、生产）创建不同的环境文件？