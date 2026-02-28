# SQLite持久化存储功能规范

## Why
当前项目使用mock数据存储游戏配置信息，数据仅存在于内存中，刷新页面后数据会丢失。为了实现数据的持久化存储，需要引入SQLite数据库作为本地数据存储方案，确保游戏配置信息能够在页面刷新后依然保留。

## What Changes
- 在本地启动SQLite数据库服务
- 设计并创建游戏配置相关的数据库表结构
- 将apkid.json中的mock数据导入SQLite数据库
- 创建后端API接口与SQLite数据库交互
- 修改前端代码，从mock数据切换为API调用
- 实现数据的CRUD（创建、读取、更新、删除）操作

## Impact
- Affected specs: 数据持久化、游戏配置管理
- Affected code: Admin.vue、mockData.js、新增数据库服务层

## ADDED Requirements

### Requirement: SQLite数据库初始化
系统 SHALL 在本地启动SQLite数据库服务，并自动创建必要的表结构。

#### Scenario: 数据库启动成功
- **WHEN** 系统启动时
- **THEN** SQLite数据库服务正常运行，所有表结构创建成功

#### Scenario: 数据导入成功
- **WHEN** 首次运行系统时
- **THEN** apkid.json中的所有数据自动导入到SQLite数据库

### Requirement: 游戏配置表结构设计
系统 SHALL 提供符合apkid.json数据结构的游戏配置表。

#### Scenario: 表结构创建成功
- **WHEN** 数据库初始化时
- **THEN** 创建game_configs表，包含id、apk_id、apk_name_en、apk_name_cn等所有必要字段

### Requirement: 后端API接口
系统 SHALL 提供RESTful API接口与SQLite数据库交互。

#### Scenario: 获取游戏列表成功
- **WHEN** 前端调用GET /api/games接口
- **THEN** 返回所有游戏配置的JSON数据

#### Scenario: 创建游戏成功
- **WHEN** 前端调用POST /api/games接口，传递游戏数据
- **THEN** 数据库中新增一条游戏配置记录，返回新创建的游戏ID

#### Scenario: 更新游戏成功
- **WHEN** 前端调用PUT /api/games/:id接口，传递更新数据
- **THEN** 数据库中对应游戏配置被更新，返回更新后的数据

#### Scenario: 删除游戏成功
- **WHEN** 前端调用DELETE /api/games/:id接口
- **THEN** 数据库中对应游戏配置被删除，返回成功状态

### Requirement: 前端数据交互
系统 SHALL 修改前端代码，从mock数据切换为API调用。

#### Scenario: 游戏列表展示
- **WHEN** 用户访问Admin页面
- **THEN** 页面从API获取游戏列表并展示，数据来自SQLite数据库

#### Scenario: 新增游戏
- **WHEN** 用户在Admin页面点击"新增游戏"并提交
- **THEN** 调用API创建游戏，数据库中保存新游戏数据

#### Scenario: 编辑游戏
- **WHEN** 用户在Admin页面编辑游戏并保存
- **THEN** 调用API更新游戏，数据库中更新对应游戏数据

#### Scenario: 删除游戏
- **WHEN** 用户在Admin页面删除游戏
- **THEN** 调用API删除游戏，数据库中移除对应游戏数据

## MODIFIED Requirements

### Requirement: Admin.vue数据源
原有的mock数据源 SHALL 替换为API调用。

**修改前**: 从`mockData.js`导入getAllGames()函数获取游戏列表
**修改后**: 通过API调用`/api/games`获取游戏列表

### Requirement: 游戏配置CRUD操作
原有的游戏配置CRUD操作 SHALL 通过API与SQLite数据库交互。

**修改前**: 所有操作直接修改内存中的mock数据
**修改后**: 所有操作通过API调用，数据持久化到SQLite数据库

## REMOVED Requirements

### Requirement: Mock数据存储
**Reason**: 引入SQLite数据库后，不再需要mock数据存储方式
**Migration**: 将mockData.js中的数据迁移到SQLite数据库，保留mockData.js作为备份或删除

