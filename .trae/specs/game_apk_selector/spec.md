# 游戏属性编辑界面优化 - 产品需求文档

## Overview
- **Summary**: 优化游戏属性编辑界面，增加三个 APK ID 选择器，使用穿梭框进行交互，支持测试、灰度和生产环境的 APK 选择。
- **Purpose**: 解决游戏配置中 APK 选择的用户体验问题，提供更直观、高效的 APK 选择方式。
- **Target Users**: 游戏配置管理员和开发人员。

## Goals
- 增加三个 APK ID 选择器：test_apk_ids、gray_apk_ids、pro_apk_ids
- 使用穿梭框组件实现 APK 选择交互
- 集成 APK API 获取可选择的 APK 列表
- 确保数据正确保存和加载

## Non-Goals (Out of Scope)
- 不修改现有的游戏属性编辑界面其他功能
- 不增加新的 API 接口，仅使用现有的 getAllApks() 接口
- 不涉及后端数据存储逻辑的修改

## Background & Context
- 当前游戏属性编辑界面使用传统的下拉选择框进行多选
- 随着 APK 数量增加，传统选择方式效率低下
- 穿梭框提供更直观的双向选择体验，适合大量数据的选择场景

## Functional Requirements
- **FR-1**: 增加 test_apk_ids 字段的穿梭框选择器
- **FR-2**: 增加 gray_apk_ids 字段的穿梭框选择器  
- **FR-3**: 增加 pro_apk_ids 字段的穿梭框选择器
- **FR-4**: 集成 getAllApks() API 获取 APK 列表数据
- **FR-5**: 支持 APK 数据的正确加载和保存

## Non-Functional Requirements
- **NFR-1**: 穿梭框交互流畅，响应时间不超过 100ms
- **NFR-2**: 界面布局符合设计规范，保持一致性
- **NFR-3**: 支持 APK 列表的搜索和筛选

## Constraints
- **Technical**: 基于 Vue 3 框架，使用现有的 getAllApks() API
- **Business**: 保持与现有界面风格一致
- **Dependencies**: 依赖 apkApi.js 中的 getAllApks() 函数

## Assumptions
- APK API 接口返回的数据格式包含 id 和 name 字段
- 游戏数据结构需要支持新增的三个 APK ID 字段：test_apk_ids、gray_apk_ids、pro_apk_ids

## Acceptance Criteria

### AC-1: 穿梭框组件实现
- **Given**: 用户打开游戏属性编辑界面
- **When**: 查看 APK 选择区域
- **Then**: 看到三个穿梭框组件，分别对应测试、灰度和生产环境
- **Verification**: `human-judgment`

### AC-2: APK 数据加载
- **Given**: 打开游戏属性编辑界面
- **When**: 穿梭框组件初始化
- **Then**: 自动加载 APK 列表数据并显示在左侧
- **Verification**: `programmatic`

### AC-3: APK 选择功能
- **Given**: 穿梭框已加载 APK 数据
- **When**: 用户进行 APK 选择操作
- **Then**: 选中的 APK 正确显示在右侧，未选中的保留在左侧
- **Verification**: `human-judgment`

### AC-4: 数据保存功能
- **Given**: 用户选择了 APK 并点击保存
- **When**: 提交表单数据
- **Then**: 新增的三个 APK ID 字段正确保存到游戏数据中
- **Verification**: `programmatic`

### AC-5: 数据加载功能
- **Given**: 编辑已存在的游戏
- **When**: 打开游戏属性编辑界面
- **Then**: 已保存的 APK ID 正确显示在穿梭框的右侧
- **Verification**: `programmatic`

## Open Questions
- [x] APK API 返回的数据结构具体是什么样的？需要确认包含哪些字段
- [x] 游戏数据结构是否需要修改以支持新增的三个 APK ID 字段

## Data Structure Confirmation
- **APK API Response**: 假设返回格式为 `[{id: number, name: string}, ...]`
- **Game Data Structure**: 需要在游戏对象中添加三个新字段：
  - `test_apk_ids: number[]` - 测试环境 APK ID 列表
  - `gray_apk_ids: number[]` - 灰度环境 APK ID 列表
  - `pro_apk_ids: number[]` - 生产环境 APK ID 列表