<template>
  <!-- 级联抽屉 - 组件选择器 -->
  <div 
    v-if="show" 
    class="drawer drawer-component-selector"
    :class="{ active: show }"
  >
    <!-- 视觉连接线 -->
    <div 
      v-if="editingOptionIndex >= 0" 
      class="connection-line"
      :style="{ top: `${editingOptionIndex * 85 + 120}px` }"
    ></div>
    <div class="drawer-header">
      <h3>组件选择 - {{ editingOptionLabel || `选项${editingOptionIndex + 1}` }}</h3>
    </div>
    <div class="drawer-body split-layout">
      <!-- 左侧组件列表 -->
      <div class="components-list-panel">
        <!-- 搜索框 -->
        <div class="components-filter">
          <div class="search-box">
            <el-icon :size="16"><Search /></el-icon>
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
                <el-icon :size="16">
                  <ArrowDown v-if="expandedCategories.has(category)" />
                  <ArrowRight v-else />
                </el-icon>
                <el-icon :size="16"><Folder /></el-icon>
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
                <div class="component-icon"><el-icon><Box /></el-icon></div>
                <div class="component-info" @click="toggleComponentSelection(component)">
                  <h4>{{ component.name }}</h4>
                  <div class="component-meta">
                    <div v-if="component.enabled" class="component-status enabled">
                      已启用
                    </div>
                    <span v-if="component.locked" class="lock-icon-inline">
                      <el-icon :size="12"><Lock /></el-icon>
                    </span>
                  </div>
                </div>
                <div class="component-toggle">
                  <label class="toggle-switch" :class="{ 'locked': component.locked }" @click.stop>
                    <input
                      type="checkbox"
                      v-model="component.enabled"
                      @change="toggleComponentStatus(component)"
                      :disabled="component.locked"
                    >
                    <span class="toggle-slider"></span>
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
          <div v-else class="properties-waterfall">
            <div 
              v-for="component in selectedComponents" 
              :key="component.id" 
              class="component-properties-card"
            >
              <div class="card-header">
                <div class="component-icon small"><el-icon><Box /></el-icon></div>
                <h5>{{ component.name }}</h5>
                <span v-if="component.enabled" class="status-badge enabled">已启用</span>
              </div>
              <div class="card-body">
                <div class="property-list" v-if="getComponentProperties(component.id).length > 0">
                  <div
                    v-for="property in getComponentProperties(component.id)"
                    :key="property.id"
                    :class="['property-item', property.layout === 'block' ? 'layout-block' : 'layout-inline', { 'modified': modifiedProperties.has(`${component.id}-${property.id}`), 'unchecked': !checkedProperties.has(`${component.id}-${property.id}`) }]"
                  >
                    <!-- 属性勾选框 -->
                    <label class="property-checkbox">
                      <input
                        type="checkbox"
                        :checked="checkedProperties.has(`${component.id}-${property.id}`)"
                        @change="togglePropertyCheck(component.id, property.id)"
                      >
                      <span class="checkmark"></span>
                    </label>
                    <label :class="{ 'modified': modifiedProperties.has(`${component.id}-${property.id}`) }">{{ property.name }}</label>
                    <div class="property-control">
                      <!-- 开关类型 -->
                      <label v-if="property.type === 'component_switch'" class="toggle-switch">
                        <input
                          type="checkbox"
                          :checked="component?.enabled || false"
                          :disabled="component?.locked || false || !checkedProperties.has(`${component.id}-${property.id}`)"
                          @change="e => {
                            if (!component?.locked && checkedProperties.has(`${component.id}-${property.id}`)) {
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
                          :disabled="!checkedProperties.has(`${component.id}-${property.id}`)"
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
                          :class="{ 'disabled': !checkedProperties.has(`${component.id}-${property.id}`) }"
                        >
                          <input
                            type="radio"
                            :name="`${component.id}-${property.id}`"
                            :value="option.value"
                            :checked="property.defaultValue === option.value"
                            :disabled="!checkedProperties.has(`${component.id}-${property.id}`)"
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
                        :disabled="!checkedProperties.has(`${component.id}-${property.id}`)"
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
                          :class="{ 'disabled': !checkedProperties.has(`${component.id}-${property.id}`) }"
                        >
                          <input
                            type="checkbox"
                            :value="option.value"
                            :checked="Array.isArray(property.defaultValue) ? property.defaultValue.includes(option.value) : property.defaultValue === option.value"
                            :disabled="!checkedProperties.has(`${component.id}-${property.id}`)"
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
                        :disabled="!checkedProperties.has(`${component.id}-${property.id}`)"
                        @input="e => updateComponentProperty(component, property.id, e.target.value)"
                      >
                    </div>
                  </div>
                </div>
                <div v-else class="no-properties">
                  <el-icon :size="24"><Box /></el-icon>
                  <p>该组件暂无属性</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="drawer-footer">
      <div class="footer-buttons">
        <button class="btn btn-outline" @click="handleClose">
          <el-icon :size="16"><Close /></el-icon>
          取消
        </button>
        <button class="btn btn-primary" @click="handleConfirm">
          <el-icon :size="16"><Check /></el-icon>
          确定
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { Search, ArrowDown, ArrowRight, Folder, Box, Lock, Close, Check } from '@element-plus/icons-vue'

/**
 * 组件选择器组件
 * 用于选择组件并配置其属性，支持搜索、分类、多选等功能
 * 
 * @author WEBconfig Team
 * @date 2026-03-09
 */

// 定义props
const props = defineProps({
  /**
   * 控制组件选择器显示/隐藏
   */
  show: {
    type: Boolean,
    default: false
  },
  /**
   * 组件列表数据
   */
  components: {
    type: Array,
    default: () => []
  },
  /**
   * 当前编辑的选项索引
   */
  editingOptionIndex: {
    type: Number,
    default: -1
  },
  /**
   * 当前编辑的选项标签
   */
  editingOptionLabel: {
    type: String,
    default: ''
  }
})

// 定义事件
const emit = defineEmits([
  /**
   * 关闭组件选择器
   */
  'close',
  /**
   * 确认选择，携带 selectedComponents 数据
   * @param {Array} selectedComponents - 选中的组件列表
   */
  'confirm',
  /**
   * 切换组件状态
   * @param {Object} component - 组件对象
   */
  'toggle-component-status',
  /**
   * 更新组件属性
   * @param {Object} component - 组件对象
   * @param {string} propertyId - 属性ID
   * @param {any} value - 新属性值
   */
  'update-component-property'
])

// 搜索关键词
const searchKeyword = ref('')
// 展开的分类集合
const expandedCategories = ref(new Set())
// 选中的组件列表
const selectedComponents = ref([])
// 修改过的属性集合
const modifiedProperties = ref(new Set())
// 已勾选的属性集合，格式: Set<`${componentId}-${propertyId}`>
const checkedProperties = ref(new Set())

/**
 * 计算属性：按分类分组的组件
 */
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
 * 监听组件选择器显示状态，自动展开所有分类
 */
watch(() => props.show, (newVal) => {
  if (newVal) {
    // 延迟执行，确保 groupedComponents 已计算
    setTimeout(() => {
      const categories = Object.keys(groupedComponents.value)
      expandedCategories.value = new Set(categories)
    }, 0)
  } else {
    // 关闭时清空选中状态
    selectedComponents.value = []
    modifiedProperties.value.clear()
    checkedProperties.value.clear()
    searchKeyword.value = ''
  }
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
  expandedCategories.value = new Set(expandedCategories.value)
}

/**
 * 切换组件选择状态
 * @param {object} component - 组件对象
 */
function toggleComponentSelection(component) {
  const index = selectedComponents.value.findIndex(c => c.id === component.id)
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
 * 切换属性勾选状态
 * @param {string} componentId - 组件ID
 * @param {string} propertyId - 属性ID
 */
function togglePropertyCheck(componentId, propertyId) {
  const key = `${componentId}-${propertyId}`
  if (checkedProperties.value.has(key)) {
    checkedProperties.value.delete(key)
  } else {
    checkedProperties.value.add(key)
  }
  checkedProperties.value = new Set(checkedProperties.value)
}

/**
 * 处理关闭事件
 */
function handleClose() {
  emit('close')
}

/**
 * 处理确认事件
 */
function handleConfirm() {
  emit('confirm', selectedComponents.value)
  modifiedProperties.value.clear()
  emit('close')
}
</script>

<style scoped>
/* 级联抽屉 - 组件选择器 */
.drawer.drawer-component-selector {
  position: absolute;
  top: 0;
  left: 100%;
  width: 750px;
  min-width: 750px;
  height: 100%;
  transform: translateX(-100%);
  opacity: 0;
  pointer-events: none;
  transition: transform var(--transition-normal) cubic-bezier(0.4, 0, 0.2, 1),
              opacity var(--transition-normal) ease;
  border-right: none;
  border-left: 1px solid var(--color-border);
  z-index: 1;
  background: var(--color-surface);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.drawer.drawer-component-selector.active {
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
  overflow-y: auto;
  background: var(--color-surface-hover);
}

.drawer-body::-webkit-scrollbar {
  width: 6px;
}

.drawer-body::-webkit-scrollbar-track {
  background: var(--color-surface-hover);
}

.drawer-body::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: var(--border-radius-full);
}

.drawer-body::-webkit-scrollbar-thumb:hover {
  background: var(--color-text-tertiary);
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

/* 视觉连接线 */
.connection-line {
  position: absolute;
  left: -40px;
  width: 40px;
  height: 2px;
  background: linear-gradient(to left, var(--color-primary), rgba(59, 130, 246, 0.3));
  z-index: 1002;
  transition: top var(--transition-normal) cubic-bezier(0.4, 0, 0.2, 1);
}

.connection-line::before {
  content: '';
  position: absolute;
  left: 0;
  top: -4px;
  width: 10px;
  height: 10px;
  background: var(--color-primary);
  border-radius: 50%;
  box-shadow: 0 0 8px rgba(59, 130, 246, 0.6);
}

/* 组件选择器样式 */
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

/* 属性面板瀑布流布局 */
.properties-waterfall {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--spacing-4);
  align-items: start;
}

/* 组件属性卡片 */
.component-properties-card {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-normal);
}

.component-properties-card:hover {
  box-shadow: var(--shadow-md);
  border-color: var(--color-primary);
}

.component-properties-card .card-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  padding: var(--spacing-3) var(--spacing-4);
  background-color: var(--color-surface-hover);
  border-bottom: 1px solid var(--color-border);
}

.component-properties-card .card-header h5 {
  margin: 0;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  flex: 1;
}

.component-properties-card .card-body {
  padding: var(--spacing-4);
}

.component-properties-card .component-icon.small {
  width: 28px;
  height: 28px;
  font-size: 14px;
}

.status-badge {
  font-size: var(--font-size-xs);
  padding: 2px 8px;
  border-radius: var(--border-radius-full);
  font-weight: var(--font-weight-medium);
}

.status-badge.enabled {
  background-color: rgba(16, 185, 129, 0.15);
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.3);
}

