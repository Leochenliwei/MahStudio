# 变量编辑组件移植任务列表

## 任务依赖关系
- Task 1 (创建目录结构) 必须在所有其他任务之前完成
- Task 2, 3, 4, 5 可以并行执行
- Task 6 (更新 Workbench.vue) 依赖于 Task 2, 3, 4, 5
- Task 7 (更新组件关系文档) 依赖于 Task 6
- Task 8 (测试验证) 依赖于所有其他任务

## 任务列表

### Task 1: 创建变量编辑组件目录结构
- [x] 创建目录 `src/components/variable-editing/`
- [x] 创建子目录 `src/components/variable-editing/common/`

### Task 2: 移植 WhetherToEstablish.vue 主组件
- [x] 将资料中的 WhetherToEstablish.vue 复制到 `src/components/variable-editing/WhetherToEstablish.vue`
- [x] 更新组件中的 API 导入路径（从 `@/api/game-settings/editor` 改为 `@/api/gameApi`）
- [x] 移除对 `useStore` 的依赖（如果项目中不存在）
- [x] 调整样式以符合项目设计规范

### Task 3: 移植 AddMultiplyMaxMin.vue 子组件
- [x] 将资料中的 AddMultiplyMaxMin.vue 复制到 `src/components/variable-editing/common/AddMultiplyMaxMin.vue`
- [x] 更新 ConfigFormulaNum 组件的导入路径
- [x] 调整样式以符合项目设计规范

### Task 4: 移植 Establish.vue 子组件
- [x] 将资料中的 Establish.vue 复制到 `src/components/variable-editing/common/Establish.vue`
- [x] 更新 ConfigFormulaPure 组件的导入路径
- [x] 调整样式以符合项目设计规范

### Task 5: 移植工具函数和索引文件
- [x] 将资料中的 util.ts 复制到 `src/components/variable-editing/common/util.ts`
- [x] 创建 `src/components/variable-editing/common/Index.ts` 导出子组件

### Task 6: 在 gameApi.js 中添加变量管理 API
- [x] 添加 `getVariableConfigList` 函数
- [x] 添加 `addVariableConfig` 函数
- [x] 添加 `updateVariableConfig` 函数
- [x] 添加 `deleteVariableConfig` 函数
- [x] 使用 localStorage 实现数据持久化（如果后端API不可用）

### Task 7: 更新 Workbench.vue 集成新组件
- [x] 导入 WhetherToEstablish 组件
- [x] 移除 VariableManagementModal 和 VariableEditor 的导入
- [x] 更新变量管理弹窗的显示逻辑
- [x] 传递 cfg_id 参数给 WhetherToEstablish 组件
- [x] 测试变量管理功能

### Task 8: 更新组件关系文档
- [x] 在 component_rules.md 中添加 WhetherToEstablish 组件信息
- [x] 更新 Mermaid 依赖关系图
- [x] 添加新组件的文件路径到速查表

### Task 9: 清理旧组件（可选）
- [x] 删除旧的 VariableManagementModal.vue
- [x] 删除旧的 VariableEditor.vue
- [x] 删除旧的 CustomSelect.vue（如果被新组件替代）

### Task 10: 测试验证
- [x] 验证变量列表展示功能
- [x] 验证新增变量功能
- [x] 验证编辑变量功能
- [x] 验证保存变量功能
- [x] 验证删除变量功能
- [x] 验证未保存提示功能
- [x] 验证不同变量类型的编辑器切换
