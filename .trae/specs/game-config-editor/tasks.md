# Tasks

## Phase 1: 基础组件

- [ ] Task 1.1: 创建 MahjongTile.vue 麻将牌展示组件
  - 支持显示麻将牌面（万/筒/条）
  - 支持不同花色不同颜色
  - 支持暗色模式

- [ ] Task 1.2: 创建 RoomTypeSwitcher.vue 房间类型切换组件
  - 支持金币场/私人房单选切换
  - 样式符合design_rule.md规范

- [ ] Task 1.3: 创建 FanTypeCard.vue 番型卡片组件
  - 显示番型名称和简要信息
  - 支持选中状态

## Phase 2: 配置面板组件

- [ ] Task 2.1: 创建 GoldRoomConfig.vue 金币场配置面板
  - 底分配置
  - 人数选项
  - 玩法标签

- [ ] Task 2.2: 创建 PrivateRoomConfig.vue 私人房配置面板
  - 局数选项
  - 人数选项
  - 玩法标签

- [ ] Task 2.3: 创建 FanTypeList.vue 番型列表组件
  - 搜索框
  - 筛选下拉
  - 番型卡片列表

- [ ] Task 2.4: 创建 FanTypeEditor.vue 番型编辑面板组件
  - 配置名称输入
  - 游戏内名字输入
  - 描述文本框
  - 显示规则下拉+复选框
  - 价值Radio+数值输入
  - 符号下拉+单位输入
  - 参考牌组展示

## Phase 3: 主组件集成

- [ ] Task 3.1: 创建 GameConfigEditor.vue 主弹窗组件
  - 顶部栏：标题+房间类型切换
  - 左侧边栏：房间类型配置（金币场/私人房）
  - 右侧内容区：番型列表+番型编辑
  - 底部栏：提示文字+关闭按钮
  - 支持暗色模式

## Phase 4: 收尾

- [ ] Task 4.1: 更新 component_rules.md 添加组件关系
- [ ] Task 4.2: 集成到页面并测试

# Task Dependencies
- Task 2.3 依赖 Task 1.1, Task 1.3
- Task 2.4 依赖 Task 1.1
- Task 3.1 依赖 Task 1.2, Task 2.1, Task 2.2, Task 2.3, Task 2.4
- Task 4.1 依赖 Task 3.1
- Task 4.2 依赖 Task 4.1
