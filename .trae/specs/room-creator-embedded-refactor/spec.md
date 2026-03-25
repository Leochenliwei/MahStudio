# RoomCreator 页面内嵌重构规格

## Why
当前 RoomCreatorPage 和 SimpleDependencyPage 作为独立页面存在，用户需要在两个页面间切换，体验不流畅。同时 SimpleDependencyPage 已经通过嵌入模式被 RoomCreatorPage 引用，但存在页面超宽、右侧内容被遮挡的问题。需要统一这两个页面为内嵌的次级tab，提供更流畅的用户体验。

## What Changes
- 创建 ItemManagerPage 组件，整合 BasicParams 和 GroupManager
- RoomCreatorPage 重构为容器页面，通过 Tab 调用 ItemManagerPage 和 SimpleDependencyPage
- 抽屉组件（BasicParamsDrawer、Drawer）统一在容器页面（RoomCreatorPage）中管理
- SimpleDependencyPage 完全内嵌到容器中，不再作为独立页面访问
- 修复嵌入模式下的布局问题，确保页面宽度正常、内容不被遮挡
- 统一两个页面的头部样式和内嵌样式

## Impact
- Affected specs: tab-navigation, unified-virtual-tabs
- Affected code:
  - `src/views/RoomCreatorPage.vue` - 主容器，管理状态和抽屉组件
  - `src/views/ItemManagerPage.vue` - 新组件，整合 BasicParams 和 GroupManager
  - `src/views/SimpleDependencyPage.vue` - 纯内嵌组件，移除独立页面特性
  - `src/components/BasicParams.vue` - 创房基础参数组件
  - `src/components/GroupManager.vue` - 分组管理组件
  - `src/components/BasicParamsDrawer.vue` - 抽屉组件（保留在容器中）
  - `src/components/Drawer.vue` - 抽屉组件（保留在容器中）

## 架构设计

### 重构后结构

```
RoomCreatorPage.vue (容器页面 - 状态管理中心)
├── page-header (顶部导航栏)
├── internal-tab-bar (内部Tab栏)
│   ├── Tab1: 面板选项 → ItemManagerPage
│   └── Tab2: 选项联动列表 → SimpleDependencyPage
├── main-content (主内容区，根据Tab切换)
├── BasicParamsDrawer (抽屉)
├── Drawer (抽屉)
├── AddGroupModal (弹窗)
└── EditorDialogContainer (编辑器容器)

ItemManagerPage.vue (UI展示层)
├── BasicParams
└── GroupManager
```

### 数据流设计

```
RoomCreatorPage (状态管理)
├── roomConfig (状态数据)
├── 提供 provide('roomConfig', roomConfig)
├── 提供抽屉控制方法
└── 管理保存逻辑

ItemManagerPage (UI展示)
├── 接收 props.basicConfig, props.groups
├── 接收 emit 事件
└── 不直接管理状态

SimpleDependencyPage (UI展示)
├── 接收 props.formSchema (= props.groups)
├── 接收 props.gameId
└── 不直接管理状态
```

## ADDED Requirements

### Requirement: ItemManagerPage 组件
ItemManagerPage 应整合 BasicParams 和 GroupManager，作为独立组件被 RoomCreatorPage 调用

#### Scenario: 组件挂载
- **WHEN** ItemManagerPage 被 RoomCreatorPage 以 embedded=true 调用
- **THEN** 组件正常显示 BasicParams 和 GroupManager

#### Scenario: 基础参数更新
- **WHEN** 用户在 BasicParams 中修改人数/局数/底分
- **THEN** 触发 emit 事件通知 RoomCreatorPage 更新 roomConfig.basic

#### Scenario: 分组操作
- **WHEN** 用户在 GroupManager 中添加/编辑/删除分组
- **THEN** 触发 emit 事件通知 RoomCreatorPage 更新 roomConfig.groups

### Requirement: 次级Tab导航系统
RoomCreatorPage 应提供面板选项和选项联动列表两个次级Tab，通过Tab切换显示不同内容

#### Scenario: 切换到选项联动列表
- **WHEN** 用户点击"选项联动列表"Tab
- **THEN** 主内容区显示 SimpleDependencyPage 内嵌版本，隐藏 ItemManagerPage

#### Scenario: 切换回面板选项
- **WHEN** 用户点击"面板选项"Tab
- **THEN** 主内容区显示 ItemManagerPage，隐藏 SimpleDependencyPage

### Requirement: 内嵌模式布局
SimpleDependencyPage 在嵌入模式下应正确填充可用空间，不出现滚动或遮挡

#### Scenario: 嵌入模式全屏显示
- **WHEN** SimpleDependencyPage 以 embedded=true 模式显示
- **THEN** 页面宽度100%，高度自适应容器，内容完全可见无遮挡

### Requirement: 抽屉组件管理
抽屉组件（BasicParamsDrawer、Drawer）统一在 RoomCreatorPage 容器中管理

#### Scenario: 打开基础参数抽屉
- **WHEN** ItemManagerPage 触发 open-drawer 事件（drawerId='basic-params'）
- **THEN** RoomCreatorPage 控制 BasicParamsDrawer 显示

#### Scenario: 打开组件属性抽屉
- **WHEN** ItemManagerPage 触发 open-drawer 事件（drawerId='drawer-props'）
- **THEN** RoomCreatorPage 控制 Drawer 显示

## MODIFIED Requirements

### Requirement: RoomCreatorPage 布局结构
RoomCreatorPage 页面结构调整为：
1. 顶部导航栏（非嵌入模式）：返回按钮 + 标题 + 保存按钮
2. 内部Tab栏：面板选项 | 选项联动列表
3. 主内容区：根据Tab显示 ItemManagerPage 或 SimpleDependencyPage
4. 抽屉和弹窗：统一在容器中管理

### Requirement: SimpleDependencyPage 嵌入模式
SimpleDependencyPage 移除独立的 page-header，在嵌入模式下只保留必要的工具栏（新增规则按钮）和表格内容区

## REMOVED Requirements

### Requirement: SimpleDependencyPage 独立访问
**Reason**: SimpleDependencyPage 将完全内嵌到 RoomCreatorPage，不再需要独立访问路径
**Migration**: 所有对 SimpleDependencyPage 的路由访问将跳转到 RoomCreatorPage

### Requirement: SimpleDependencyPage 的返回按钮
**Reason**: 嵌入模式下不需要返回功能，由父容器统一处理
**Migration**: 移除 embedded 模式下的返回按钮显示

## Breaking Changes

- **ItemManagerPage 为新增组件**：需要创建新文件
- **SimpleDependencyPage 移除独立访问**：如果项目中有直接指向 SimpleDependencyPage 的路由，需要修改
- **抽屉控制逻辑变更**：抽屉的显示/隐藏由 RoomCreatorPage 统一控制，ItemManagerPage 通过 emit 事件触发
