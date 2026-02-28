# API URL修改计划 - 让内网同事直连数据库

## [x] 任务 1: 修改服务器监听地址
- **Priority**: P0
- **Depends On**: None
- **Description**: 
  - 修改server.js文件，将服务器监听地址从localhost改为0.0.0.0，使其可以接受来自所有网络接口的连接
  - 这样其他内网同事就可以通过你的内网IP访问服务器
- **Success Criteria**: 服务器能够在所有网络接口上监听请求
- **Test Requirements**:
  - `programmatic` TR-1.1: 服务器启动后监听在0.0.0.0地址
  - `programmatic` TR-1.2: 其他内网设备能够通过内网IP访问服务器
- **Notes**: 0.0.0.0表示监听所有网络接口

## [x] 任务 2: 修改前端API基础URL配置
- **Priority**: P0
- **Depends On**: None
- **Description**: 
  - 修改gameApi.js和apkApi.js文件，将API_BASE_URL改为使用环境变量配置
  - 添加VITE_API_HOST环境变量，用于配置API服务器的主机地址
- **Success Criteria**: 前端能够通过环境变量配置API服务器地址
- **Test Requirements**:
  - `programmatic` TR-2.1: API_BASE_URL使用环境变量中的主机和端口配置
  - `programmatic` TR-2.2: 前端能够正确连接到配置的API服务器
- **Notes**: Vite环境变量需要以VITE_前缀开头

## [x] 任务 3: 更新.env文件配置
- **Priority**: P0
- **Depends On**: 任务 2
- **Description**: 
  - 在.env文件中添加VITE_API_HOST配置
  - 保持现有的VITE_API_PORT配置
  - 添加注释说明如何配置API地址
- **Success Criteria**: .env文件包含API主机和端口的配置
- **Test Requirements**:
  - `programmatic` TR-3.1: .env文件中包含VITE_API_HOST配置
  - `programmatic` TR-3.2: 环境变量能够被正确加载
- **Notes**: 可以将默认值设置为localhost，方便本地开发

## [x] 任务 4: 测试内网访问
- **Priority**: P1
- **Depends On**: 任务 1, 任务 2, 任务 3
- **Description**: 
  - 启动服务器
  - 其他内网同事通过你的内网IP访问服务器
  - 测试API是否正常工作
- **Success Criteria**: 其他内网同事能够成功访问API服务器
- **Test Requirements**:
  - `programmatic` TR-4.1: 服务器能够通过内网IP访问
  - `programmatic` TR-4.2: API接口能够正常响应请求
- **Notes**: 需要获取你的内网IP地址，格式通常为192.168.x.x或10.x.x.x

## [x] 任务 5: 更新文档
- **Priority**: P2
- **Depends On**: 任务 1, 任务 2, 任务 3
- **Description**: 
  - 更新README.md文件，添加关于如何配置API地址的说明
  - 提供内网访问的使用指南
- **Success Criteria**: 文档包含完整的API地址配置说明
- **Test Requirements**:
  - `human-judgement` TR-5.1: 文档清晰易懂
  - `human-judgement` TR-5.2: 文档包含所有必要的配置信息
- **Notes**: 可以添加示例配置和常见问题解答