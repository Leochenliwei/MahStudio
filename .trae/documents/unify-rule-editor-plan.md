# 统一选项联动简版和高阶页面新建规则弹窗计划

## 问题分析

目前有两个不同的规则编辑器实现：

1. **选项联动简版** (`SimpleDependencyPage.vue`)
   - 使用 `RuleEditorModal` 组件作为编辑器弹窗
   - 数据结构：`conditionTree`, `targets`

2. **选项联动高阶** (`DependencyEditor.vue`)
   - 使用内嵌的编辑器弹窗实现
   - 使用 `ConditionTree` + `ActionConfig` 组件
   - 数据结构：`conditionTree`, `targets`, `tooltip`, `description`

## 目标

统一使用高阶版的编辑器实现，让简版页面也使用相同的编辑器弹窗。

## 实现方案

### 方案选择：复用 DependencyEditor 的编辑器弹窗

将 `DependencyEditor.vue` 的编辑器弹窗逻辑提取为一个独立的弹窗组件，或者让 `SimpleDependencyPage.vue` 直接使用 `DependencyEditor` 的编辑器弹窗。

考虑到 `DependencyEditor` 本身已经是一个完整的编辑器页面，最佳方案是：

**创建一个新的 `RuleEditorModalPro` 组件**，基于高阶版的实现，然后让两个页面都使用这个组件。

### 具体步骤

#### 步骤 1: 创建 RuleEditorModalPro 组件

基于 `DependencyEditor.vue` 的编辑器弹窗实现，创建一个新的组件：

```
src/components/RuleEditorModalPro.vue
```

包含：
- 条件树编辑区域（使用 ConditionTree 组件）
- 动作配置区域（使用 ActionConfig 组件）
- 支持 tooltip 和 description
- 支持条件组

#### 步骤 2: 更新 SimpleDependencyPage.vue

- 替换 `RuleEditorModal` 为 `RuleEditorModalPro`
- 更新数据结构以支持新的字段（tooltip, description）
- 更新保存逻辑

#### 步骤 3: 更新 DependencyEditor.vue（可选）

如果需要，可以让 `DependencyEditor.vue` 也使用 `RuleEditorModalPro`，保持代码一致性。

### 数据结构对比

**当前简版数据结构：**
```javascript
{
  id: number,
  conditionTree: {
    id: 'root',
    logic: 'and',
    children: [...]
  },
  targets: [...]
}
```

**高阶版数据结构：**
```javascript
{
  id: number,
  conditionTree: {
    id: 'root',
    logic: 'and',
    children: [...]
  },
  targets: [...],
  tooltip: '',
  description: ''
}
```

### 组件接口设计

**RuleEditorModalPro Props:**
```javascript
{
  show: Boolean,
  isEditing: Boolean,
  formSchema: Array,
  ruleData: Object  // 包含 conditionTree, targets, tooltip, description
}
```

**RuleEditorModalPro Emits:**
```javascript
{
  close: () => void,
  save: (rule: Object) => void
}
```

## 实施步骤

1. ⏳ 创建 RuleEditorModalPro.vue 组件
   - 复制 DependencyEditor.vue 的编辑器弹窗模板和逻辑
   - 整合 ConditionTree 和 ActionConfig 组件
   - 添加 tooltip 和 description 支持

2. ⏳ 更新 SimpleDependencyPage.vue
   - 引入 RuleEditorModalPro 组件
   - 替换 RuleEditorModal 的使用
   - 更新数据保存逻辑

3. ⏳ 测试验证
   - 确保简版页面可以正常打开编辑器
   - 确保数据保存和加载正常
   - 确保 tooltip 和 description 功能正常

## 代码结构

### RuleEditorModalPro.vue 结构

```vue
<template>
  <div v-if="show" class="modal-overlay">
    <div class="modal-container">
      <!-- 头部 -->
      <div class="modal-header">
        <button @click="handleClose">返回</button>
        <h3>{{ isEditing ? '编辑规则' : '新建规则' }}</h3>
        <button @click="handleSave">保存规则</button>
      </div>
      
      <!-- 内容区 -->
      <div class="modal-body">
        <div class="split-layout">
          <!-- 左侧：条件树 -->
          <div class="left-panel">
            <ConditionTree ... />
          </div>
          
          <!-- 右侧：动作配置 -->
          <div class="right-panel">
            <ActionConfig ... />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
```

## 预期效果

- 简版和高阶页面使用相同的编辑器弹窗
- 支持 tooltip 和 description 字段
- 支持条件组编辑
- 数据格式统一
