# Tasks - 从公网获取组件列表数据源

## Task 1: 添加环境变量配置
**描述**: 在 .env 文件中添加远程数据源 URL 配置
- [x] SubTask 1.1: 在 `.env.example` 中添加 `VITE_COMPONENT_DATA_URL` 变量说明
- [x] SubTask 1.2: 创建/更新 `.env` 文件，配置默认 URL
- [x] SubTask 1.3: 更新 `.gitignore` 确保 `.env` 不被提交（如需要）

## Task 2: 修改 loadComponents 函数以支持远程数据获取
**描述**: 修改 Workbench.vue 中的 loadComponents 函数，从环境变量配置的 URL 获取 JSON 数据
- [x] SubTask 2.1: 修改 fetch URL 从 `import.meta.env.VITE_COMPONENT_DATA_URL` 读取
- [x] SubTask 2.2: 添加默认值作为回退
- [x] SubTask 2.3: 添加 CORS 处理（如需要）
- [x] SubTask 2.4: 添加加载状态提示
- [x] SubTask 2.5: 完善错误处理逻辑

## Task 3: 实现数据转换逻辑
**描述**: 将远程 JSON 格式转换为内部组件列表格式
- [x] SubTask 3.1: 创建 transformRemoteData 函数，将 elements 数组转换为组件列表
- [x] SubTask 3.2: 映射字段：title → name, isLocked → locked/required
- [x] SubTask 3.3: 转换属性列表，保留所有原始字段
- [x] SubTask 3.4: 提取 component_switch 的 defaultValue 作为组件 enabled 状态

## Task 4: 实现联动关系解析
**描述**: 解析 visibleWhen 表达式，提取属性联动关系
- [x] SubTask 4.1: 创建 parseVisibleWhen 函数，解析 `"{{propertyId}} == value"` 格式
- [x] SubTask 4.2: 提取依赖属性 ID、运算符和比较值
- [x] SubTask 4.3: 在组件对象中存储解析后的联动规则

## Task 5: 实现属性面板联动渲染
**描述**: 根据联动规则动态显示/隐藏属性
- [x] SubTask 5.1: 创建 isPropertyVisible 函数，判断属性是否应显示
- [x] SubTask 5.2: 在属性面板中使用 v-show 控制属性显示/隐藏
- [x] SubTask 5.3: 监听依赖属性值变化，重新计算可见性

## Task 6: 更新组件启用逻辑
**描述**: 适配新的数据结构，正确处理组件启用/禁用
- [x] SubTask 6.1: 修改 toggleComponent 函数，处理远程数据结构
- [x] SubTask 6.2: 确保 isLocked 组件正确显示为锁定状态
- [x] SubTask 6.3: 测试组件启用/禁用功能

## Task 7: 测试验证
**描述**: 使用 webapp-testing skill 进行功能测试
- [x] SubTask 7.1: 测试远程数据加载
- [x] SubTask 7.2: 测试组件列表显示
- [x] SubTask 7.3: 测试属性面板渲染
- [x] SubTask 7.4: 测试联动关系（如牌堆模式下预设选择/自定义选择的切换）

# Task Dependencies
- Task 2 依赖于 Task 1
- Task 3 依赖于 Task 2
- Task 4 依赖于 Task 3
- Task 5 依赖于 Task 4
- Task 6 依赖于 Task 3
- Task 7 依赖于 Task 5 和 Task 6