## 技术实现方案

### 数据库选择
- 使用SQLite作为本地数据库
- 使用`better-sqlite3`或`sqlite3`作为Node.js驱动

### 后端服务
- 创建Express.js后端服务
- 提供RESTful API接口
- 实现与SQLite数据库的交互

### 数据库表结构设计

#### games表（游戏列表）
```sql
CREATE TABLE games (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  unique_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  region TEXT,
  collaborators TEXT, -- JSON字符串数组
  created_by TEXT,
  created_at TEXT NOT NULL, -- ISO格式时间字符串
  updated_by TEXT,
  updated_at TEXT NOT NULL -- ISO格式时间字符串
);
```

#### game_files表（文件列表）
```sql
CREATE TABLE game_files (
  id TEXT PRIMARY KEY,
  game_id INTEGER NOT NULL,
  type TEXT NOT NULL, -- draft, testMatch, testGold, officialMatch, officialGold
  name TEXT NOT NULL,
  content TEXT, -- JSON字符串
  created_at TEXT NOT NULL, -- ISO格式时间字符串
  updated_at TEXT NOT NULL, -- ISO格式时间字符串
  updated_by TEXT,
  FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE
);
```

#### submit_history表（提测记录）
```sql
CREATE TABLE submit_history (
  id TEXT PRIMARY KEY,
  game_id INTEGER NOT NULL,
  draft_id TEXT NOT NULL,
  target_type TEXT NOT NULL, -- testMatch, testGold, officialMatch, officialGold
  created_by TEXT,
  created_at TEXT NOT NULL, -- ISO格式时间字符串
  FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE
);
```

#### apk_list表（APK列表）
```sql
CREATE TABLE apk_list (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  apk_id INTEGER NOT NULL UNIQUE,
  apk_name TEXT NOT NULL
);
```

### API接口设计

#### 获取所有游戏
- **Method**: GET
- **Path**: /api/games
- **Response**: 游戏配置数组（包含files和submitHistory）

#### 根据ID获取游戏
- **Method**: GET
- **Path**: /api/games/:id
- **Response**: 单个游戏配置对象（包含files和submitHistory）

#### 创建游戏
- **Method**: POST
- **Path**: /api/games
- **Body**: 游戏配置对象（name, description等）
- **Response**: 创建的游戏对象（包含ID和uniqueId）

#### 更新游戏
- **Method**: PUT
- **Path**: /api/games/:id
- **Body**: 游戏配置对象
- **Response**: 更新后的游戏对象

#### 删除游戏
- **Method**: DELETE
- **Path**: /api/games/:id
- **Response**: 成功状态

#### 获取游戏文件列表
- **Method**: GET
- **Path**: /api/games/:id/files
- **Response**: 游戏文件数组

#### 创建游戏文件
- **Method**: POST
- **Path**: /api/games/:id/files
- **Body**: 文件对象（type, name, content等）
- **Response**: 创建的文件对象

#### 更新游戏文件
- **Method**: PUT
- **Path**: /api/games/:id/files/:fileId
- **Body**: 文件对象
- **Response**: 更新后的文件对象

#### 删除游戏文件
- **Method**: DELETE
- **Path**: /api/games/:id/files/:fileId
- **Response**: 成功状态

#### 获取提测记录
- **Method**: GET
- **Path**: /api/games/:id/submit-history
- **Response**: 提测记录数组

#### 创建提测记录
- **Method**: POST
- **Path**: /api/games/:id/submit-history
- **Body**: 提测记录对象（draftId, targetType等）
- **Response**: 创建的提测记录对象

#### 获取APK列表
- **Method**: GET
- **Path**: /api/apks
- **Response**: APK列表数组（id, apk_id, apk_name）

### 前端修改
- 创建`src/api/gameApi.js`模块，封装API调用
- 修改`Admin.vue`，使用gameApi替代mockData
- 保留原有的UI交互逻辑
