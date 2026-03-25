# 统一虚拟标签页系统 - 产品需求文档

## 概述
- **Summary**: 将 Workbench.vue、GameDirectory.vue 和 Admin.vue 统一为项目内部的虚拟标签页，取消打开工作台时新开浏览器标签页的行为
- **Purpose**: 提供一致的用户体验，所有页面都在项目内部的虚拟标签页系统中管理，避免浏览器标签页过多导致的混乱
- **Target Users**: 游戏配置平台的管理员和开发者

## 目标
- 将 Workbench 页面从浏览器新标签页打开改为项目内部虚拟标签页
- 保持 GameDirectory 和 Admin 页面现有的虚拟标签页行为
- 三个页面（Admin、GameDirectory、Workbench）都作为独立的虚拟标签页存在
- 保持现有的标签页管理功能（切换、关闭等）

## 非目标（范围外）
- 不修改标签页的样式和布局
- 不影响其他页面的导航行为
- 不改变页面的功能逻辑，仅修改打开方式

## 背景与上下文
- 当前实现中，Workbench 页面通过 `window.open` 在新浏览器标签页中打开
- Admin 和 GameDirectory 页面已经在项目内部的虚拟标签页系统中
- 这导致用户在使用时需要管理两套标签页系统（浏览器标签页 + 项目虚拟标签页）
- 统一为虚拟标签页后，用户体验更加一致

## 功能需求
- **FR-1**: Workbench 页面在项目内部虚拟标签页中打开，不再新开浏览器标签页
- **FR-2**: 从 GameDirectory 页面点击编辑/查看草稿时，在当前项目的虚拟标签页系统中打开 Workbench
- **FR-3**: 新打开的 Workbench 标签页应正确显示对应的游戏配置内容
- **FR-4**: 新标签页应自动成为活跃标签
- **FR-5**: 保持现有的标签页管理功能（切换、关闭等）不变

## 非功能需求
- **NFR-1**: 标签页切换应平滑，无明显延迟
- **NFR-2**: 标签页名称应准确反映打开的配置内容
- **NFR-3**: 浏览器历史记录应正确更新，支持前进/后退操作

## 约束
- **技术**: 基于 Vue 3 框架，使用 Vue Router 进行路由管理
- **依赖**: 现有标签栏组件和路由配置

## 假设
- 用户使用现代浏览器，支持 Vue Router 的导航
- 现有标签栏组件已具备创建和管理多标签的能力

## 验收标准

### AC-1: Workbench 在虚拟标签页中打开
- **Given**: 用户在 GameDirectory 页面
- **When**: 用户点击草稿的"编辑"或"查看"按钮
- **Then**: 系统应在项目内部的虚拟标签页中打开 Workbench 页面
- **Verification**: `human-judgment`

### AC-2: 不新开浏览器标签页
- **Given**: 用户在 GameDirectory 页面
- **When**: 用户点击草稿的"编辑"或"查看"按钮
- **Then**: 不应新开浏览器标签页，Workbench 应在当前窗口的虚拟标签页中显示
- **Verification**: `human-judgment`

### AC-3: 新标签页正确显示配置内容
- **Given**: 新的 Workbench 虚拟标签页已创建
- **When**: 页面加载完成
- **Then**: 标签页应显示正确的游戏配置内容，包括游戏名称和相关设置
- **Verification**: `human-judgment`

### AC-4: 新标签页自动成为活跃标签
- **Given**: 新的 Workbench 虚拟标签页已创建
- **When**: 页面加载完成
- **Then**: 新标签页应自动成为当前活跃标签
- **Verification**: `human-judgment`

### AC-5: 现有标签页管理功能正常
- **Given**: 存在多个虚拟标签页（包括 Admin、GameDirectory、Workbench）
- **When**: 用户进行标签页切换或关闭操作
- **Then**: 标签页应正常切换或关闭
- **Verification**: `human-judgment`

### AC-6: 三个页面可共存
- **Given**: 用户已打开 Admin、GameDirectory、Workbench 三个页面
- **When**: 用户在三个标签页之间切换
- **Then**: 每个页面都应正确显示其内容，互不干扰
- **Verification**: `human-judgment`

## 未解决问题
- [x] 是否需要限制同时打开的 Workbench 标签页数量？
  - 暂不做限制，保持与现有行为一致
- [x] 如何处理相同游戏配置的重复打开？
  - 每次点击都创建新标签页，允许重复打开相同配置
