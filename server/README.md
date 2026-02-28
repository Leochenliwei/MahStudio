# SQLite持久化存储功能 - 启动说明

## 功能概述

本项目已实现SQLite数据库持久化存储功能，将原有的mock数据存储方式替换为SQLite数据库，确保游戏配置信息能够在页面刷新后依然保留。

## 数据库表结构

### 1. games表（游戏列表）
- id: 主键，自增
- unique_id: 唯一标识符
- name: 游戏名称
- description: 游戏描述
- region: 游戏区域
- collaborators: 协作人员（JSON数组）
- created_by: 创建人
- created_at: 创建时间（ISO格式）
- updated_by: 更新人
- updated_at: 更新时间（ISO格式）

### 2. game_files表（文件列表）
- id: 文件ID（主键）
- game_id: 关联的游戏ID（外键）
- type: 文件类型（draft, testMatch, testGold, officialMatch, officialGold）
- name: 文件名称
- content: 文件内容（JSON字符串）
- created_at: 创建时间（ISO格式）
- updated_at: 更新时间（ISO格式）
- updated_by: 更新人

### 3. submit_history表（提测记录）
- id: 记录ID（主键）
- game_id: 关联的游戏ID（外键）
- draft_id: 草稿ID
- target_type: 目标类型（testMatch, testGold, officialMatch, officialGold）
- created_by: 创建人
- created_at: 创建时间（ISO格式）

### 4. apk_list表（APK列表）
- id: 主键，自增
- apk_id: APK ID（唯一）
- apk_name: APK名称

## API接口

### 游戏相关
- GET /api/games - 获取所有游戏
- GET /api/games/:id - 根据ID获取游戏
- POST /api/games - 创建游戏
- PUT /api/games/:id - 更新游戏
- DELETE /api/games/:id - 删除游戏

### 游戏文件相关
- GET /api/games/:id/files - 获取游戏文件列表
- POST /api/games/:id/files - 创建游戏文件
- PUT /api/games/:id/files/:fileId - 更新游戏文件
- DELETE /api/games/:id/files/:fileId - 删除游戏文件

### 提测记录相关
- GET /api/games/:id/submit-history - 获取提测记录
- POST /api/games/:id/submit-history - 创建提测记录

### APK列表相关
- GET /api/apks - 获取APK列表

## 启动方式

### 方式一：分别启动前后端（推荐用于开发）

1. 启动后端服务：
```bash
npm run server
```
后端服务将在 http://localhost:8001 启动

2. 启动前端服务（新开一个终端）：
```bash
npm run dev
```
前端服务将在 http://localhost:5173 启动

### 方式二：同时启动前后端

使用以下命令同时启动前后端服务：
```bash
npm run dev:all
```

## 数据初始化

首次启动后端服务时，系统会自动：
1. 创建所有必要的数据库表结构
2. 从 `src/data/mockData.js` 导入游戏数据到games表
3. 从 `资料/apkid.json` 导入APK数据到apk_list表

数据库文件将保存在 `server/data/game_config.db`

## 项目结构

```
WEBconfig/
├── server/
│   ├── database.js          # 数据库初始化模块
│   ├── server.js           # 后端服务入口
│   ├── routes/
│   │   ├── games.js       # 游戏相关API路由
│   │   └── apks.js       # APK相关API路由
│   └── data/
│       └── game_config.db # SQLite数据库文件
├── src/
│   ├── api/
│   │   ├── gameApi.js     # 游戏API调用模块
│   │   └── apkApi.js     # APK API调用模块
│   └── views/
│       └── Admin.vue      # 后台管理页面（已修改为使用API）
└── package.json
```

## 注意事项

1. **端口占用**：确保8001端口未被占用，否则需要修改server.js中的PORT配置
2. **数据持久化**：所有游戏配置数据现在都保存在SQLite数据库中，刷新页面不会丢失
3. **外键约束**：删除游戏时会级联删除相关的游戏文件和提测记录
4. **错误处理**：所有API接口都包含错误处理，异常情况下会返回友好的错误信息

## 测试验证

启动服务后，可以通过以下方式验证功能：

1. 访问 http://localhost:5173 进入前端页面
2. 查看游戏列表是否正常显示（数据来自SQLite数据库）
3. 测试新增游戏功能，验证数据是否保存到数据库
4. 测试编辑游戏功能，验证数据是否更新
5. 测试删除游戏功能，验证数据是否删除
6. 刷新页面，验证数据是否依然存在（持久化验证）

## 技术栈

- **后端**：Express.js
- **数据库**：SQLite (better-sqlite3)
- **前端**：Vue 3
- **API通信**：Fetch API
