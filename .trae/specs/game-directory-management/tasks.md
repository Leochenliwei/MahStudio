# 游戏目录管理任务列表

* [ ] Task 1: 重构Admin.vue游戏列表页面

  * [ ] SubTask 1.1: 修改游戏列表展示，显示游戏基本信息和文件数量统计

  * [ ] SubTask 1.2: 移除游戏列表中的"编辑"按钮

  * [ ] SubTask 1.3: 点击游戏进入目录详情页（而非直接进入工作台）

  * [ ] SubTask 1.4: 新增游戏按钮保留，创建游戏后自动创建一个默认草稿

  * [ ] SubTask 1.5: 支持test/online环境切换，通过左侧菜单带入环境参数

* [ ] Task 2: 创建游戏目录详情页 GameDirectory.vue

  * [ ] SubTask 2.1: 创建页面框架，展示游戏基本信息

  * [ ] SubTask 2.2: 实现草稿列表区域（支持多份）

  * [ ] SubTask 2.3: 实现测试约局展示区域（仅一份）

  * [ ] SubTask 2.4: 实现测试金币展示区域（仅一份）

  * [ ] SubTask 2.5: 添加新建草稿按钮

* [ ] Task 3: 实现草稿操作功能

  * [ ] SubTask 3.1: 实现草稿编辑功能 - 点击进入工作台编辑

  * [ ] SubTask 3.2: 实现草稿复制功能 - 在当前游戏创建副本

  * [ ] SubTask 3.3: 实现"复制到"弹窗 - 选择目标游戏进行复制

  * [ ] SubTask 3.4: 实现提测功能 - 选择目标（测试约局/测试金币）进行覆盖

* [ ] Task 4: 实现测试文件操作功能

  * [ ] SubTask 4.1: 实现测试文件复制功能 - 创建草稿副本

  * [ ] SubTask 4.2: 实现"复制到"弹窗 - 选择目标游戏复制为新草稿

  * [ ] SubTask 4.3: 实现发灰度按钮 - 触发灰度发布

* [ ] Task 5: 创建共用组件

  * [ ] SubTask 5.1: 创建 CopyToModal.vue - 复制到目标游戏选择弹窗

  * [ ] SubTask 5.2: 创建 SubmitTestModal.vue - 提测确认弹窗

  * [ ] SubTask 5.3: 创建 FileCard.vue - 文件卡片组件（展示文件信息）

* [ ] Task 6: 更新路由配置

  * [ ] SubTask 6.1: 添加 GameDirectory 路由

  * [ ] SubTask 6.2: 更新 Workbench 路由参数，支持从草稿/测试文件进入

* [ ] Task 7: 数据模型定义

  * [ ] SubTask 7.1: 定义游戏目录数据结构

  * [ ] SubTask 7.2: 定义文件类型枚举（Draft/TestMatch/TestGold）

  * [ ] SubTask 7.3: 定义文件元数据结构

* [ ] Task 8: 测试验证

  * [ ] SubTask 8.1: 验证游戏列表展示

  * [ ] SubTask 8.2: 验证目录详情页展示

  * [ ] SubTask 8.3: 验证草稿CRUD操作

  * [ ] SubTask 8.4: 验证测试文件操作

  * [ ] SubTask 8.5: 验证复制和提测流程

# Task Dependencies

* Task 2 依赖 Task 1

* Task 3 依赖 Task 2

* Task 4 依赖 Task 2

* Task 5 依赖 Task 3、Task 4

* Task 6 依赖 Task 2

* Task 7 无依赖

* Task 8 依赖所有前置任务

