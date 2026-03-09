<template>
  <div v-if="isPropsDrawerActive" class="drawer-container">
    <!-- 遮罩层 -->
    <div class="overlay" @click="$emit('close-all-drawers')"></div>

    <!-- 左侧抽屉 - 元件属性配置 -->
    <div class="drawer drawer-props" :class="{ active: activeDrawer === 'drawer-props' }">
      <div class="drawer-header">
        <h3>选项配置</h3>
      </div>
      <div class="drawer-body">
        <div v-if="editingComponent" class="component-title-section">
          <label class="form-label">{{ getComponentTypeText(editingComponent.type) }}组名称</label>
          <input 
            type="text" 
            class="form-input" 
            v-model="editingComponent.title"
            placeholder="请输入组件名称"
          >
        </div>

        <div class="options-section">
          <div class="options-table-header">
            <div class="col-index">#</div>
            <div class="col-label">选项名</div>
            <div class="col-value">赋值</div>
            <div class="col-action">操作</div>
          </div>

          <div
            v-for="(option, index) in editingComponent.options"
            :key="option.id || index"
            class="option-wrapper"
            :class="{ editing: showComponentSelector && editingOptionIndex === index, dragging: dragIndex === index }"
            draggable="true"
            @dragstart="handleDragStart($event, index)"
            @dragover="handleDragOver($event, index)"
            @drop="handleDrop($event, index)"
            @dragend="handleDragEnd"
          >
            <!-- 选项行 -->
            <div class="option-item">
              <div class="col-index">
                <span class="drag-handle" title="拖动排序">
                  <Icon name="grip-vertical" size="14" />
                </span>
                {{ index + 1 }}
              </div>
              <div class="col-label">
                <input 
                  type="text" 
                  class="form-input" 
                  v-model="option.label"
                  placeholder="请输入选项名称"
                >
              </div>
              <div class="col-value">
                <input 
                  type="text" 
                  class="form-input" 
                  v-model="option.value"
                  placeholder="值"
                  style="width: 40px; flex:none;"
                >
              </div>
              <div class="col-action">
                <button 
                  class="rule-tag" 
                  :class="{ active: showComponentSelector && editingOptionIndex === index }"
                  @click="$emit('open-component-selector', index)"
                >
                  <!-- <Icon name="setting" size="12" /> -->
                  规则 {{ option.componentId ? '1' : '0' }}
                </button>
                <button class="rule-tag delete-tag" @click="$emit('remove-option', index)">
                  <!-- <Icon name="x" size="12" /> -->
                  删除
                </button>
              </div>
            </div>
            
            <!-- 选项行下方的默认选中 -->
            <div class="option-default-row">
              <div class="col-index"></div>
              <div class="col-label">
                <label class="default-checkbox">
                  <input 
                    type="checkbox" 
                    v-model="option.isDefault"
                  > 
                  <span>默认选中</span>
                </label>
              </div>
              <div class="col-value"></div>
              <div class="col-action"></div>
            </div>
          </div>
          
         
          <button class="btn btn-outline btn-block add-option-btn" @click="$emit('add-option')">
            <Icon name="plus" size="14" />
            添加选项
          </button>
        </div>
      </div>
      <div class="drawer-footer">
        <div class="footer-buttons">
          <button class="btn btn-outline" @click="$emit('close-all-drawers')">
            <Icon name="close" size="16" />
            放弃
          </button>
          <button class="btn btn-primary" @click="$emit('save-component-config')">
            <Icon name="check" size="16" />
            保存
          </button>
        </div>
      </div>

      <!-- 级联抽屉 - 组件选择器 -->
      <div 
        v-if="showComponentSelector" 
        class="drawer drawer-component-selector"
        :class="{ active: showComponentSelector }"
      >
        <!-- 视觉连接线 -->
        <div 
          v-if="editingOptionIndex >= 0" 
          class="connection-line"
          :style="{ top: `${editingOptionIndex * 85 + 120}px` }"
        ></div>
        <div class="drawer-header">
          <h3>组件选择 - {{ editingComponent?.options?.[editingOptionIndex]?.label || `选项${editingOptionIndex + 1}` }}</h3>
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
                  <div class="component-icon"><Icon name="box" /></div>
                  <div class="component-info" @click="toggleComponentSelection(component)">
                    <h4>{{ component.name }}</h4>
                    <div class="component-meta">
                      <div v-if="component.enabled" class="component-status enabled">
                        已启用
                      </div>
                      <span v-if="component.locked" class="lock-icon-inline">
                        <Icon name="lock" size="12" />
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
                    <div class="component-icon small"><Icon name="box" /></div>
                    <h5>{{ component.name }}</h5>
                    <span v-if="component.enabled" class="status-badge enabled">已启用</span>
                  </div>
                  <div class="card-body">
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
                      <Icon name="box" size="24" />
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
            <button class="btn btn-outline" @click="$emit('close-component-selector')">
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


  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import Icon from './Icon.vue'

