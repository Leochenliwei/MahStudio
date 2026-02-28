# 端口配置统一管理 - 实现计划

## [ ] 任务 1: 添加 dotenv 依赖
- **Priority**: P0
- **Depends On**: None
- **Description**: 
  - 使用 npm 安装 dotenv 包
  - 确保包被添加到 package.json 中
- **Acceptance Criteria Addressed**: AC-5
- **Test Requirements**:
  - `programmatic` TR-1.1: 运行 `npm list dotenv` 确认包已安装
  - `programmatic` TR-1.2: 检查 package.json 中是否包含 dotenv 依赖
- **Notes**: 这是基础任务，其他任务都依赖于这个包的安装

## [ ] 任务 2: 创建 .env 文件和 .env.example 文件
- **Priority**: P0
- **Depends On**: 任务 1
- **Description**:
  - 在项目根目录创建 .env 文件，包含 PORT 环境变量配置
  - 创建 .env.example 文件作为配置示例
  - 在 .env.example 中添加必要的注释说明
- **Acceptance Criteria Addressed**: AC-5
- **Test Requirements**:
  - `programmatic` TR-2.1: 检查项目根目录是否存在 .env 文件
  - `programmatic` TR-2.2: 检查项目根目录是否存在 .env.example 文件
  - `human-judgment` TR-2.3: 检查 .env 文件中是否包含 PORT 配置
  - `human-judgment` TR-2.4: 检查 .env.example 文件是否包含配置示例和注释
- **Notes**: .env 文件应添加到 .gitignore 中以避免提交敏感信息

## [ ] 任务 3: 修改服务器端口配置
- **Priority**: P0
- **Depends On**: 任务 1, 任务 2
- **Description**:
  - 在 server.js 中引入 dotenv 包
  - 修改端口配置，从环境变量读取 PORT 值，默认值为 8001
- **Acceptance Criteria Addressed**: AC-1, AC-2, AC-5
- **Test Requirements**:
  - `programmatic` TR-3.1: 启动服务器，检查是否使用环境变量中的端口
  - `programmatic` TR-3.2: 移除环境变量，启动服务器，检查是否使用默认端口 8001
  - `human-judgment` TR-3.3: 检查 server.js 代码是否正确使用 dotenv 加载环境变量
- **Notes**: 确保在文件顶部引入 dotenv

## [ ] 任务 4: 修改 API 基础 URL 配置
- **Priority**: P0
- **Depends On**: 任务 1, 任务 2
- **Description**:
  - 在 gameApi.js 和 apkApi.js 中引入 dotenv 包
  - 修改 API 基础 URL 配置，从环境变量读取 API_PORT 值，默认值为 8001
- **Acceptance Criteria Addressed**: AC-3, AC-4, AC-5
- **Test Requirements**:
  - `programmatic` TR-4.1: 检查 gameApi.js 中是否正确使用环境变量构建 API 基础 URL
  - `programmatic` TR-4.2: 检查 apkApi.js 中是否正确使用环境变量构建 API 基础 URL
  - `human-judgment` TR-4.3: 检查代码是否清晰，默认值设置是否正确
- **Notes**: 确保在文件顶部引入 dotenv

## [ ] 任务 5: 测试和验证
- **Priority**: P1
- **Depends On**: 任务 3, 任务 4
- **Description**:
  - 启动服务器，验证端口配置是否正确
  - 测试 API 调用，验证 API 基础 URL 是否正确
  - 测试在不同环境变量设置下的行为
- **Acceptance Criteria Addressed**: 所有 AC
- **Test Requirements**:
  - `programmatic` TR-5.1: 启动服务器，检查日志中显示的端口是否正确
  - `programmatic` TR-5.2: 发起 API 请求，检查是否能正常连接
  - `human-judgment` TR-5.3: 验证整个系统是否正常运行
- **Notes**: 测试时应覆盖有环境变量和无环境变量两种情况