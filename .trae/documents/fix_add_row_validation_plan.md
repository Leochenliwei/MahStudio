# 修复 "添加一行" 按钮验证提示问题的实现计划

## [x] 任务 1: 修改 "添加一行" 按钮的 type 属性
- **Priority**: P0
- **Depends On**: None
- **Description**: 
  - 在 VariableEditor.vue 文件中，将 "添加一行" 按钮的 type 属性设置为 "button"，以防止点击时触发表单的提交事件
- **Success Criteria**:
  - 点击 "添加一行" 按钮时不再触发表单验证
  - 按钮仍然可以正常添加新的规则行
- **Test Requirements**:
  - `programmatic` TR-1.1: 点击 "添加一行" 按钮时不会弹出验证提示
  - `human-judgement` TR-1.2: 按钮点击后能够正确添加新的规则行
- **Notes**: 该修改非常简单，只需在按钮元素上添加 type="button" 属性

## [x] 任务 2: 测试修复效果
- **Priority**: P1
- **Depends On**: 任务 1
- **Description**:
  - 启动应用并打开变量编辑器
  - 不填写变量名称，直接点击 "添加一行" 按钮
  - 验证是否不再弹出验证提示
  - 验证是否成功添加了新的规则行
- **Success Criteria**:
  - 点击 "添加一行" 按钮时不再弹出 "请输入变量名称" 的提示
  - 页面上成功添加了新的规则行
- **Test Requirements**:
  - `programmatic` TR-2.1: 点击 "添加一行" 按钮时不会触发表单验证
  - `human-judgement` TR-2.2: 按钮点击后能够正确添加新的规则行
- **Notes**: 测试时需要确保变量名称为空，以验证修复是否有效

## [x] 任务 3: 验证保存功能仍然正常
- **Priority**: P1
- **Depends On**: 任务 1
- **Description**:
  - 启动应用并打开变量编辑器
  - 不填写变量名称，直接点击 "保存" 按钮
  - 验证是否仍然弹出 "请输入变量名称" 的提示
- **Success Criteria**:
  - 点击 "保存" 按钮时仍然会弹出验证提示
  - 表单验证功能正常工作
- **Test Requirements**:
  - `programmatic` TR-3.1: 点击 "保存" 按钮时会触发表单验证
  - `human-judgement` TR-3.2: 验证提示内容正确
- **Notes**: 确保修改不会影响保存功能的验证逻辑