// 定义props
const props = defineProps({
  activeDrawer: {
    type: String,
    default: ''
  },
  editingComponent: {
    type: Object,
    default: null
  },
  showComponentSelector: {
    type: Boolean,
    default: false
  },
  components: {
    type: Array,
    default: () => []
  },
  editingOptionIndex: {
    type: Number,
    default: -1
  },
})

// 定义事件
const emit = defineEmits([
  'close-all-drawers',
  'add-option',
  'remove-option',
  'save-component-config',
  'open-advanced-rules',
  'open-component-selector',
  'close-component-selector',
  'confirm-component-selection',
  'toggle-component-status',
  'update-component-property',
  'reorder-options',
])

// 计算属性：是否显示选项配置抽屉
const isPropsDrawerActive = computed(() => {
  return props.activeDrawer === 'drawer-props'
})

// 组件选择器相关
const searchKeyword = ref('')
const expandedCategories = ref(new Set())
const selectedComponents = ref([])
const modifiedProperties = ref(new Set())

// 拖动排序相关
const dragIndex = ref(-1)
const dragOverIndex = ref(-1)

/**
 * 处理拖动开始事件
 * @param {DragEvent} event - 拖动事件对象
 * @param {number} index - 拖动的选项索引
 */
function handleDragStart(event, index) {
  dragIndex.value = index
  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.setData('text/plain', index.toString())
  // 添加拖动时的样式
  event.target.classList.add('dragging')
}

/**
 * 处理拖动经过事件
 * @param {DragEvent} event - 拖动事件对象
 * @param {number} index - 经过的选项索引
 */
function handleDragOver(event, index) {
  event.preventDefault()
  event.dataTransfer.dropEffect = 'move'

  if (dragIndex.value === -1 || dragIndex.value === index) {
    return
  }

  dragOverIndex.value = index
}

/**
 * 处理放置事件
 * @param {DragEvent} event - 拖动事件对象
 * @param {number} index - 放置位置的选项索引
 */
function handleDrop(event, index) {
  event.preventDefault()

  const fromIndex = parseInt(event.dataTransfer.getData('text/plain'))
  const toIndex = index

  if (fromIndex === toIndex || isNaN(fromIndex)) {
    return
  }

  // 触发重新排序事件
  emit('reorder-options', fromIndex, toIndex)
}

/**
 * 处理拖动结束事件
 */
function handleDragEnd() {
  dragIndex.value = -1
  dragOverIndex.value = -1
}

/**
 * 监听组件选择器显示状态，自动展开所有分类
 */
watch(() => props.showComponentSelector, (newVal) => {
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
  }
})

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
 * 确认组件选择
 */
function confirmComponentSelection() {
  emit('confirm-component-selection', selectedComponents.value)
  modifiedProperties.value.clear()
  emit('close-component-selector')
}

/**
 * 获取组件类型文本
 * @param {string} type - 组件类型
 * @returns {string} 组件类型的中文描述
 */
function getComponentTypeText(type) {
  const typeMap = {
    'radio': '单选',
    'checkbox': '复选',
    'select': '下拉列表',
    'select-switch': '下拉&开关'
  }
  return typeMap[type] || type
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

/* 选项配置抽屉 - 宽度占屏幕30%，最小宽度500px */
.drawer.drawer-props {
  width: 30vw;
  min-width: 500px;
}

/* 选项配置抽屉需要包含级联抽屉 */
.drawer.drawer-props {
  width: 30vw;
  min-width: 500px;
  position: relative;
  overflow: visible;
}

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
}

.drawer.drawer-component-selector.active {
  transform: translateX(0);
  opacity: 1;
  pointer-events: auto;
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

.action-btn {
  background: none;
  border: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  padding: var(--spacing-2);
  border-radius: var(--border-radius-md);
  transition: all var(--transition-normal);
  display: flex;
  align-items: center;
  gap: var(--spacing-1);
  font-size: var(--font-size-sm);
}

.action-btn:hover {
  color: var(--color-primary);
  background: rgba(100, 108, 255, 0.1);
}

.header-placeholder {
  width: 80px;
}

.drawer-body {
  flex: 1;
  padding: var(--spacing-6);
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

/* 选项包装器 */
.option-wrapper {
  margin-bottom: var(--spacing-3);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  overflow: hidden;
  transition: all var(--transition-normal) ease;
  cursor: move;
}

/* 编辑中状态的选项包装器 */
.option-wrapper.editing {
  border-color: var(--color-primary);
  background: rgba(59, 130, 246, 0.08);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2), 0 4px 12px rgba(59, 130, 246, 0.15);
  position: relative;
  z-index: 1;
}

/* 拖动中的选项样式 */
.option-wrapper.dragging {
  opacity: 0.5;
  transform: scale(0.98);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

/* 拖动时的视觉反馈 */
.option-wrapper[draggable="true"]:hover {
  border-color: var(--color-primary);
}

/* 拖动把手样式 */
.drag-handle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-right: var(--spacing-2);
  padding: var(--spacing-1);
  color: var(--color-text-tertiary);
  cursor: grab;
  border-radius: var(--border-radius-sm);
  transition: all var(--transition-normal) ease;
}

.drag-handle:hover {
  color: var(--color-primary);
  background: rgba(59, 130, 246, 0.1);
}

.drag-handle:active {
  cursor: grabbing;
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

/* 选项默认行 */
.option-default-row {
  display: flex;
  align-items: center;
  padding: var(--spacing-2) var(--spacing-6);
  border-top: 1px solid var(--color-border);
  background: rgba(100, 108, 255, 0.1);
}

.option-default-row .col-label {
  margin-left: var(--spacing-3);
}

/* 通用样式 */
.section-title {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-4);
}

.section-subtitle {
  font-size: var(--font-size-sm);
  color: var(--color-text-tertiary);
  margin-bottom: var(--spacing-6);
}

/* 表单样式 */
.component-title-section {
  margin-bottom: var(--spacing-6);
  padding: var(--spacing-4);
  background: var(--color-surface);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-border);
}

