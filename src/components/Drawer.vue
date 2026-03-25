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
            placeholder="请输入元件名称"
          >
          <!-- 下拉带开关类型时显示默认勾选选项 -->
          <label v-if="editingComponent.type === 'select-switch'" class="switch-default-checkbox">
            <input 
              type="checkbox" 
              v-model="editingComponent.switchOn"
            >
            <span>默认勾选</span>
          </label>
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
                  <el-icon :size="14"><Rank /></el-icon>
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
                  <!-- <el-icon :size="12"><Setting /></el-icon> -->
                  规则 {{ option.componentId ? '1' : '0' }}
                </button>
                <button class="rule-tag delete-tag" @click="$emit('remove-option', index)">
                  <!-- <el-icon :size="12"><Close /></el-icon> -->
                  删除
                </button>
              </div>
            </div>
            
            <!-- 选项提示语行 -->
            <div class="option-hint-row">
              <div class="col-index"></div>
              <div class="col-hint">
                
                <input 
                  type="text" 
                  class="form-input hint-input" 
                  v-model="option.hint"
                  placeholder="请输入选项提示语"
                >
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
            <el-icon :size="14"><Plus /></el-icon>
            添加选项
          </button>
        </div>
      </div>
      <div class="drawer-footer">
        <div class="footer-buttons">
          <button class="btn btn-outline" @click="$emit('close-all-drawers')">
            <el-icon :size="16"><Close /></el-icon>
            放弃
          </button>
          <button class="btn btn-primary" @click="$emit('save-component-config')">
            <el-icon :size="16"><Check /></el-icon>
            保存
          </button>
        </div>
      </div>

      <!-- 级联抽屉 - 组件选择器 -->
      <ComponentSelector
        :show="showComponentSelector"
        :editing-option-index="editingOptionIndex"
        :editing-option-label="editingComponent?.options?.[editingOptionIndex]?.label"
        @close="$emit('close-component-selector')"
        @confirm="confirmComponentSelection"
        @toggle-component-status="toggleComponentStatus"
        @update-component-property="updateComponentProperty"
        @open-editor="handleOpenEditor"
      />
    </div>


  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Rank, Plus, Close, Check } from '@element-plus/icons-vue'
import ComponentSelector from './ComponentSelector.vue'

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
  'open-editor',
])

// 计算属性：是否显示选项配置抽屉
const isPropsDrawerActive = computed(() => {
  return props.activeDrawer === 'drawer-props'
})

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
 * 更新组件属性
 * @param {object} component - 组件对象
 * @param {string} propertyId - 属性ID
 * @param {any} value - 新属性值
 */
function updateComponentProperty(component, propertyId, value) {
  emit('update-component-property', component, propertyId, value)
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
 * @param {Array} selectedComponents - 选中的组件列表
 */
function confirmComponentSelection(selectedComponents) {
  emit('confirm-component-selection', selectedComponents)
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
    'select-multiple': '多选下拉',
    'select-switch': '下拉&开关'
  }
  return typeMap[type] || type
}

/**
 * 处理打开编辑器事件
 * @param {object} params - 编辑器参数
 * @param {string} params.editorType - 编辑器类型
 * @param {string} params.propertyKey - 属性键
 * @param {object} params.component - 组件对象
 * @param {object} params.property - 属性对象
 * @param {Function} params.callback - 回调函数
 */
function handleOpenEditor(params) {
  emit('open-editor', params)
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

/* 选项提示语行 */
.option-hint-row {
  display: flex;
  align-items: center;
  padding: var(--spacing-2) var(--spacing-6);
  border-top: 1px solid var(--color-border);
  background: var(--color-surface);
}

.option-hint-row .col-hint {
  margin-left: var(--spacing-3);
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  flex: 1;
  min-width: 0;
}

.hint-label {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  white-space: nowrap;
  flex-shrink: 0;
}

.hint-input {
  flex: 1;
  min-width: 0;
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

/* 下拉带开关的默认勾选样式 */
.switch-default-checkbox {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  margin-top: var(--spacing-3);
  padding: var(--spacing-2) var(--spacing-3);
  background: rgba(59, 130, 246, 0.05);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--transition-normal);
}

.switch-default-checkbox:hover {
  background: rgba(59, 130, 246, 0.1);
}

.switch-default-checkbox input[type="checkbox"] {
  accent-color: var(--color-primary);
  width: 16px;
  height: 16px;
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
  width: 90%;
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
  width: 90%;
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