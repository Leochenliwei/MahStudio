<template>
  <div v-if="active" class="drawer-container">
    <!-- 遮罩层 -->
    <div class="overlay" @click="$emit('close')"></div>

    <!-- 左侧抽屉 - 组件选择器 -->
    <div class="drawer" :class="{ active: active }">
      <div class="drawer-header">
        <h3>组件选择</h3>
      </div>
      <div class="drawer-body split-layout">
        <!-- 左侧组件列表 -->
        <div class="components-list-panel">
          <!-- 搜索框 -->
          <div class="components-filter">
            <div class="search-box">
              <Icon name="search" size="16" />
              <input 
                type="text" 
                v-model="searchKeyword" 
                placeholder="搜索组件..."
                class="search-input"
              >
            </div>
          </div>

          <!-- 组件列表 -->
          <div class="components-list">
            <div 
              v-for="(categoryComponents, category) in groupedComponents" 
              :key="category"
              class="category-folder"
            >
              <div 
                class="folder-header"
                @click="toggleCategory(category)"
              >
                <div class="folder-icon">
                  <Icon :name="expandedCategories.has(category) ? 'chevron-down' : 'chevron-right'" size="16" />
                  <Icon name="folder" size="16" />
                </div>
                <h4 class="folder-title">{{ category }}</h4>
                <span class="component-count">{{ categoryComponents.length }}</span>
              </div>
              <div 
                class="folder-content"
                v-show="expandedCategories.has(category)"
              >
                <div 
                  v-for="component in categoryComponents" 
                  :key="component.id"
                  class="component-item"
                  :class="{ 'selected': selectedComponents.includes(component) }"
                  @click="toggleComponentSelection(component)"
                >
                  <div class="component-icon"><Icon name="box" /></div>
                  <div class="component-info">
                    <h4>{{ component.name }}</h4>
                    <div v-if="component.enabled" class="component-status enabled">
                      已启用
                    </div>
                  </div>
                  <div class="component-toggle">
                    <label class="toggle-switch" :class="{ 'locked': component.locked }">
                      <input 
                        type="checkbox" 
                        v-model="component.enabled"
                        @change="toggleComponentStatus(component)"
                        :disabled="component.locked"
                      >
                      <span class="toggle-slider"></span>
                      <span v-if="component.locked" class="lock-icon">
                        <Icon name="lock" size="14" />
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧属性面板 -->
        <div class="properties-panel">
          <div class="panel-header">
            <h4>组件属性</h4>
          </div>
          <div class="panel-content">
            <div v-if="selectedComponents.length === 0" class="no-selection">
              <p>请选择一个组件</p>
            </div>
            <div v-else>
              <div v-for="component in selectedComponents" :key="component.id" class="component-properties-section">
                <h5>{{ component.name }}</h5>
                <div class="property-list" v-if="getComponentProperties(component.id).length > 0">
                  <div 
                    v-for="property in getComponentProperties(component.id)" 
                    :key="property.id" 
                    :class="['property-item', property.layout === 'block' ? 'layout-block' : 'layout-inline', { 'modified': modifiedProperties.has(`${component.id}-${property.id}`) }]"
                  >
                    <label :class="{ 'modified': modifiedProperties.has(`${component.id}-${property.id}`) }">{{ property.name }}</label>
                    <div class="property-control">
                      <!-- 开关类型 -->
                      <label v-if="property.type === 'component_switch'" class="toggle-switch">
                        <input 
                          type="checkbox" 
                          :checked="component?.enabled || false"
                          :disabled="component?.locked || false"
                          @change="e => {
                            if (!component?.locked) {
                              component.enabled = e.target.checked
                              toggleComponentStatus(component)
                            }
                          }"
                        >
                        <span class="toggle-slider"></span>
                      </label>
                      <label v-else-if="property.type === 'switch'" class="toggle-switch">
                        <input 
                          type="checkbox" 
                          :checked="property.defaultValue || false"
                          @change="updateComponentProperty(component, property.id, !property.defaultValue)"
                        >
                        <span class="toggle-slider"></span>
                      </label>
                       
                      <!-- 单选按钮组类型 -->
                      <div v-else-if="property.type === 'toggle'" class="toggle-group">
                        <label 
                          v-for="option in property.datas" 
                          :key="option.value"
                          class="toggle-option"
                        >
                          <input 
                            type="radio" 
                            :name="`${component.id}-${property.id}`"
                            :value="option.value"
                            :checked="property.defaultValue === option.value"
                            @change="updateComponentProperty(component, property.id, option.value)"
                          >
                          {{ option.label }}
                        </label>
                      </div>
                       
                      <!-- 下拉选择框类型 -->
                      <select 
                        v-else-if="property.type === 'select'" 
                        class="property-select"
                        :value="property.defaultValue"
                        @change="e => updateComponentProperty(component, property.id, e.target.value)"
                      >
                        <option 
                          v-for="option in property.datas" 
                          :key="option.value"
                          :value="option.value"
                        >
                          {{ option.label }}
                        </option>
                      </select>
                       
                      <!-- 复选框类型 -->
                      <div v-else-if="property.type === 'checkbox'" class="checkbox-group">
                        <label 
                          v-for="option in property.datas" 
                          :key="option.value"
                          class="checkbox-option"
                        >
                          <input 
                            type="checkbox" 
                            :value="option.value"
                            :checked="Array.isArray(property.defaultValue) ? property.defaultValue.includes(option.value) : property.defaultValue === option.value"
                            @change="e => {
                              let newValue = property.defaultValue
                              if (Array.isArray(newValue)) {
                                if (e.target.checked) {
                                  newValue = [...newValue, option.value]
                                } else {
                                  newValue = newValue.filter(v => v !== option.value)
                                }
                              } else {
                                newValue = e.target.checked
                              }
                              updateComponentProperty(component, property.id, newValue)
                            }"
                          >
                          {{ option.label }}
                        </label>
                      </div>
                       
                      <!-- 其他类型 -->
                      <input 
                        v-else 
                        type="text" 
                        class="property-input"
                        :value="property.defaultValue || ''"
                        @input="e => updateComponentProperty(component, property.id, e.target.value)"
                      >
                    </div>
                  </div>
                </div>
                <div v-else class="no-properties">
                  <p>该组件暂无属性</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="drawer-footer">
        <div class="footer-buttons">
          <button class="btn btn-outline" @click="$emit('close')">
            <Icon name="close" size="16" />
            取消
          </button>
          <button class="btn btn-primary" @click="confirmComponentSelection">
            <Icon name="check" size="16" />
            确定
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Icon from './Icon.vue'

