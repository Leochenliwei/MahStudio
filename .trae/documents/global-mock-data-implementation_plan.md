# 全局Mock数据实现计划

## 任务概述
将游戏数据从组件内部mock改为全局mock数据，实现数据的集中管理和共享。

## 实现步骤

### [x] 任务1：创建全局Mock数据文件
- **优先级**：P0
- **依赖**：None
- **描述**：创建 `src/data/mockData.js` 文件，包含：
  - FileType和Environment枚举定义
  - 全局mockGames数据对象
  - 数据操作工具函数（getAllGames、getGameById、getOtherGames、addNewGame、updateGame）
- **成功标准**：
  - 全局mock数据文件创建完成
  - 所有游戏数据正确定义
  - 工具函数实现完整
- **测试要求**：
  - `programmatic` TR-1.1: 导入和使用全局mock数据无错误
  - `programmatic` TR-1.2: 工具函数调用返回正确数据

### [x] 任务2：修改Admin.vue组件
- **优先级**：P0
- **依赖**：任务1
- **描述**：
  - 导入全局mock数据和工具函数
  - 使用getAllGames()初始化gameConfigs
  - 修改addNewGame函数，使用addNewGameToMock添加新游戏
  - 移除本地的mock数据定义
- **成功标准**：
  - Admin.vue使用全局mock数据
  - 游戏列表正确显示
  - 新增游戏功能正常
- **测试要求**：
  - `programmatic` TR-2.1: 游戏列表页面加载无错误
  - `human-judgement` TR-2.2: 游戏列表显示所有mock游戏数据
  - `programmatic` TR-2.3: 新增游戏功能正常工作

### [x] 任务3：修改GameDirectory.vue组件
- **优先级**：P0
- **依赖**：任务1
- **描述**：
  - 导入全局mock数据和工具函数
  - 移除本地的mock数据和FileType定义
  - 修改loadGameData函数，使用getGameById获取游戏数据
  - 修改otherGames计算属性，使用getOtherGames获取其他游戏
  - 修改createDraft函数，使用updateGame更新游戏数据
- **成功标准**：
  - GameDirectory.vue使用全局mock数据
  - 游戏文件列表正确显示
  - 新增草稿功能正常
- **测试要求**：
  - `programmatic` TR-3.1: 游戏目录页面加载无错误
  - `human-judgement` TR-3.2: 游戏文件列表显示所有文件（草稿、测试约局、测试金币）
  - `programmatic` TR-3.3: 新增草稿功能正常工作

### [x] 任务4：验证功能完整性
- **优先级**：P1
- **依赖**：任务2、任务3
- **描述**：
  - 测试从Admin页面点击游戏进入GameDirectory页面
  - 验证所有游戏的文件列表正确显示
  - 测试新增草稿功能
  - 验证环境切换功能
- **成功标准**：
  - 所有功能正常工作
  - 数据在组件间正确传递
  - 无错误或异常
- **测试要求**：
  - `human-judgement` TR-4.1: 从Admin页面点击游戏能正确进入GameDirectory页面
  - `human-judgement` TR-4.2: 游戏文件列表显示完整（包括草稿、测试约局、测试金币）
  - `programmatic` TR-4.3: 新增草稿后能在列表中正确显示

## 技术实现细节

### 全局Mock数据结构
- **文件**：`src/data/mockData.js`
- **数据模型**：
  - 游戏对象包含id、name、description、createdAt、updatedAt、files等字段
  - 文件对象包含id、type、name、content、createdAt、updatedAt等字段
  - 支持草稿（DRAFT）、测试约局（TEST_MATCH）、测试金币（TEST_GOLD）三种文件类型

### 组件数据传递
- **Admin.vue**：使用getAllGames()获取游戏列表，点击游戏时通过路由传递gameId到GameDirectory
- **GameDirectory.vue**：通过路由参数获取gameId，使用getGameById(gameId)获取游戏详情

### 数据更新机制
- **新增游戏**：使用addNewGame()函数添加到全局mock数据
- **新增草稿**：使用updateGame()函数更新游戏的files数组
- **其他操作**：通过全局工具函数操作数据，确保数据一致性

## 预期效果
- 所有游戏数据集中管理，避免数据重复
- 组件间数据传递清晰，通过全局工具函数操作数据
- 功能完整，包括游戏列表展示、游戏目录详情、新增游戏、新增草稿等
- 代码结构清晰，易于维护和扩展