.form-label {
  display: block;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-2);
}

.form-input {
  width: 100%;
  padding: var(--spacing-2) var(--spacing-3);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
  transition: all var(--transition-normal) ease;
  background: var(--color-surface-hover);
}

.form-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(100, 108, 255, 0.2);
}

/* 选项配置部分 */
.options-section {
  background: var(--color-surface);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  border: 1px solid var(--color-border);
}

.section-header {
  padding: var(--spacing-4) var(--spacing-6);
  border-bottom: 1px solid var(--color-border);
  background: var(--color-surface);
}

.section-header .section-title {
  margin-bottom: var(--spacing-1);
}

.options-table-header {
  display: flex;
  padding: var(--spacing-3) var(--spacing-6);
  background: var(--color-surface-hover);
  border-bottom: 1px solid var(--color-border);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-tertiary);
}

.col-index {
  width: 40px;
  flex-shrink: 0;
}

.col-label {
  flex: 1;
  margin-left: var(--spacing-3);
}

.col-value {
  width: 100px;
  flex-shrink: 0;
  margin-left: var(--spacing-3);
}

.col-action {
  width: 120px;
  flex-shrink: 0;
  margin-left: var(--spacing-3);
  display: flex;
  gap: var(--spacing-2);
  align-items: center;
  justify-content: flex-end;
}

.option-item {
  display: flex;
  padding: var(--spacing-4) var(--spacing-6);
  transition: all var(--transition-normal) ease;
}

.option-item:hover {
  background: rgba(100, 108, 255, 0.1);
}

.option-item .col-index {
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-secondary);
  display: flex;
  align-items: center;
}

.option-item .col-label .form-input,
.option-item .col-value .form-input {
  width: 100%;
}

.default-option-section {
  padding: var(--spacing-2) var(--spacing-6) var(--spacing-3);
  border-bottom: 1px solid var(--color-border);
  margin-left: 25px;
  font-size: 10px;
}

.default-checkbox {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  cursor: pointer;
}

.default-checkbox input[type="checkbox"] {
  accent-color: var(--color-primary);
  width: 14px;
  height: 14px;
}

.rule-tag {
  background: #3b82f6;
  color: #ffffff;
  border: none;
  padding: var(--spacing-1) var(--spacing-2);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-xs);
  cursor: pointer;
  transition: all var(--transition-normal) ease;
  display: flex;
  align-items: center;
  gap: var(--spacing-1);
}

.rule-tag:hover {
  background: #2563eb;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.4);
}

.rule-tag.active {
  background: #1d4ed8;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3), 0 4px 12px rgba(59, 130, 246, 0.5);
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3), 0 4px 12px rgba(59, 130, 246, 0.5);
  }
  50% {
    box-shadow: 0 0 0 6px rgba(59, 130, 246, 0.2), 0 6px 16px rgba(59, 130, 246, 0.6);
  }
}

.delete-tag {
  background: #ef4444;
  color: #ffffff;
  margin-left: var(--spacing-2);
}

.delete-tag:hover {
  background: #dc2626;
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.4);
}

.add-option-btn {
  margin: var(--spacing-6);
  border: 2px dashed var(--color-border);
  background: var(--color-surface-hover);
  color: var(--color-text-secondary);
  transition: all var(--transition-normal) ease;
}

.add-option-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background: rgba(100, 108, 255, 0.1);
  transform: translateY(-1px);
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

.btn-block {
  width: 100%;
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

/* 旧的样式保留兼容 */
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
  
  .option-item {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-3);
  }
  
  .option-item .col-label,
  .option-item .col-value,
  .option-item .col-action {
    width: 100%;
    margin-left: 0;
  }
  
  .options-table-header {
    display: none;
  }
}
</style>