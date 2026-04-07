# Tasks

- [x] Task 1: 扩展数据类型定义
  - [x] SubTask 1.1: 更新 Token 接口，添加 unit 类型和嵌套支持
  - [x] SubTask 1.2: 创建 ExpressionUnit 接口
  - [x] SubTask 1.3: 扩展 ElementItem 接口，添加 requiresIdentity 字段
  - [x] SubTask 1.4: 定义身份选项列表（6种身份）

- [x] Task 2: 创建 IdentitySelector 组件
  - [x] SubTask 2.1: 创建组件文件 IdentitySelector.vue
  - [x] SubTask 2.2: 实现6个身份选项的展示（2列3行布局）
  - [x] SubTask 2.3: 实现普通身份（蓝色系）和泛身份（橙色系）的样式区分
  - [x] SubTask 2.4: 实现点击选择身份功能
  - [x] SubTask 2.5: 实现当前选中身份的高亮样式
  - [x] SubTask 2.6: 实现 Dropdown 定位逻辑

- [x] Task 3: 实现嵌套标签块渲染
  - [x] SubTask 3.1: 创建表达式单元容器组件（外层细边框）
  - [x] SubTask 3.2: 实现数值型单元渲染：[身份] 的 [状态]
  - [x] SubTask 3.3: 实现布尔型单元渲染：[身份] 的状态 [为/不为] [状态]
  - [x] SubTask 3.4: 实现无需身份元素的直接渲染
  - [x] SubTask 3.5: 实现外层边框样式（1px #e5e7eb）

- [x] Task 4: 实现身份选择功能
  - [x] SubTask 4.1: 实现插入元素时默认填充"当前玩家"
  - [x] SubTask 4.2: 实现点击身份标签打开 IdentitySelector
  - [x] SubTask 4.3: 实现选择新身份后更新表达式数据
  - [x] SubTask 4.4: 实现泛身份的特殊标识（*号或边框）

- [x] Task 5: 实现为/不为切换功能
  - [x] SubTask 5.1: 实现"为/不为"标签的渲染
  - [x] SubTask 5.2: 实现点击切换逻辑
  - [x] SubTask 5.3: 实现切换动画（150ms ease）
  - [x] SubTask 5.4: 实现"不为"的特殊样式（深色背景或删除线）

- [x] Task 6: 实现表达式单元删除
  - [x] SubTask 6.1: 实现点击单元内标签选中整个单元
  - [x] SubTask 6.2: 实现删除按钮的显示/隐藏
  - [x] SubTask 6.3: 实现删除整个表达式单元逻辑
  - [x] SubTask 6.4: 更新表达式数据

- [x] Task 7: 更新表达式解析逻辑
  - [x] SubTask 7.1: 更新 tokens computed 以支持嵌套单元
  - [x] SubTask 7.2: 实现表达式字符串到嵌套单元的解析
  - [x] SubTask 7.3: 实现嵌套单元到表达式字符串的序列化
  - [x] SubTask 7.4: 处理身份信息的提取和存储

- [x] Task 8: 更新元素数据加载
  - [x] SubTask 8.1: 从 API 数据识别元素是否需要身份
  - [x] SubTask 8.2: 设置 requiresIdentity 字段（status/fanxing/variable 为 true）
  - [x] SubTask 8.3: 设置 requiresIdentity 字段（game/roomOption 为 false）

- [x] Task 9: 样式优化与细节调整
  - [x] SubTask 9.1: 统一使用项目设计规范中的颜色变量
  - [x] SubTask 9.2: 实现所有过渡动画（150ms ease）
  - [x] SubTask 9.3: 确保标签满足 44px 最小点击区域
  - [x] SubTask 9.4: 添加组件级注释和需求关联

- [x] Task 10: 测试与验证
  - [x] SubTask 10.1: 测试嵌套标签块的渲染
  - [x] SubTask 10.2: 测试身份选择功能
  - [x] SubTask 10.3: 测试为/不为切换功能
  - [x] SubTask 10.4: 测试表达式单元删除
  - [x] SubTask 10.5: 测试与 ActionLimitEditor 的数据交互

# Task Dependencies
- Task 2 依赖 Task 1
- Task 3 依赖 Task 1
- Task 4 依赖 Task 2、Task 3
- Task 5 依赖 Task 3
- Task 6 依赖 Task 3
- Task 7 依赖 Task 1、Task 3
- Task 8 依赖 Task 1
- Task 9 依赖 Task 3、Task 4、Task 5、Task 6
- Task 10 依赖 Task 9
