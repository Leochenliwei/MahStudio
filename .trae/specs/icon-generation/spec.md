# 图标生成系统 - 产品需求文档

## Overview
- **Summary**: 开发一个脚本系统，用于遍历项目中所有使用的图标名称，生成图标列表文件，并根据该列表在指定目录中生成对应的SVG图标文件。
- **Purpose**: 确保项目中使用的所有图标都有对应的SVG文件，避免图标缺失导致的显示问题。
- **Target Users**: 前端开发人员和项目维护人员。

## Goals
- 遍历项目中所有使用Icon组件的地方，提取图标名称。
- 生成包含所有图标名称的iconlist.md文件。
- 根据图标列表在src/assets目录中生成对应的SVG图标文件。
- 确保生成的SVG图标文件具有一致的格式和样式。

## Non-Goals (Out of Scope)
- 修改现有的Icon组件实现。
- 修改现有的sprite.svg文件。
- 处理图标颜色和样式的动态变化。
- 生成除SVG之外的其他格式图标。

## Background & Context
- 项目使用Vue 3框架开发。
- 图标通过Icon组件使用，从sprite.svg中引用。
- 目前存在图标引用与实际SVG文件不匹配的问题。
- 需要确保所有使用的图标都有对应的SVG文件。

## Functional Requirements
- **FR-1**: 开发脚本遍历项目中所有使用Icon组件的文件，提取图标名称。
- **FR-2**: 生成iconlist.md文件，包含所有提取的图标名称。
- **FR-3**: 开发脚本根据图标列表在src/assets目录中生成对应的SVG图标文件。
- **FR-4**: 确保生成的SVG图标文件使用一致的格式和样式。

## Non-Functional Requirements
- **NFR-1**: 脚本应具有良好的错误处理能力，能够处理文件读写错误。
- **NFR-2**: 脚本应具有可扩展性，便于添加新的图标处理逻辑。
- **NFR-3**: 生成的SVG文件应具有良好的性能和兼容性。

## Constraints
- **Technical**: 使用Python或Node.js开发脚本。
- **Dependencies**: 可能需要使用文件系统操作和正则表达式库。

## Assumptions
- 项目中使用的图标名称与sprite.svg中的图标ID一致。
- 生成的SVG文件将放置在src/assets/icons目录中。
- 图标样式将基于sprite.svg中的定义。

## Acceptance Criteria

### AC-1: 图标名称提取
- **Given**: 项目中存在使用Icon组件的文件。
- **When**: 运行图标提取脚本。
- **Then**: 脚本应正确提取所有图标名称，并生成iconlist.md文件。
- **Verification**: `programmatic`

### AC-2: SVG文件生成
- **Given**: 已生成iconlist.md文件。
- **When**: 运行SVG生成脚本。
- **Then**: 脚本应根据图标列表生成对应的SVG文件。
- **Verification**: `programmatic`

### AC-3: 图标文件格式一致性
- **Given**: SVG文件已生成。
- **When**: 检查生成的SVG文件。
- **Then**: 所有SVG文件应具有一致的格式和样式。
- **Verification**: `human-judgment`

## Open Questions
- [ ] 是否需要处理图标名称中的特殊字符？
- [ ] 生成的SVG文件是否需要包含特定的元数据？
- [ ] 如何处理重复的图标名称？
