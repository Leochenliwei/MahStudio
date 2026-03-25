# Workbench 顶部 Tab 栏扩展 Spec

## Why
当前 Workbench.vue 页面只包含规则配置工作台，但用户需要在一个统一的界面中管理创房选项和选项联动。通过在顶部操作栏下方添加第二行 Tab 栏，可以让用户在同一页面内快速切换不同的配置模块，提升操作效率和用户体验。

## What Changes
- 在 Workbench.vue 顶部操作栏下方新增第二行 Tab 栏
- Tab 栏包含三个选项卡：
  1. **规则配置**：显示当前工作台画布区（组件列表、画布、属性面板）
  2. **创房选项**：嵌入 RoomCreatorPage.vue 的面板选项配置界面
  3. **选项联动**：嵌入 SimpleDependencyPage.vue 的简版选项联动界面
- 默认选中"规则配置"Tab
- Tab 切换时保持页面状态

## Impact
- Affected files: `/Users/zonst/Documents/Programs/WEBconfig/src/views/Workbench.vue`
- Affected components: 
  - 复用 RoomCreatorPage.vue（嵌入模式）
  - 复用 SimpleDependencyPage.vue（嵌入模式）
- 样式调整：需要遵循 design_rule.md 中的亮色系规范

## ADDED Requirements

### Requirement: 第二行 Tab 栏
The system SHALL provide a secondary tab bar below the top action bar in Workbench.vue with the following features:

#### Scenario: Tab 栏显示
- **GIVEN** 用户进入规则配置工作台页面
- **WHEN** 页面加载完成
- **THEN** 顶部操作栏下方显示 Tab 栏，包含三个选项：规则配置、创房选项、选项联动

#### Scenario: 默认选中状态
- **GIVEN** Tab 栏已显示
- **THEN** 默认选中"规则配置"Tab
- **AND** 显示对应的规则配置工作台内容

#### Scenario: Tab 切换 - 规则配置
- **GIVEN** Tab 栏已显示
- **WHEN** 用户点击"规则配置"Tab
- **THEN** 显示规则配置工作台内容（左侧组件列表、中间画布、右侧属性面板）

#### Scenario: Tab 切换 - 创房选项
- **GIVEN** Tab 栏已显示
- **WHEN** 用户点击"创房选项"Tab
- **THEN** 嵌入显示 RoomCreatorPage.vue 的面板选项配置界面
- **AND** 保持与独立页面相同的功能和操作体验

#### Scenario: Tab 切换 - 选项联动
- **GIVEN** Tab 栏已显示
- **WHEN** 用户点击"选项联动"Tab
- **THEN** 嵌入显示 SimpleDependencyPage.vue 的简版选项联动界面
- **AND** 使用 embedded 模式，不显示页面头部导航

#### Scenario: Tab 样式
- **GIVEN** Tab 栏已显示
- **THEN** 选中的 Tab 显示高亮样式（主题色底部边框）
- **AND** 未选中的 Tab 显示默认样式
- **AND** Tab 切换有平滑过渡动画

## MODIFIED Requirements

### Requirement: Workbench.vue 布局调整
- 在顶部操作栏（top-action-bar）下方添加 Tab 栏容器
- 主体内容区域根据当前选中的 Tab 动态显示不同内容
- 保持原有的三栏布局在"规则配置"Tab 下正常工作

## UI 设计规范

### Tab 栏容器样式
- 高度：48px
- 背景色：#ffffff（白色）
- 边框：底部 1px solid #e5e7eb
- 内边距：0 24px
- 与顶部操作栏紧密衔接

### Tab 项样式
- 高度：100%
- 内边距：0 16px
- 字体大小：14px
- 字体粗细：500
- 颜色：
  - 默认：#6b7280
  - Hover：#3b82f6
  - 选中：#3b82f6
- 选中指示器：
  - 位置：底部
  - 高度：2px
  - 颜色：#3b82f6
  - 圆角：顶部 2px

### Tab 内容区域
- 占据剩余高度
- 根据选中 Tab 动态切换内容
- 切换动画：0.3s ease

## Technical Notes

### RoomCreatorPage 嵌入模式
- RoomCreatorPage.vue 已支持 embedded 模式
- 通过设置 `:embedded="true"` 隐藏页面头部导航
- 通过 `gameId` prop 传递游戏ID

### SimpleDependencyPage 嵌入模式
- SimpleDependencyPage.vue 已支持 embedded 模式
- 通过设置 `:embedded="true"` 隐藏页面头部
- 通过 `formSchema` prop 传递表单结构
- 通过 `gameId` prop 传递游戏ID