// 定义props
const props = defineProps({
  active: {
    type: Boolean,
    default: false
  },
  components: {
    type: Array,
    default: () => []
  }
})

// 定义事件
const emit = defineEmits([
  'close',
  'confirm-component-selection',
  'toggle-component-status',
  'update-component-property'
])

// 响应式数据
const searchKeyword = ref('')
const expandedCategories = ref(new Set())
const selectedComponents = ref([])
const modifiedProperties = ref(new Set())

// 计算属性：按分类分组的组件
const groupedComponents = computed(() => {
  const filtered = props.components.filter(component => {
    const matchesSearch = !searchKeyword.value || 
      component.name.toLowerCase().includes(searchKeyword.value.toLowerCase())
    return matchesSearch
  })
  
  const grouped = {}
  filtered.forEach(component => {
    if (!grouped[component.category]) {
      grouped[component.category] = []
    }
    grouped[component.category].push(component)
  })
  return grouped
})

/**
 * 切换分类展开状态
 * @param {string} category - 分类名称
 */
function toggleCategory(category) {
  if (expandedCategories.value.has(category)) {
    expandedCategories.value.delete(category)
  } else {
    expandedCategories.value.add(category)
  }
  // 重新赋值以触发响应式更新
  expandedCategories.value = new Set(expandedCategories.value)
}

/**
 * 切换组件选择状态
 * @param {object} component - 组件对象
 */
function toggleComponentSelection(component) {
  const index = selectedComponents.value.indexOf(component)
  if (index > -1) {
    selectedComponents.value.splice(index, 1)
  } else {
    selectedComponents.value.push(component)
  }
}

/**
 * 获取组件属性
 * @param {string} componentId - 组件ID
 * @returns {array} 组件属性列表
 */
function getComponentProperties(componentId) {
  const component = props.components.find(c => c.id === componentId)
  return component ? component.properties || [] : []
}

/**
 * 更新组件属性
 * @param {object} component - 组件对象
 * @param {string} propertyId - 属性ID
 * @param {any} value - 新属性值
 */
function updateComponentProperty(component, propertyId, value) {
  const property = component.properties?.find(p => p.id === propertyId)
  if (property) {
    property.defaultValue = value
    // 将修改的属性添加到集合中，使用组件ID和属性ID的组合作为键
    modifiedProperties.value.add(`${component.id}-${propertyId}`)
    emit('update-component-property', component, propertyId, value)
  }
}

/**
 * 切换组件状态
 * @param {object} component - 组件对象
 */
function toggleComponentStatus(component) {
  emit('toggle-component-status', component)
}

/**
 * 确认组件选择
 */
function confirmComponentSelection() {
  emit('confirm-component-selection', selectedComponents.value)
  // 清除修改过的属性列表
  modifiedProperties.value.clear()
  emit('close')
}
</script>

<style scoped>
/* 侧边抽屉容器 */
.drawer-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
}

