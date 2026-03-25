# 游戏配置编辑器弹窗 Spec

## Why
需要创建一个Vue弹窗组件，还原游戏表现.html中的配置编辑器界面，实现番型（如清一色）的配置管理功能。

## What Changes
- 新增 `GameConfigEditor.vue` 主弹窗组件
- 新增 `RoomTypeSwitcher.vue` 房间类型切换组件
- 新增 `FanTypeList.vue` 番型列表组件
- 新增 `FanTypeEditor.vue` 番型编辑面板组件
- 新增 `MahjongTile.vue` 麻将牌展示组件

## Impact
- Affected specs: 新增配置编辑器功能
- Affected code: `src/components/editors/` 目录

## ADDED Requirements

### Requirement: 游戏配置编辑器弹窗
系统 SHALL 提供一个95vw × 90vh的弹窗，用于配置游戏中各种番型的表现设置。

#### Scenario: 打开配置编辑器
- **WHEN** 用户打开配置编辑器弹窗
- **THEN** 显示配置编辑器界面，包含房间类型切换、番型列表、番型编辑面板

### Requirement: 房间类型切换
系统 SHALL 提供金币场/私人房两种房间类型的切换功能。

#### Scenario: 切换房间类型
- **WHEN** 用户点击房间类型选项
- **THEN** 界面切换到对应房间类型的配置面板

### Requirement: 番型列表展示
系统 SHALL 提供番型列表展示功能，支持搜索和筛选。

#### Scenario: 搜索番型
- **WHEN** 用户在搜索框输入关键词
- **THEN** 列表实时过滤显示匹配的番型

### Requirement: 番型编辑
系统 SHALL 提供番型详情编辑功能，包括配置名称、游戏内名字、描述、显示规则、价值、符号/单位等字段。

#### Scenario: 编辑番型
- **WHEN** 用户在编辑面板修改番型信息
- **THEN** 实时更新番型数据

### Requirement: 麻将牌组展示
系统 SHALL 提供参考牌组展示功能，以可视化方式显示麻将牌。

#### Scenario: 查看参考牌组
- **WHEN** 用户查看番型的参考牌组
- **THEN** 以麻将牌形式展示牌组

## MODIFIED Requirements
无

## REMOVED Requirements
无
