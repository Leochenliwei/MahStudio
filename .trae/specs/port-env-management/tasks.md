# 端口配置统一管理到.env文件 - 实现计划

## [x] 任务 1: 服务器添加dotenv加载
- **Priority**: P0
- **Depends On**: None
- **Description**: 
  - 在server.js文件开头添加dotenv的加载
  - 确保服务器能够从.env文件读取PORT配置
- **Acceptance Criteria Addressed**: AC-1
- **Test Requirements**:
  - `programmatic` TR-1.1: 服务器启动时读取.env文件中的PORT配置
  - `programmatic` TR-1.2: 服务器在指定端口上成功启动
- **Notes**: 服务器已经使用了process.env.PORT，只需要添加dotenv加载

## [x] 任务 2: 修改apkApi.js使用环境变量
- **Priority**: P0
- **Depends On**: None
- **Description**: 
  - 修改apkApi.js中的API_BASE_URL，使用环境变量中的端口
  - 确保前端能够正确读取环境变量
- **Acceptance Criteria Addressed**: AC-2
- **Test Requirements**:
  - `programmatic` TR-2.1: API_BASE_URL使用环境变量中的端口
  - `programmatic` TR-2.2: API请求能够成功发送到正确的端口
- **Notes**: 前端使用Vite，需要使用import.meta.env.VITE_API_PORT

## [x] 任务 3: 修改gameApi.js使用环境变量
- **Priority**: P0
- **Depends On**: None
- **Description**: 
  - 修改gameApi.js中的API_BASE_URL，使用环境变量中的端口
  - 确保前端能够正确读取环境变量
- **Acceptance Criteria Addressed**: AC-2
- **Test Requirements**:
  - `programmatic` TR-3.1: API_BASE_URL使用环境变量中的端口
  - `programmatic` TR-3.2: API请求能够成功发送到正确的端口
- **Notes**: 前端使用Vite，需要使用import.meta.env.VITE_API_PORT

## [x] 任务 4: 更新.env文件添加VITE_前缀
- **Priority**: P0
- **Depends On**: 任务 2, 任务 3
- **Description**: 
  - 在.env文件中添加VITE_API_PORT配置
  - 确保前端能够读取到正确的环境变量
- **Acceptance Criteria Addressed**: AC-2
- **Test Requirements**:
  - `programmatic` TR-4.1: .env文件中包含VITE_API_PORT配置
  - `programmatic` TR-4.2: 前端能够读取到VITE_API_PORT环境变量
- **Notes**: Vite要求环境变量以VITE_前缀开头

## [x] 任务 5: 测试配置变更
- **Priority**: P1
- **Depends On**: 任务 1, 任务 2, 任务 3, 任务 4
- **Description**: 
  - 修改.env文件中的端口配置
  - 重启服务器和前端
  - 验证所有组件都使用新的端口配置
- **Acceptance Criteria Addressed**: AC-3
- **Test Requirements**:
  - `programmatic` TR-5.1: 修改端口后服务器在新端口上启动
  - `programmatic` TR-5.2: 前端API请求发送到新端口
- **Notes**: 测试时可以临时修改端口为其他值，测试完成后改回8001