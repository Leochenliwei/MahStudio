# 变量编辑组件移植检查清单

## 代码实现检查

### 目录结构
- [x] `src/components/variable-editing/` 目录已创建
- [x] `src/components/variable-editing/common/` 子目录已创建

### 组件文件
- [x] `WhetherToEstablish.vue` 已移植到正确位置
- [x] `AddMultiplyMaxMin.vue` 已移植到 common 目录
- [x] `Establish.vue` 已移植到 common 目录
- [x] `util.ts` 已移植到 common 目录
- [x] `Index.ts` 已创建并正确导出子组件

### API 接口
- [x] `getVariableConfigList` 函数已在 gameApi.js 中实现
- [x] `addVariableConfig` 函数已在 gameApi.js 中实现
- [x] `updateVariableConfig` 函数已在 gameApi.js 中实现
- [x] `deleteVariableConfig` 函数已在 gameApi.js 中实现
- [x] API 函数使用 localStorage 进行数据持久化

### Workbench.vue 更新
- [x] WhetherToEstablish 组件已正确导入
- [x] 旧的 VariableManagementModal 导入已移除
- [x] 变量管理弹窗显示逻辑已更新
- [x] cfg_id 参数正确传递给 WhetherToEstablish 组件

### 组件关系文档
- [x] component_rules.md 已更新 WhetherToEstablish 组件信息
- [x] Mermaid 依赖关系图已更新
- [x] 文件路径速查表已更新

## 功能测试检查

### 变量列表展示
- [x] 打开变量管理弹窗时显示左侧变量列表
- [x] 变量按类型正确分组显示
- [x] 每个类型显示正确的数量统计
- [x] 空列表时显示提示信息

### 新增变量
- [x] 点击"新增变量"按钮创建新变量
- [x] 新变量名称自动生成（格式：新增变量_XXXXXX）
- [x] 新变量自动选中并显示在编辑区域

### 编辑变量
- [x] 点击列表中的变量显示编辑表单
- [x] 表单包含变量名称输入框
- [x] 表单包含变量类型下拉选择
- [x] 根据类型显示对应的编辑器组件

### 变量类型编辑器
- [x] 类型 1-4 显示 AddMultiplyMaxMin 编辑器
- [x] 类型 5,7,8,9,10 显示 Establish 编辑器
- [x] AddMultiplyMaxMin 允许添加/删除组内元素
- [x] Establish 允许配置条件表达式

### 保存功能
- [x] 点击保存按钮保存变量数据
- [x] 数据正确转换为 API 格式
- [x] 保存成功后显示提示
- [x] 保存后修改变量列表

### 删除功能
- [x] 点击删除按钮显示确认对话框
- [x] 确认后删除变量
- [x] 删除后更新变量列表

### 未保存提示
- [x] 切换变量时有未保存修改提示保存
- [x] 关闭弹窗时有未保存修改提示保存
- [x] 选择保存后执行保存操作
- [x] 选择不保存后继续操作

## 样式检查

### UI 规范
- [x] 使用 Element Plus 组件（el-dialog、el-button、el-input 等）
- [x] 主题色使用 #3b82f6
- [x] 背景色使用 #ffffff 和 #fafafa
- [x] 边框色使用 #e5e7eb
- [x] 弹窗宽度为 1200px

### 响应式
- [x] 在小屏幕设备上正确显示
- [x] 变量列表和编辑区域正确布局

## 代码质量检查

### 注释
- [x] 所有方法都有函数级注释
- [x] 复杂逻辑有必要的注释说明

### 类型安全
- [x] TypeScript 类型定义正确
- [x] 没有 any 类型的滥用

### 错误处理
- [x] API 调用有错误处理
- [x] 用户操作有反馈提示

## 测试结果

### 自动化测试
- [x] 页面导航测试通过
- [x] 变量管理按钮点击测试通过
- [x] 变量编辑弹窗打开测试通过
- [x] 新增变量按钮检测通过
- [x] 变量列表区域检测通过

### 截图验证
- [x] 初始页面截图正常
- [x] 游戏列表页面截图正常
- [x] 游戏目录页面截图正常
- [x] 工作台页面截图正常
- [x] 变量编辑弹窗截图正常