/* 遮罩层 */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  z-index: 1000;
  backdrop-filter: blur(2px);
  animation: fadeIn var(--transition-normal) ease;
}

/* 淡入动画 */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* 侧边抽屉 */
.drawer {
  position: fixed;
  top: 0;
  left: 0;
  width: 900px;
  height: 100vh;
  background: var(--color-surface);
  z-index: 1001;
  transform: translateX(-100%);
  transition: transform var(--transition-normal) cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: var(--shadow-md);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-right: 1px solid var(--color-border);
  opacity: 0;
  pointer-events: none;
}

.drawer.active {
  transform: translateX(0);
  opacity: 1;
  pointer-events: auto;
}

.drawer-header {
  padding: var(--spacing-4) var(--spacing-6);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-surface);
  box-shadow: var(--shadow-sm);
  position: sticky;
  top: 0;
  z-index: 10;
}

.drawer-header h3 {
  margin: 0;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  flex: 1;
  text-align: center;
}

.drawer-body {
  flex: 1;
  padding: 0;
  overflow: hidden;
  background: var(--color-surface-hover);
}

.drawer-footer {
  padding: var(--spacing-4) var(--spacing-6);
  border-top: 1px solid var(--color-border);
  background: var(--color-surface);
  box-shadow: 0 -1px 4px rgba(0, 0, 0, 0.3);
  position: sticky;
  bottom: 0;
  z-index: 10;
}

.footer-buttons {
  display: flex;
  gap: var(--spacing-3);
  justify-content: flex-end;
}

.footer-buttons .btn {
  flex: 1;
  max-width: 120px;
}

/* 左右分栏布局 */
.split-layout {
  display: flex;
  height: 100%;
  overflow: hidden;
}

/* 左侧组件列表面板 */
.components-list-panel {
  width: 300px;
  border-right: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 右侧属性面板 */
.properties-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.properties-panel .panel-header {
  padding: var(--spacing-4) var(--spacing-6);
  border-bottom: 1px solid var(--color-border);
  background-color: var(--color-surface-hover);
}

.properties-panel .panel-header h4 {
  margin: 0;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

.properties-panel .panel-content {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-6);
}

/* 组件属性部分 */
.component-properties-section {
  margin-bottom: var(--spacing-6);
  padding: var(--spacing-4);
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
}

.component-properties-section h5 {
  margin: 0 0 var(--spacing-4) 0;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  border-bottom: 1px solid var(--color-border);
  padding-bottom: var(--spacing-2);
}

/* 属性列表 */
.property-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
}

/* 属性项 */
.property-item {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

/* 块级属性样式 */
.property-item.layout-block {
  flex-direction: column;
  gap: var(--spacing-2);
}

/* 行内属性样式 */
.property-item.layout-inline {
  flex-direction: row;
  align-items: center;
}

.property-item.layout-inline label {
  flex: 0 0 120px;
  margin-bottom: 0;
}

.property-item.layout-inline .property-control {
  flex: 1;
}

.property-item label {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
}

/* 修改后属性标题的样式 */
.property-item label.modified {
  color: var(--color-primary);
  font-weight: var(--font-weight-semibold);
}

.property-item.modified {
  border-left: 3px solid var(--color-primary);
  padding-left: calc(var(--spacing-2) - 3px);
}

.property-control {
  display: flex;
  align-items: center;
}

/* 单选按钮组样式 */
.toggle-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
  width: 100%;
}

.toggle-option {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  cursor: pointer;
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
}

.toggle-option input[type="radio"] {
  accent-color: var(--color-primary);
  width: 16px;
  height: 16px;
}

/* 下拉选择框样式 */
.property-select {
  width: 100%;
  padding: var(--spacing-2) var(--spacing-3);
  background-color: var(--color-surface-hover);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
  transition: all var(--transition-normal);
}

.property-select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(100, 108, 255, 0.2);
}

/* 复选框组样式 */
.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
  width: 100%;
}

.checkbox-option {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  cursor: pointer;
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
}

.checkbox-option input[type="checkbox"] {
  accent-color: var(--color-primary);
  width: 16px;
  height: 16px;
}

/* 文本输入框样式 */
.property-input {
  width: 100%;
  padding: var(--spacing-2) var(--spacing-3);
  background-color: var(--color-surface-hover);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
  transition: all var(--transition-normal);
}

.property-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(100, 108, 255, 0.2);
}

/* 无选择状态 */
.no-selection {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: var(--color-text-tertiary);
  font-size: var(--font-size-sm);
}

/* 无属性状态 */
.no-properties {
  padding: var(--spacing-4);
  text-align: center;
  color: var(--color-text-tertiary);
  font-size: var(--font-size-sm);
  background-color: var(--color-surface-hover);
  border-radius: var(--border-radius-md);
}

