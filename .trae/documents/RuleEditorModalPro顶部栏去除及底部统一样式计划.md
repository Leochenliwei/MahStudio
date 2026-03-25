# RuleEditorModalPro.vue 顶部栏去除及底部统一样式计划

## 需求概述
将选项联动规则编辑弹窗 `RuleEditorModalPro.vue` 的顶部元素（返回按钮、右侧保存按钮）去掉，只保留基础 title，底部按钮样式与 `ActionLimitEditor.vue` 保持一致。

## 修改步骤

### 1. 将自定义弹窗改为 el-dialog 组件
- **位置**: 第2-51行
- **修改**: 将 `<div class="editor-modal-overlay">` 和 `<div class="editor-modal">` 替换为 `<el-dialog>` 组件
- **理由**: `ActionLimitEditor.vue` 使用 el-dialog 组件，需要统一

### 2. 移除顶部栏
- **位置**: 原第4-16行的 `<div class="modal-header">`
- **修改**: 完全删除此区块
- **理由**: 用户要求只显示基础 title，不需要返回按钮和右侧保存按钮

### 3. 保留规则说明区域
- **位置**: 原第18-26行 `<div class="rule-description-section">`
- **修改**: 保留，但需要调整样式以适应 el-dialog
- **理由**: 规则说明是核心功能，需要保留

### 4. 保留弹窗内容区
- **位置**: 原第28-49行 `<div class="modal-content">`
- **修改**: 保留内容，移至 el-dialog 的默认 slot
- **理由**: 条件树和动作列表是核心编辑功能

### 5. 添加统一底部按钮
- **位置**: 新增 `<template #footer>` 区块
- **内容**: 参考 `ActionLimitEditor.vue` 第193-203行
  ```html
  <template #footer>
    <div class="dialog-footer">
      <el-button @click="handleClose">放弃修改</el-button>
      <el-button :loading="loading" @click="handleSave">保存</el-button>
      <el-button type="primary" :loading="loading" @click="handleSaveAndClose">保存并关闭</el-button>
    </div>
  </template>
  ```
- **理由**: 与 ActionLimitEditor.vue 底部样式保持一致

### 6. 添加 loading 状态
- **位置**: script 部分
- **修改**: 添加 `const loading = ref(false)`
- **理由**: 底部按钮需要 loading 状态

### 7. 添加保存并关闭方法
- **位置**: script 部分
- **修改**: 添加 `handleSaveAndClose` 方法，保存后调用 `handleClose`
- **理由**: 底部"保存并关闭"按钮需要此功能

### 8. 样式调整
- **修改**: 删除不再需要的 CSS 样式（modal-header、btn-back、btn-save 等）
- **保留**: rule-description-section、modal-content、split-layout、panel-conditions、panel-actions 样式
- **新增**: dialog-footer 样式（从 ActionLimitEditor.vue 复用）

### 9. Props 调整
- **修改**: 将 `show` prop 替换为 `modelValue`（与 el-dialog 的 v-model 统一）
- **修改**: 调整相关逻辑
- **理由**: el-dialog 使用 v-model 绑定显示状态

### 10. Emit 调整
- **修改**: 将 `close` emit 改为 `update:modelValue`
- **修改**: 保存后自动关闭使用 `emit('update:modelValue', false)`
- **理由**: 与 el-dialog 的关闭机制保持一致

## 涉及文件
- `/Users/zonst/Documents/Programs/WEBconfig/src/components/RuleEditorModalPro.vue`
