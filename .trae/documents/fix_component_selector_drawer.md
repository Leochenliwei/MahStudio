# 修复组件选择抽屉问题计划

## 问题描述
在创房选项页面（RoomCreatorPage）中，当用户点击选项的"规则"按钮时，会打开组件选择抽屉（Drawer.vue中的组件选择器部分），但目前存在以下问题：
1. 组件列表不显示全量组件
2. 需要支持复选多个组件
3. 右侧属性面板需要以瀑布流方式展示多个选中组件的属性表单

## 当前代码分析

### Drawer.vue 组件结构
- `drawer-component-selector` 是嵌套在 `drawer-props` 内部的级联抽屉
- 使用 `groupedComponents` 计算属性按分类分组显示组件
- `selectedComponents` 数组存储选中的组件
- 右侧属性面板通过 `v-for="component in selectedComponents"` 循环显示多个组件的属性

### RoomCreatorPage.vue 数据流
- `components` 数组通过 `loadComponents()` 从 `/components_list.json` 加载
- 传递给 Drawer 组件的 `components` prop
- `confirmComponentSelection` 处理组件选择确认

## 修复方案

### 1. 修复组件列表不显示问题
**问题定位：**
- 检查 `groupedComponents` 计算属性是否正确过滤组件
- 检查 `expandedCategories` 是否正确初始化，确保分类默认展开

**修复内容：**
- 在 Drawer.vue 中，当 `showComponentSelector` 变为 true 时，自动展开所有分类
- 确保搜索过滤逻辑正确，不过滤掉有效组件

### 2. 支持复选组件
**当前状态：**
- `toggleComponentSelection` 方法已支持多选功能（使用数组的 push/splice）
- `selectedComponents` 是数组类型

**需要完善：**
- 添加复选框UI，让用户明确知道可以多选
- 在组件项上添加复选框，点击复选框切换选择状态
- 点击组件行也可以切换选择

### 3. 右侧属性面板瀑布流展示
**当前状态：**
- 已使用 `v-for` 循环显示多个组件的属性
- 每个组件的属性显示在 `component-properties-section` 中

**需要优化：**
- 使用 CSS Grid 或 Masonry 布局实现瀑布流效果
- 每个组件的属性卡片可以自适应高度
- 添加组件名称标题，便于区分不同组件

## 具体修改步骤

### 步骤1：修复 Drawer.vue 中的组件列表显示

1.1 修改 `expandedCategories` 的初始化逻辑，当组件选择器打开时自动展开所有分类：
```javascript
// 监听 showComponentSelector 变化
watch(() => props.showComponentSelector, (newVal) => {
  if (newVal) {
    // 自动展开所有分类
    const categories = Object.keys(groupedComponents.value)
    expandedCategories.value = new Set(categories)
  }
})
```

1.2 确保 `groupedComponents` 计算属性不过滤掉有效组件：
- 检查搜索逻辑，当搜索关键词为空时显示所有组件
- 确保分类分组正确

### 步骤2：添加复选框UI支持多选

2.1 在组件项模板中添加复选框：
```vue
<div 
  v-for="component in categoryComponents" 
  :key="component.id"
  class="component-item"
  :class="{ 'selected': selectedComponents.some(c => c.id === component.id) }"
>
  <label class="component-checkbox">
    <input 
      type="checkbox" 
      :checked="selectedComponents.some(c => c.id === component.id)"
      @change="toggleComponentSelection(component)"
    >
    <span class="checkmark"></span>
  </label>
  <!-- 其他内容 -->
</div>
```

2.2 修改 `toggleComponentSelection` 方法，使用组件ID来判断是否已选中：
```javascript
function toggleComponentSelection(component) {
  const index = selectedComponents.value.findIndex(c => c.id === component.id)
  if (index > -1) {
    selectedComponents.value.splice(index, 1)
  } else {
    selectedComponents.value.push(component)
  }
}
```

### 步骤3：优化右侧属性面板瀑布流布局

3.1 修改属性面板的布局为瀑布流：
```css
.panel-content {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-4);
  align-items: start;
}
```

3.2 优化组件属性卡片的样式：
- 添加卡片阴影和边框
- 优化标题样式
- 确保属性表单项正确显示

### 步骤4：修复数据传递问题

4.1 检查 RoomCreatorPage.vue 传递给 Drawer 的 `components` 数据：
- 确保 `loadComponents()` 正确加载所有组件
- 确保组件数据包含 `properties` 属性

4.2 修改 `confirmComponentSelection` 方法，支持返回多个选中的组件：
```javascript
function confirmComponentSelection(components) {
  // components 是数组，包含所有选中的组件
  if (editingComponent.value && selectedOptionIndex.value !== -1) {
    const option = editingComponent.value.options[selectedOptionIndex.value]
    if (option) {
      // 存储选中的组件数组
      option.selectedComponents = components
      option.componentIds = components.map(c => c.id)
      
      ElNotification({
        title: '成功',
        message: `已为选项 "${option.label}" 关联 ${components.length} 个组件`,
        type: 'success',
        duration: 3000
      })
    }
  }
  closeComponentSelector()
}
```

## 文件修改清单

1. **src/components/Drawer.vue**
   - 添加 `watch` 监听 `showComponentSelector`
   - 修改 `toggleComponentSelection` 方法
   - 添加复选框UI
   - 优化属性面板瀑布流布局
   - 添加相关样式

2. **src/views/RoomCreatorPage.vue**
   - 修改 `confirmComponentSelection` 方法支持多组件

## 测试验证点

1. 打开组件选择抽屉时，所有分类默认展开
2. 组件列表显示全量组件（来自 components_list.json）
3. 可以点击复选框选择多个组件
4. 右侧属性面板以瀑布流形式展示多个组件的属性
5. 每个组件的属性可以独立编辑
6. 确认选择后，选项正确关联多个组件

## 相关需求
- 创房选项配置功能
- 组件关联规则配置
