# Tasks

- [x] Task 1: 扩展数据类型定义
  - [x] SubTask 1.1: 更新 Token 接口，添加 category 和 valueType 字段
  - [x] SubTask 1.2: 更新 ElementItem 接口，添加 valueType 字段（1=布尔类, 2=数值类）
  - [x] SubTask 1.3: 定义标签样式映射表（category -> 颜色配置）

- [x] Task 2: 实现多类型标签渲染
  - [x] SubTask 2.1: 创建标签样式计算函数（根据 category 返回对应样式类）
  - [x] SubTask 2.2: 实现身份类标签样式（蓝色 #dbeafe/#1e40af）
  - [x] SubTask 2.3: 实现状态类标签样式（绿色 #d1fae5/#065f46）
  - [x] SubTask 2.4: 实现数值类标签样式（灰色 #f3f4f6/#374151）
  - [x] SubTask 2.5: 实现描述文本样式（灰色文字 #9ca3af，无背景）
  - [x] SubTask 2.6: 实现操作符文本样式（灰色 #6b7280，无背景）

- [x] Task 3: 优化标签删除交互
  - [x] SubTask 3.1: 实现删除按钮（默认隐藏，悬停显示）
  - [x] SubTask 3.2: 实现删除按钮样式（默认 #9ca3af，hover #ef4444）
  - [x] SubTask 3.3: 实现点击删除按钮移除标签逻辑
  - [x] SubTask 3.4: 添加删除过渡动画（150ms ease）

- [x] Task 4: 实现数据类型差异化展示
  - [x] SubTask 4.1: 实现数值型元素解析（value_type: 2，格式：[身份] 的 [状态]）
  - [x] SubTask 4.2: 实现布尔型元素解析（value_type: 1，格式：[身份] 的状态 [状态]）
  - [x] SubTask 4.3: 实现带条件的布尔型解析（格式：[身份] 的状态 为/不为 [状态]）
  - [x] SubTask 4.4: 更新 tokens computed 属性以支持新格式

- [x] Task 5: 优化标签布局和间距
  - [x] SubTask 5.1: 更新标签容器布局（flex，gap: 4px）
  - [x] SubTask 5.2: 实现标签垂直居中对齐
  - [x] SubTask 5.3: 实现标签换行显示
  - [x] SubTask 5.4: 实现输入框自适应高度（min: 40px, max: 120px）
  - [x] SubTask 5.5: 添加滚动条样式优化

- [x] Task 6: 更新元素数据解析逻辑
  - [x] SubTask 6.1: 更新 parseExpression 函数以识别元素 category
  - [x] SubTask 6.2: 从 API 数据中提取 value_type 字段（1=布尔类, 2=数值类）
  - [x] SubTask 6.3: 更新元素插入逻辑以保留 category 和 valueType 信息

- [x] Task 7: 样式统一与细节优化
  - [x] SubTask 7.1: 统一使用项目设计规范中的颜色变量
  - [x] SubTask 7.2: 实现所有过渡动画（150ms ease）
  - [x] SubTask 7.3: 确保标签满足 44px 最小点击区域
  - [x] SubTask 7.4: 添加组件级注释和需求关联

- [x] Task 8: 测试与验证
  - [x] SubTask 8.1: 测试不同类型标签的颜色显示
  - [x] SubTask 8.2: 测试标签删除功能
  - [x] SubTask 8.3: 测试数值型和布尔型元素的差异化展示
  - [x] SubTask 8.4: 测试标签换行和自适应高度
  - [x] SubTask 8.5: 测试与 ActionLimitEditor 的数据交互

# Task Dependencies
- Task 2 依赖 Task 1
- Task 3 依赖 Task 2
- Task 4 依赖 Task 1
- Task 5 依赖 Task 2
- Task 6 依赖 Task 1
- Task 7 依赖 Task 2、Task 3、Task 4、Task 5
- Task 8 依赖 Task 7
