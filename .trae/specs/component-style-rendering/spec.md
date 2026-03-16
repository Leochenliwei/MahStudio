# GroupManager 元件样式渲染 Spec

## Why
GroupManager.vue 目前对所有类型的元件都使用相同的 radio-option 样式渲染，无法区分展示单选、复选、下拉列表、下拉&开关四种元件类型的实际外观。需要根据元件类型正确渲染对应的样式。

## What Changes
- 在 GroupManager.vue 中增加元件类型判定逻辑
- 为4种元件类型（radio、checkbox、select、select-switch）分别实现对应的预览样式
- 单选(radio)：圆形单选框 + 选项文本 + 分值/图标
- 复选(checkbox)：方形复选框 + 选项文本
- 下拉列表(select)：下拉框样式展示
- 下拉&开关(select-switch)：下拉框 + 开关组合样式

## Impact
- Affected specs: 无
- Affected code: /Users/zonst/Documents/Programs/WEBconfig/src/components/GroupManager.vue

## ADDED Requirements

### Requirement: 元件类型判定与样式渲染
The system SHALL 根据 component.type 的值渲染对应的元件预览样式

#### Scenario: 单选类型(radio)渲染
- **GIVEN** 元件类型为 "radio"
- **WHEN** 渲染元件预览
- **THEN** 显示圆形单选框 + 选项文本 + 默认标记

#### Scenario: 复选类型(checkbox)渲染
- **GIVEN** 元件类型为 "checkbox"
- **WHEN** 渲染元件预览
- **THEN** 显示方形复选框 + 选项文本

#### Scenario: 下拉列表(select)渲染
- **GIVEN** 元件类型为 "select"
- **WHEN** 渲染元件预览
- **THEN** 显示下拉框样式（带下拉箭头）

#### Scenario: 下拉&开关(select-switch)渲染
- **GIVEN** 元件类型为 "select-switch"
- **WHEN** 渲染元件预览
- **THEN** 显示下拉框 + 开关组合样式

## MODIFIED Requirements
无

## REMOVED Requirements
无
