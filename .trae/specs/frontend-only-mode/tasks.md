# 纯前端项目改造 - 实施计划

## [ ] 任务 1: 创建 localStorage 存储服务层
- **Priority**: P0
- **Depends On**: None
- **Description**: 
  - 创建 src/storage/localStorageService.js 文件
  - 实现数据的读取、写入、更新、删除操作
  - 实现数据初始化逻辑（从 mockData.js 初始化）
- **Acceptance Criteria Addressed**: [AC-2, AC-3]
- **Test Requirements**:
  - `programmatic` TR-1.1: 能正确从 localStorage 读取数据
  - `programmatic` TR-1.2: 能正确写入数据到 localStorage
  - `programmatic` TR-1.3: 首次使用时能正确初始化数据
- **Notes**: 确保与 mockData.js 中的数据结构一致

## [ ] 任务 2: 重构 gameApi.js 使用 localStorage
- **Priority**: P0
- **Depends On**: 任务 1
- **Description**: 
  - 修改 src/api/gameApi.js，移除网络请求
  - 替换为 localStorageService 的调用
  - 保持函数签名和返回格式不变
- **Acceptance Criteria Addressed**: [AC-5]
- **Test Requirements**:
  - `programmatic` TR-2.1: getAllGames 返回正确的数据
  - `programmatic` TR-2.2: createGame 能正确创建游戏
  - `programmatic` TR-2.3: updateGame 能正确更新游戏
  - `programmatic` TR-2.4: deleteGame 能正确删除游戏
  - `programmatic` TR-2.5: 文件操作正常工作
  - `programmatic` TR-2.6: 提交历史操作正常工作
- **Notes**: 确保所有 API 函数保持 Promise 风格返回

## [ ] 任务 3: 重构 apkApi.js 使用 localStorage
- **Priority**: P1
- **Depends On**: 任务 1
- **Description**: 
  - 修改 src/api/apkApi.js，移除网络请求
  - 替换为 localStorageService 的调用
  - 保持函数签名和返回格式不变
- **Acceptance Criteria Addressed**: [AC-5]
- **Test Requirements**:
  - `programmatic` TR-3.1: getAllApks 返回正确的数据
- **Notes**: APK 数据可以从 mock 数据或静态数据获取

## [ ] 任务 4: 更新 package.json 移除服务器依赖
- **Priority**: P1
- **Depends On**: None
- **Description**: 
  - 移除不需要的后端依赖（express, better-sqlite3 等）
  - 更新 npm scripts，移除服务器相关命令
- **Acceptance Criteria Addressed**: [AC-1]
- **Test Requirements**:
  - `programmatic` TR-4.1: npm install 成功
  - `programmatic` TR-4.2: npm run dev 能正常启动
  - `human-judgement` TR-4.3: 不需要启动服务器就能运行项目
- **Notes**: 保留 Vue、Element Plus 等前端依赖

## [ ] 任务 5: 测试和验证所有功能
- **Priority**: P0
- **Depends On**: 任务 2, 任务 3
- **Description**: 
  - 全面测试游戏目录页面的所有功能
  - 全面测试工作台页面的所有功能
  - 全面测试房间创建页面的所有功能
  - 验证数据持久化
- **Acceptance Criteria Addressed**: [AC-1, AC-4]
- **Test Requirements**:
  - `human-judgement` TR-5.1: 游戏列表显示正确
  - `human-judgement` TR-5.2: 创建、编辑、删除游戏功能正常
  - `human-judgement` TR-5.3: 文件管理功能正常
  - `human-judgement` TR-5.4: 提交历史功能正常
  - `human-judgement` TR-5.5: 刷新页面后数据保持
  - `human-judgement` TR-5.6: 所有其他现有功能正常工作
- **Notes**: 使用 webapp-testing skill 进行测试