/* 组件选择复选框样式 */
.component-checkbox {
  position: relative;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  margin-right: var(--spacing-2);
}

.component-checkbox input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  width: 0;
  height: 0;
}

.component-checkbox .checkmark {
  width: 18px;
  height: 18px;
  background-color: var(--color-surface);
  border: 2px solid var(--color-border);
  border-radius: var(--border-radius-sm);
  transition: all var(--transition-normal);
  display: flex;
  align-items: center;
  justify-content: center;
}

.component-checkbox:hover .checkmark {
  border-color: var(--color-primary);
}

.component-checkbox input:checked ~ .checkmark {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
}

.component-checkbox .checkmark::after {
  content: '';
  width: 5px;
  height: 9px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg) scale(0);
  transition: transform var(--transition-normal);
}

.component-checkbox input:checked ~ .checkmark::after {
  transform: rotate(45deg) scale(1);
}

/* 组件项选中状态 */
.component-item.selected {
  background-color: rgba(59, 130, 246, 0.08);
  border-color: var(--color-primary);
}

.component-item.selected .component-info h4 {
  color: var(--color-primary);
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

/* 属性勾选框样式 */
.property-checkbox {
  position: relative;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  margin-right: var(--spacing-2);
}

.property-checkbox input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  width: 0;
  height: 0;
}

