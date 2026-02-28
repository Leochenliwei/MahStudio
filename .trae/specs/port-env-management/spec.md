# 端口配置统一管理到.env文件 - 产品需求文档

## Overview
- **Summary**: 将服务器端口和API端口配置统一管理到.env文件中，实现配置的集中化和可维护性。
- **Purpose**: 解决端口配置分散在多个文件中导致的维护困难问题，提高配置的一致性和可管理性。
- **Target Users**: 开发人员和部署人员。

## Goals
- 将服务器端口配置统一到.env文件中
- 将前端API基础URL中的端口配置统一到.env文件中
- 确保配置变更时能够统一更新，避免遗漏

## Non-Goals (Out of Scope)
- 修改现有的端口值
- 变更其他配置项
- 重构API调用方式

## Background & Context
- 当前服务器端口配置在server.js中通过`process.env.PORT || 8001`读取
- 前端API基础URL在apkApi.js和gameApi.js中硬编码为`http://localhost:8001/api`
- .env文件已经存在，包含了PORT和API_PORT配置
- package.json中已经安装了dotenv依赖

## Functional Requirements
- **FR-1**: 服务器端口配置从.env文件读取
- **FR-2**: 前端API基础URL中的端口从环境变量读取
- **FR-3**: 确保配置变更时所有相关文件能够统一更新

## Non-Functional Requirements
- **NFR-1**: 配置管理的可维护性 - 所有端口配置集中在一个文件中
- **NFR-2**: 兼容性 - 保持现有功能不变，仅修改配置方式
- **NFR-3**: 可扩展性 - 便于未来添加新的配置项

## Constraints
- **Technical**: 使用现有的dotenv库和.env文件结构
- **Dependencies**: 依赖dotenv库来加载环境变量

## Assumptions
- .env文件已经存在且包含必要的端口配置
- dotenv库已经安装在项目中
- 现有的端口值(8001)保持不变

## Acceptance Criteria

### AC-1: 服务器端口从.env文件读取
- **Given**: .env文件中配置了PORT=8001
- **When**: 启动服务器
- **Then**: 服务器在端口8001上运行
- **Verification**: `programmatic`
- **Notes**: 服务器启动时应输出端口信息

### AC-2: 前端API基础URL使用环境变量
- **Given**: .env文件中配置了API_PORT=8001
- **When**: 前端调用API
- **Then**: API请求发送到正确的端口
- **Verification**: `programmatic`
- **Notes**: 确保所有API调用都使用正确的端口

### AC-3: 配置变更时统一更新
- **Given**: 修改.env文件中的端口配置
- **When**: 重启服务器和前端
- **Then**: 所有组件都使用新的端口配置
- **Verification**: `programmatic`
- **Notes**: 验证服务器和前端都使用新的端口

## Open Questions
- [ ] 前端如何在开发环境中读取.env文件的配置？