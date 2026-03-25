# 恢复复选框样式 - 实现计划

## 需求分析
当前 `ComponentSelector.vue` 中的复选框类型（`checkbox`）使用了自定义实现，包含隐藏的原生复选框和"添加"/"移除"按钮。需要改为使用 **Element Plus 原生复选框**，并移除添加/移除按钮。

## 当前问题
- 复选框被隐藏（`style="display: none"`）
- input 设置为 `disabled="true"` 无法交互
- 通过额外的"添加"/"移除"按钮来切换选项，UI 复杂不直观
- 需要恢复为直接使用原生复选框交互

## 实现步骤

### 步骤 1：修改模板部分 (L207-L232)
- 将当前复杂的自定义结构改为使用 `el-checkbox-group` + `el-checkbox`
- 移除隐藏的 input 和添加/移除按钮
- 直接绑定 `v-model` 到 `property.defaultValue`
- 保留 `disabled` 状态逻辑（当属性未勾选时禁用）

### 步骤 2：调整逻辑
- `toggleArrayOption` 函数仍然保留（可能被其他地方调用），但不再需要在模板中使用
- `updateComponentProperty` 函数会自动处理值更新，无需额外逻辑

### 步骤 3：清理样式
- 删除 `.option-button`、`.option-button.add`、`.option-button.remove` 等相关样式代码（L1017-L1064）
- 调整 `.checkbox-option` 样式以适配 Element Plus 复选框

### 步骤 4：验证功能
- 确保多选功能正常工作（`defaultValue` 为数组）
- 确保禁用状态正确（未勾选属性时禁用复选框）
- 确保样式符合项目 UI 规范

## 代码修改预期

**修改前：**
```vue
<div v-else-if="property.type === 'checkbox'" class="checkbox-group">
  <label
    v-for="option in property.datas"
    :key="option.value"
    class="checkbox-option"
    :class="{ 'disabled': !checkedProperties.has(`${component.id}-${property.id}`) }"
  >
    <input
      type="checkbox"
      :value="option.value"
      :checked="Array.isArray(property.defaultValue) ? property.defaultValue.includes(option.value) : property.defaultValue === option.value"
      :disabled="true"
      style="display: none"
    >
    {{ option.label }}
    <button
      class="option-button"
      :class="{ 'remove': Array.isArray(property.defaultValue) && property.defaultValue.includes(option.value), 'add': !Array.isArray(property.defaultValue) || !property.defaultValue.includes(option.value) }"
      :disabled="!checkedProperties.has(`${component.id}-${property.id}`)"
      @click.stop="toggleArrayOption(component, property, option.value)"
    >
      {{ Array.isArray(property.defaultValue) && property.defaultValue.includes(option.value) ? '移除' : '添加' }}
    </button>
  </label>
</div>
```

**修改后：**
```vue
<el-checkbox-group
  v-else-if="property.type === 'checkbox'"
  v-model="property.defaultValue"
  class="checkbox-group"
  :disabled="!checkedProperties.has(`${component.id}-${property.id}`)"
  @change="updateComponentProperty(component, property.id, property.defaultValue)"
>
  <el-checkbox
    v-for="option in property.datas"
    :key="option.value"
    :label="option.value"
    class="checkbox-option"
  >
    {{ option.label }}
  </el-checkbox>
</el-checkbox-group>
```

## 风险评估
- 低风险：只是 UI 重构，核心逻辑保持不变
- `toggleArrayOption` 函数保留不删除，避免破坏其他依赖
- Element Plus 已经在项目中使用，无需新增依赖