.property-checkbox .checkmark {
  width: 16px;
  height: 16px;
  background-color: var(--color-surface);
  border: 2px solid var(--color-border);
  border-radius: var(--border-radius-sm);
  transition: all var(--transition-normal);
  display: flex;
  align-items: center;
  justify-content: center;
}

.property-checkbox:hover .checkmark {
  border-color: var(--color-primary);
}

.property-checkbox input:checked ~ .checkmark {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
}

.property-checkbox .checkmark::after {
  content: '';
  width: 4px;
  height: 8px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg) scale(0);
  transition: transform var(--transition-normal);
}

.property-checkbox input:checked ~ .checkmark::after {
  transform: rotate(45deg) scale(1);
}

/* 未勾选状态的属性项样式 */
.property-item.unchecked {
  opacity: 0.7;
}

.property-item.unchecked label:not(.property-checkbox) {
  color: var(--color-text-tertiary);
}

/* 禁用的选项样式 */
.toggle-option.disabled,
.checkbox-option.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 禁用状态的控件样式 */
.property-control input:disabled,
.property-control select:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background-color: var(--color-surface-hover);
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
  margin-bottom: 0;
  margin-top: 6px;
  line-height: 1.4;
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

.search-box .el-icon {
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
  font-size: 0.625rem;
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

.component-count {
  font-size: 0.5rem;
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
  font-size: 0.625rem;
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

.component-status {
  font-size: 0.5rem;
  padding: 2px 6px;
  border-radius: var(--border-radius-full);
  display: inline-block;
}

.component-status.enabled {
  background-color: rgba(16, 185, 129, 0.2);
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.5);
}

/* 组件元信息容器 */
.component-meta {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  margin-top: 2px;
}

/* 行内锁定图标 */
.lock-icon-inline {
  color: var(--color-primary);
  font-size: 12px;
  display: inline-flex;
  align-items: center;
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

/* 切换开关样式 */
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 24px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--color-border);
  transition: 0.4s;
  border-radius: 24px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
}

.toggle-switch input:checked + .toggle-slider {
  background-color: var(--color-primary);
}

.toggle-switch input:checked + .toggle-slider:before {
  transform: translateX(16px);
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
  .drawer.drawer-component-selector {
    width: 100%;
    min-width: 100%;
  }
  
  .split-layout {
    flex-direction: column;
  }
  
  .components-list-panel {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid var(--color-border);
  }
}
</style>
