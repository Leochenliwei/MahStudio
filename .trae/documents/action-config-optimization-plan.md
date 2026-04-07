# ActionConfig.vue 优化计划

## 需求描述
优化 ActionConfig.vue 组件的属性配置区域，根据目标类型动态控制可配置的属性：
- 显示组(group)和元件(comp)：仅能配置可见性
- 选项(item)：可以控制三个属性（可见性、交互性、选中性）

## 当前代码分析

### 目标类型定义
- `group` - 显示组
- `comp` - 元件  
- `item` - 选项

### 属性配置区域（第143-229行）
当前三个属性（visible、disabled、selected）对所有目标类型都显示，需要根据 `action.level` 进行条件渲染。

## 优化方案

### 1. 修改模板部分

在 `props-config` 区域内，使用 `v-if` 条件渲染控制属性显示：

```vue
<!-- 多属性配置区域 -->
<div class="props-config">
  <!-- 可见性 - 所有类型都显示 -->
  <div class="prop-row">
    <!-- visible 配置 -->
  </div>
  
  <!-- 交互性 - 仅选项类型显示 -->
  <div v-if="action.level === 'item'" class="prop-row">
    <!-- disabled 配置 -->
  </div>
  
  <!-- 选中性 - 仅选项类型显示 -->
  <div v-if="action.level === 'item'" class="prop-row">
    <!-- selected 配置 -->
  </div>
</div>
```

### 2. 逻辑优化

当切换目标类型时，需要重置属性配置：
- 从 item 切换到 group/comp 时，自动禁用 disabled 和 selected
- 从 group/comp 切换到 item 时，保持原有逻辑

### 3. 样式调整

确保只有可见性配置时，布局依然美观。

## 实施步骤

1. **修改模板** - 添加 `v-if="action.level === 'item'"` 条件到 disabled 和 selected 属性行
2. **优化切换逻辑** - 在 `selectTargetType` 方法中添加属性重置逻辑
3. **测试验证** - 使用 webapp-testing skill 进行功能测试

## 文件变更

- `/Users/zonst/Documents/Programs/WEBconfig/src/components/ActionConfig.vue`
  - 第173-200行：添加 `v-if="action.level === 'item'"` 到交互性配置
  - 第201-228行：添加 `v-if="action.level === 'item'"` 到选中性配置
  - 第299-321行：在 `selectTargetType` 方法中添加属性重置逻辑

## 关联需求
- 选项联动规则编辑器优化
- 动作配置交互体验提升
