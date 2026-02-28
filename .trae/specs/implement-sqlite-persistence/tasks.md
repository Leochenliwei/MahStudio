# Tasks

- [x] Task 1: 安装项目依赖
  - [x] SubTask 1.1: 安装Express.js后端框架
  - [x] SubTask 1.2: 安装SQLite数据库驱动（better-sqlite3）
  - [x] SubTask 1.3: 安装cors中间件（处理跨域请求）
  - [x] SubTask 1.4: 安装body-parser中间件（解析请求体）

- [x] Task 2: 创建数据库初始化模块
  - [x] SubTask 2.1: 创建database.js模块，实现数据库连接和初始化
  - [x] SubTask 2.2: 创建games表（游戏列表）
  - [x] SubTask 2.3: 创建game_files表（文件列表）
  - [x] SubTask 2.4: 创建submit_history表（提测记录）
  - [x] SubTask 2.5: 创建apk_list表（APK列表）
  - [x] SubTask 2.6: 实现数据导入功能，从mockData.js导入games数据
  - [x] SubTask 2.7: 实现数据导入功能，从apkid.json导入apk_list数据

- [x] Task 3: 创建后端API服务
  - [x] SubTask 3.1: 创建server.js入口文件，启动Express服务
  - [x] SubTask 3.2: 创建API路由模块（routes/games.js）
  - [x] SubTask 3.3: 实现GET /api/games接口（获取所有游戏）
  - [x] SubTask 3.4: 实现GET /api/games/:id接口（根据ID获取游戏）
  - [x] SubTask 3.5: 实现POST /api/games接口（创建游戏）
  - [x] SubTask 3.6: 实现PUT /api/games/:id接口（更新游戏）
  - [x] SubTask 3.7: 实现DELETE /api/games/:id接口（删除游戏）
  - [x] SubTask 3.8: 实现GET /api/games/:id/files接口（获取游戏文件列表）
  - [x] SubTask 3.9: 实现POST /api/games/:id/files接口（创建游戏文件）
  - [x] SubTask 3.10: 实现PUT /api/games/:id/files/:fileId接口（更新游戏文件）
  - [x] SubTask 3.11: 实现DELETE /api/games/:id/files/:fileId接口（删除游戏文件）
  - [x] SubTask 3.12: 实现GET /api/games/:id/submit-history接口（获取提测记录）
  - [x] SubTask 3.13: 实现POST /api/games/:id/submit-history接口（创建提测记录）
  - [x] SubTask 3.14: 创建API路由模块（routes/apks.js）
  - [x] SubTask 3.15: 实现GET /api/apks接口（获取APK列表）

- [x] Task 4: 创建前端API调用模块
  - [x] SubTask 4.1: 创建src/api/gameApi.js模块
  - [x] SubTask 4.2: 封装getAllGames()方法（调用GET /api/games）
  - [x] SubTask 4.3: 封装getGameById()方法（调用GET /api/games/:id）
  - [x] SubTask 4.4: 封装createGame()方法（调用POST /api/games）
  - [x] SubTask 4.5: 封装updateGame()方法（调用PUT /api/games/:id）
  - [x] SubTask 4.6: 封装deleteGame()方法（调用DELETE /api/games/:id）
  - [x] SubTask 4.7: 封装getGameFiles()方法（调用GET /api/games/:id/files）
  - [x] SubTask 4.8: 封装createGameFile()方法（调用POST /api/games/:id/files）
  - [x] SubTask 4.9: 封装updateGameFile()方法（调用PUT /api/games/:id/files/:fileId）
  - [x] SubTask 4.10: 封装deleteGameFile()方法（调用DELETE /api/games/:id/files/:fileId）
  - [x] SubTask 4.11: 封装getSubmitHistory()方法（调用GET /api/games/:id/submit-history）
  - [x] SubTask 4.12: 封装createSubmitHistory()方法（调用POST /api/games/:id/submit-history）
  - [x] SubTask 4.13: 创建src/api/apkApi.js模块
  - [x] SubTask 4.14: 封装getAllApks()方法（调用GET /api/apks）

- [x] Task 5: 修改Admin.vue使用API
  - [x] SubTask 5.1: 导入gameApi模块，替换mockData导入
  - [x] SubTask 5.2: 修改gameConfigs初始化，使用gameApi.getAllGames()
  - [x] SubTask 5.3: 修改addNewGame()方法，使用gameApi.createGame()
  - [x] SubTask 5.4: 修改saveGameEdit()方法，使用gameApi.updateGame()
  - [x] SubTask 5.5: 修改deleteGame()方法，使用gameApi.deleteGame()

- [x] Task 6: 配置项目启动脚本
  - [x] SubTask 6.1: 修改package.json，添加后端服务启动脚本
  - [x] SubTask 6.2: 修改package.json，添加数据库初始化脚本
  - [x] SubTask 6.3: 创建启动说明文档

- [x] Task 7: 测试验证
  - [x] SubTask 7.1: 启动后端服务，验证数据库连接成功
  - [x] SubTask 7.2: 验证数据导入成功，检查数据库中的数据
  - [x] SubTask 7.3: 测试前端页面，验证游戏列表展示
  - [x] SubTask 7.4: 测试新增游戏功能，验证数据持久化
  - [x] SubTask 7.5: 测试编辑游戏功能，验证数据更新
  - [x] SubTask 7.6: 测试删除游戏功能，验证数据删除
  - [x] SubTask 7.7: 刷新页面，验证数据持久化成功

# Task Dependencies
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 2]
- [Task 4] depends on [Task 3]
- [Task 5] depends on [Task 4]
- [Task 6] depends on [Task 3]
- [Task 7] depends on [Task 5, Task 6]