/* 组件选择器样式 */
.components-filter {
  padding: var(--spacing-4);
  border-bottom: 1px solid var(--color-border);
  background-color: var(--color-surface);
}

.search-box {
  position: relative;
  margin-bottom: var(--spacing-3);
}

.search-box Icon {
  position: absolute;
  left: var(--spacing-3);
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-tertiary);
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: var(--spacing-3) var(--spacing-3) var(--spacing-3) var(--spacing-10);
  background-color: var(--color-surface-hover);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
  transition: all var(--transition-normal);
}

.search-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(100, 108, 255, 0.2);
}

.components-list {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-4);
}

/* 分类文件夹样式 */
.category-folder {
  margin-bottom: var(--spacing-2);
  border-radius: var(--border-radius-md);
  overflow: hidden;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
}

.folder-header {
  display: flex;
  align-items: center;
  padding: var(--spacing-3);
  cursor: pointer;
  transition: all var(--transition-normal);
  background-color: var(--color-surface-hover);
  border-bottom: 1px solid var(--color-border);
}

.folder-header:hover {
  background-color: var(--color-surface-hover);
}

.folder-icon {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  color: var(--color-primary);
  margin-right: var(--spacing-2);
}

.folder-title {
  flex: 1;
  margin: 0;
  font-size: 0.625rem; /* 10px - 小2个字号 */
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

.component-count {
  font-size: 0.5rem; /* 8px - 小2个字号 */
  color: var(--color-text-tertiary);
  background-color: var(--color-surface);
  padding: 2px 8px;
  border-radius: var(--border-radius-full);
  border: 1px solid var(--color-border);
}

.folder-content {
  padding: var(--spacing-2);
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    max-height: 0;
  }
  to {
    opacity: 1;
    max-height: 500px;
  }
}

/* 组件项样式 */
.component-item {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-2);
  margin-bottom: var(--spacing-1);
  transition: all var(--transition-normal);
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  cursor: pointer;
}

.component-item:hover {
  background-color: var(--color-surface-hover);
  border-color: var(--color-primary);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(100, 108, 255, 0.15);
}

.component-item.selected {
  background-color: rgba(100, 108, 255, 0.1);
  border-color: var(--color-primary);
}

.component-icon {
  width: 40px;
  height: 40px;
  background-color: var(--color-surface-hover);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: var(--color-primary);
}

.component-info {
  flex: 1;
}

.component-info h4 {
  margin: 0 0 4px 0;
  font-size: 0.625rem; /* 10px - 小2个字号 */
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

.component-status {
  font-size: 0.5rem; /* 8px - 小2个字号 */
  padding: 2px 6px;
  border-radius: var(--border-radius-full);
  display: inline-block;
}

.component-status.enabled {
  background-color: rgba(16, 185, 129, 0.2);
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.5);
}

.component-toggle {
  margin-left: auto;
}

/* 锁定的切换开关样式 */
.toggle-switch.locked {
  position: relative;
}

.toggle-switch.locked input:disabled + .toggle-slider {
  background-color: var(--color-border);
  cursor: not-allowed;
}

.toggle-switch.locked input:disabled:checked + .toggle-slider {
  background-color: var(--color-primary);
  opacity: 0.7;
}

.lock-icon {
  position: absolute;
  right: -20px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-primary);
  font-size: 14px;
  cursor: not-allowed;
}

/* 按钮样式 */
.btn {
  padding: var(--spacing-2) var(--spacing-4);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  cursor: pointer;
  background: var(--color-surface);
  transition: all var(--transition-normal) ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-2);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
  box-shadow: var(--shadow-sm);
}

.btn:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.btn-primary {
  background: var(--color-primary);
  color: var(--color-text-primary);
  border-color: var(--color-primary);
}

.btn-primary:hover {
  background: var(--color-primary-hover);
  border-color: var(--color-primary-hover);
  box-shadow: var(--shadow-md);
}

.btn-outline {
  background: var(--color-surface);
  color: var(--color-text-secondary);
  border-color: var(--color-border);
}

.btn-outline:hover {
  color: var(--color-primary);
  border-color: var(--color-primary);
  background: rgba(100, 108, 255, 0.1);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .drawer {
    width: 100%;
  }
  
  .drawer-header,
  .drawer-body,
  .drawer-footer {
    padding: var(--spacing-4);
  }
  
  /* 小屏幕下改为垂直布局 */
  .split-layout {
    flex-direction: column;
  }
  
  .components-list-panel {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid var(--color-border);
    max-height: 400px;
  }
  
  .properties-panel {
    flex: 1;
  }
  
  .component-item {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-3);
  }
  
  .component-toggle {
    align-self: flex-end;
    margin-left: 0;
  }
}
</style>
