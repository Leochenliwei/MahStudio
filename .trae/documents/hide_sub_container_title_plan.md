# 子容器标题隐藏实施计划

## 问题分析

从截图可以看到，当条件树中存在嵌套子条件组时，子容器内部又渲染了一个"条件判断 (IF)"的标题栏（红框标注部分），导致标题重复显示。

问题根源在 `ConditionTree.vue` 组件：
- 该组件递归渲染子条件组
- 每个组件实例都固定渲染 `panel-title` 标题栏
- 嵌套时子组件的标题栏应该被隐藏

## 解决方案

通过添加 `showTitle` 属性来控制标题显示：
1. 最外层的 `ConditionTree` 显示标题（`showTitle=true`）
2. 嵌套的子 `ConditionTree` 隐藏标题（`showTitle=false`）

## 实施步骤

### 步骤1: 修改 ConditionTree.vue

**1.1 添加 showTitle 属性**
- 在 `defineProps` 中添加 `showTitle` 属性，默认值为 `true`

**1.2 条件渲染标题栏**
- 使用 `v-if="showTitle"` 控制 `panel-title` 的显示

**1.3 递归传递属性**
- 在递归调用 `<ConditionTree>` 组件时，传递 `:show-title="false"`

### 步骤2: 检查其他使用 ConditionTree 的组件

检查以下文件，确保它们正确使用 `ConditionTree`：
- `RuleEditorModal.vue` - 使用 ConditionTree 的位置
- 其他可能引用 ConditionTree 的组件

### 步骤3: 验证修改

使用 webapp-testing skill 进行测试，确保：
1. 最外层标题正常显示
2. 嵌套子条件组不再显示重复标题
3. 其他功能不受影响

## 代码修改详情

### ConditionTree.vue 修改点

```vue
<!-- 1. 添加 props -->
const props = defineProps({
  conditionTree: { type: Object, default: null },
  allComponents: { type: Array, default: () => [] },
  depth: { type: Number, default: 1 },
  showTitle: { type: Boolean, default: true }  // 新增
})

<!-- 2. 条件渲染标题 -->
<div v-if="showTitle" class="panel-title">
  <span>条件判断 (IF)</span>
  <span class="panel-hint">点击圆点切换 且/或</span>
</div>

<!-- 3. 递归调用时传递 show-title="false" -->
<ConditionTree 
  :condition-tree="child" 
  :all-components="allComponents"
  :depth="depth + 1"
  :show-title="false"  <!-- 新增 -->
  @update:condition-tree="(updatedTree) => updateSubGroup(child, updatedTree)"
/>
```

## 预期效果

- 最外层条件树显示"条件判断 (IF)"标题
- 嵌套的子条件组不再显示标题，只显示条件内容
- 界面更加简洁，避免重复信息
