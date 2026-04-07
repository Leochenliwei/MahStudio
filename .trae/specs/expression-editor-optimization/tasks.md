# Tasks

- [x] Task 1: 创建 ExpressionInput.vue 主组件
  - [x] SubTask 1.1: 创建组件文件，定义 props（v-model、placeholder）和 emits
  - [x] SubTask 1.2: 实现组件基本布局结构（输入区域 + 下方左右分栏）
  - [x] SubTask 1.3: 实现响应式布局逻辑（宽屏左右/窄屏上下）
  - [x] SubTask 1.4: 实现表达式值的解析和序列化逻辑

- [x] Task 2: 实现表达式输入区域
  - [x] SubTask 2.1: 创建输入区域容器，支持点击聚焦
  - [x] SubTask 2.2: 实现元素标签组件（主题色背景、圆角、删除功能）
  - [x] SubTask 2.3: 实现普通文本和标签的混合显示
  - [x] SubTask 2.4: 实现清空按钮（位于右上角，支持Ctrl+D）
  - [x] SubTask 2.5: 实现光标定位和插入逻辑

- [x] Task 3: 实现虚拟键盘组件（内嵌在 ExpressionInput）
  - [x] SubTask 3.1: 创建键盘按钮数据结构（定义所有按钮的配置）
  - [x] SubTask 3.2: 实现第一行按钮：7、8、9、+、-
  - [x] SubTask 3.3: 实现第二行按钮：4、5、6、×、÷、(、)
  - [x] SubTask 3.4: 实现第三行按钮：1、2、3、=、^、⌫（删除）
  - [x] SubTask 3.5: 实现第四行按钮：0、.、且、或、非、!
  - [x] SubTask 3.6: 实现按钮样式（数字#f9fafb、运算符#eff6ff、逻辑#f0fdf4、删除#fef2f2）
  - [x] SubTask 3.7: 实现按钮Hover动效（上移2px + 阴影）
  - [x] SubTask 3.8: 实现按钮点击插入字符到表达式的逻辑

- [x] Task 4: 实现元素选择面板（内嵌在 ExpressionInput）
  - [x] SubTask 4.1: 定义元素数据结构（分类、元素列表）
  - [x] SubTask 4.2: 实现搜索框组件（支持防抖200ms）
  - [x] SubTask 4.3: 实现分类Tab组件（牌局、状态、身份、牌型）
  - [x] SubTask 4.4: 实现元素列表组件（支持虚拟滚动）
  - [x] SubTask 4.5: 实现元素列表项的选中状态样式（竖条+✓图标）
  - [x] SubTask 4.6: 实现元素Tooltip显示
  - [x] SubTask 4.7: 实现元素点击插入到表达式的逻辑
  - [x] SubTask 4.8: 实现搜索过滤逻辑（跨分类全局搜索）

- [x] Task 5: 实现键盘快捷键
  - [x] SubTask 5.1: 实现Ctrl+E聚焦到搜索框
  - [x] SubTask 5.2: 实现Ctrl+D清空表达式
  - [x] SubTask 5.3: 实现↑/↓在元素列表中导航
  - [x] SubTask 5.4: 实现Enter选择高亮元素

- [x] Task 6: 集成到 ActionLimitEditor.vue
  - [x] SubTask 6.1: 导入 ExpressionInput 组件
  - [x] SubTask 6.2: 替换第154-161行的 el-input textarea
  - [x] SubTask 6.3: 绑定 v-model 到 item.condition
  - [x] SubTask 6.4: 测试数据格式兼容性

- [x] Task 7: 样式统一与细节优化
  - [x] SubTask 7.1: 统一使用项目设计规范中的颜色变量
  - [x] SubTask 7.2: 实现所有交互动效（150-200ms过渡）
  - [x] SubTask 7.3: 优化元素列表滚动条样式
  - [x] SubTask 7.4: 确保所有按钮满足44×44px最小点击区域
  - [x] SubTask 7.5: 添加组件级注释和需求关联

- [x] Task 8: 测试与验证
  - [x] SubTask 8.1: 测试所有键盘按钮功能
  - [x] SubTask 8.2: 测试元素选择和插入流程
  - [x] SubTask 8.3: 测试搜索过滤功能（特别是几百个元素的情况）
  - [x] SubTask 8.4: 测试键盘快捷键
  - [x] SubTask 8.5: 测试响应式布局在不同屏幕尺寸下的表现
  - [x] SubTask 8.6: 测试与 ActionLimitEditor 的数据交互

# Task Dependencies
- Task 2 依赖 Task 1
- Task 3 依赖 Task 1
- Task 4 依赖 Task 1
- Task 5 依赖 Task 2、Task 3、Task 4
- Task 6 依赖 Task 5
- Task 7 依赖 Task 5
- Task 8 依赖 Task 6、Task 7
