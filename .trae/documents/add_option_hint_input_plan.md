# 选项提示语输入框功能实现计划

## 需求描述
在 `/Users/zonst/Documents/Programs/WEBconfig/src/components/Drawer.vue` 中，每个选项下方增加一行提示语输入框。

## 当前结构分析
- 每个选项使用 `option-wrapper` 容器包裹
- 内部包含：
  1. `option-item` - 选项主行（序号、选项名、赋值、操作按钮）
  2. `option-default-row` - 默认选中行
- 需要在 `option-default-row` 下方新增提示语输入行

## 实现步骤

### 1. 修改模板结构
- 在 `option-default-row` 之后添加新的提示语输入行 `option-hint-row`
- 包含标签"提示语"和输入框
- 输入框绑定到 `option.hint` 字段

### 2. 添加样式
- 添加 `.option-hint-row` 样式类
- 保持与 `option-default-row` 一致的布局风格
- 输入框样式复用现有的 `.form-input`

### 3. 数据结构确认
- 选项对象需要支持 `hint` 字段
- 检查父组件是否正确传递 hint 数据

## 具体修改内容

### Drawer.vue 模板修改
在 `option-default-row` 闭合标签后添加：
```vue
<!-- 选项提示语行 -->
<div class="option-hint-row">
  <div class="col-index"></div>
  <div class="col-label">
    <label class="hint-label">提示语</label>
    <input 
      type="text" 
      class="form-input hint-input" 
      v-model="option.hint"
      placeholder="请输入选项提示语"
    >
  </div>
  <div class="col-value"></div>
  <div class="col-action"></div>
</div>
```

### Drawer.vue 样式添加
添加以下样式：
```css
/* 选项提示语行 */
.option-hint-row {
  display: flex;
  align-items: center;
  padding: var(--spacing-2) var(--spacing-6);
  border-top: 1px solid var(--color-border);
  background: var(--color-surface);
}

.option-hint-row .col-label {
  margin-left: var(--spacing-3);
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
}

.hint-label {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  white-space: nowrap;
}

.hint-input {
  flex: 1;
}
```

## 验收标准
- [ ] 每个选项下方显示提示语输入行
- [ ] 输入框可以正常输入并绑定数据
- [ ] 样式与现有UI风格一致
- [ ] 不影响原有功能（拖拽排序、默认选中等）
