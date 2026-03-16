<template>
  <div class="group-manager">
    <div class="section-header">
      <div class="header-content">
        <h3>自定义分组</h3>
        <p class="section-description">配置创房面板的分组与选项</p>
      </div>
      <button class="action-btn" @click="$emit('show-add-group-modal')">
        <el-icon :size="16" color="#409eff"><Plus /></el-icon>
        添加分组
      </button>
    </div>
    
    <!-- 动态添加的分组容器 -->
    <div id="groups-container">
      <div 
        v-for="(group, index) in groups" 
        :key="group.id"
        class="group-box"
      >
        <div class="group-header">
          <!-- 分组拖拽手柄 -->
          <div class="group-drag-handle" title="拖拽排序分组">
            <el-icon :size="18"><Rank /></el-icon>
          </div>
          <div class="group-info-wrapper">
            <div class="group-name-wrapper">
              <span class="group-name" @click="$emit('edit-group', group)">{{ group.name }}</span>
            </div>
          </div>
          <div class="group-header-right">
            <el-icon :size="18" class="header-action-icon" @click="$emit('edit-group', group)" title="编辑分组"><Setting /></el-icon>
            <el-icon :size="18" class="header-action-icon delete-icon" @click="handleDeleteGroup(group)" title="删除分组"><Delete /></el-icon>
          </div>
        </div>
        <div class="group-content">
          <div v-if="group.components.length === 0" class="empty-state">
            <el-icon :size="32" class="empty-icon"><Box /></el-icon>
            <p>暂无选项组，点击下方添加</p>
          </div>
          <div
            v-for="(component, compIndex) in group.components"
            :key="component.id"
            class="dynamic-comp"
            @click="$emit('open-drawer', 'drawer-props', group.id, component.id)"
          >
            <div class="comp-preview">
              <!-- 拖拽手柄图标 -->
              <div class="drag-handle" title="拖拽排序">
                <el-icon :size="16"><Rank /></el-icon>
              </div>
              <div class="comp-title-section">
                <div class="comp-title">
                  <span class="comp-type-tag" :class="component.type">{{ getComponentTypeText(component.type) }}</span>
                  {{ component.title }}
                </div>
              </div>

              <!-- Radio 单选样式 -->
              <div
                v-if="component.type === 'radio'"
                class="comp-options"
                :style="{ gridTemplateColumns: 'repeat(' + (group.columns || 4) + ', 1fr)' }"
              >
                <label
                  v-for="(option, optIndex) in component.options"
                  :key="optIndex"
                  class="radio-option"
                  :class="{ 'is-default': option.isDefault }"
                >
                  <input
                    type="radio"
                    :name="component.id"
                    :checked="option.isDefault"
                    disabled
                  >
                  <span class="option-text">{{ option.label }}</span>
                  <span v-if="option.score !== undefined" class="option-score">{{ option.score }}分</span>
                  <span v-else-if="option.isDefault" class="default-badge">默认</span>
                </label>
              </div>

              <!-- Checkbox 复选样式 -->
              <div
                v-else-if="component.type === 'checkbox'"
                class="comp-options checkbox-options"
                :style="{ gridTemplateColumns: 'repeat(' + (group.columns || 4) + ', 1fr)' }"
              >
                <label
                  v-for="(option, optIndex) in component.options"
                  :key="optIndex"
                  class="checkbox-option"
                  :class="{ 'is-checked': option.checked !== false }"
                >
                  <input
                    type="checkbox"
                    :checked="option.checked !== false"
                    disabled
                  >
                  <span class="option-text">{{ option.label }}</span>
                </label>
              </div>

              <!-- Select 下拉列表样式 -->
              <div
                v-else-if="component.type === 'select'"
                class="comp-options select-options"
              >
                <div class="select-preview">
                  <span class="select-label">{{ component.options.find(o => o.isDefault)?.label || component.options[0]?.label || '请选择' }}</span>
                  <el-icon :size="12" class="select-arrow"><CaretRight /></el-icon>
                </div>
              </div>

              <!-- Select-Multiple 多选下拉列表样式 -->
              <div
                v-else-if="component.type === 'select-multiple'"
                class="comp-options select-multiple-options"
              >
                <div class="select-multiple-preview">
                  <span class="select-multiple-label">多选列表</span>
                  <div class="selected-items">
                    <span
                      v-for="(option, optIndex) in component.options.filter(o => o.isDefault)"
                      :key="optIndex"
                      class="selected-tag"
                    >
                      {{ option.label }}
                    </span>
                    <span v-if="!component.options.some(o => o.isDefault)" class="no-selection">请选择</span>
                  </div>
                  <el-icon :size="12" class="select-arrow"><CaretRight /></el-icon>
                </div>
              </div>

              <!-- Select-Switch 下拉&开关样式 -->
              <div
                v-else-if="component.type === 'select-switch'"
                class="comp-options select-switch-options"
              >
                <div class="select-switch-preview">
                  <label class="switch-checkbox-part">
                    <input
                      type="checkbox"
                      :checked="component.switchOn !== false"
                      disabled
                    >
                    <span class="switch-checkbox-label">{{component.title}}</span>
                  </label>
                  <div class="select-part">
                    <span class="select-label">{{ component.options.find(o => o.isDefault)?.label || component.options[0]?.label || '请选择' }}</span>
                    <el-icon :size="12" class="select-arrow"><CaretRight /></el-icon>
                  </div>
                </div>
              </div>

              <!-- 默认样式（兼容旧数据） -->
              <div
                v-else
                class="comp-options"
                :style="{ gridTemplateColumns: 'repeat(' + (group.columns || 4) + ', 1fr)' }"
              >
                <label
                  v-for="(option, optIndex) in component.options"
                  :key="optIndex"
                  class="radio-option"
                >
                  <input
                    type="radio"
                    :name="component.id"
                    :checked="option.isDefault"
                    disabled
                  >
                  <span class="option-text">{{ option.label }}</span>
                  <span v-if="option.isDefault" class="default-badge">默认</span>
                </label>
              </div>
            </div>
            <button class="comp-action" @click.stop="$emit('open-drawer', 'drawer-props', group.id, component.id)" title="编辑组件">
              <el-icon :size="16"><Setting /></el-icon>
            </button>
          </div>
        </div>
        <div class="group-footer">
          <button class="btn add-comp-btn" @click="$emit('add-component', group.id, 'radio')">
            <el-icon :size="14"><CircleCheck /></el-icon>
            单选
          </button>
          <button class="btn add-comp-btn" @click="$emit('add-component', group.id, 'checkbox')">
            <el-icon :size="14"><Checked /></el-icon>
            复选
          </button>
          <button class="btn add-comp-btn" @click="$emit('add-component', group.id, 'select')">
            <el-icon :size="14"><ArrowDown /></el-icon>
            下拉列表
          </button>
          <button class="btn add-comp-btn" @click="$emit('add-component', group.id, 'select-switch')">
            <el-icon :size="14"><Checked /></el-icon>
            <el-icon :size="14"><ArrowDown /></el-icon>
            下拉列表&开关
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessageBox } from 'element-plus'
import { Plus, Edit, Box, Setting, CircleCheck, Checked, ArrowDown, Switch, Close, Rank, Delete, CaretRight } from '@element-plus/icons-vue'

// 定义props
const props = defineProps({
  groups: {
    type: Array,
    required: true
  }
})

// 定义事件
const emit = defineEmits([
  'edit-group',
  'add-component',
  'open-drawer',
  'show-add-group-modal',
  'update:group-description',
  'delete-group'
])

// 编辑中的分组说明
const editingDescriptionId = ref(null)
const editingDescriptionValue = ref('')

/**
 * 开始编辑分组说明
 * @param {Object} group - 分组对象
 * 关联需求：分组管理 - 编辑分组说明
 */
function startEditDescription(group) {
  editingDescriptionId.value = group.id
  editingDescriptionValue.value = group.description || ''
}

/**
 * 保存分组说明
 * @param {Object} group - 分组对象
 * 关联需求：分组管理 - 保存分组说明
 */
function saveDescription(group) {
  emit('update:group-description', group.id, editingDescriptionValue.value.trim())
  editingDescriptionId.value = null
  editingDescriptionValue.value = ''
}

/**
 * 取消编辑分组说明
 * 关联需求：分组管理 - 取消编辑分组说明
 */
function cancelEditDescription() {
  editingDescriptionId.value = null
  editingDescriptionValue.value = ''
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
 * 处理删除分组
 * @param {Object} group - 分组对象
 * 关联需求：分组管理 - 删除分组（带二次确认）
 */
function handleDeleteGroup(group) {
  ElMessageBox.confirm(
    `确定要删除分组 "${group.name}" 吗？此操作不可恢复。`,
    '删除确认',
    {
      confirmButtonText: '确定删除',
      cancelButtonText: '取消',
      type: 'warning',
      confirmButtonClass: 'el-button--danger'
    }
  ).then(() => {
    emit('delete-group', group.id)
  }).catch(() => {
    // 用户取消删除，不做任何操作
  })
}
</script>

<style scoped>
.group-manager {
  margin-top: var(--spacing-6);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-6);
  gap: var(--spacing-4);
}

.header-content {
  flex: 1;
}

.section-header h3 {
  margin: 0 0 var(--spacing-1) 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.section-description {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--color-text-tertiary);
}

.action-btn {
  cursor: pointer;
  font-size: var(--font-size-sm);
  background: var(--color-primary);
  color: var(--color-text-primary);
  border: 1px solid var(--color-primary);
  display: flex;
  align-items: center;
  gap: var(--spacing-1);
  padding: var(--spacing-2) var(--spacing-4);
  border-radius: var(--border-radius-md);
  transition: all var(--transition-normal);
  font-weight: var(--font-weight-medium);
  white-space: nowrap;
  margin-top: -4px;
}

.action-btn:hover {
  background: var(--color-primary-hover);
  border-color: var(--color-primary-hover);
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

/* 分组样式 */
.group-box {
  background: var(--color-surface);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-sm);
  padding: var(--spacing-4);
  margin-top: var(--spacing-6);
  transition: all var(--transition-normal);
  border: 1px solid var(--color-border);
}

.group-box:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
  border-color: var(--color-primary);
}

.group-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-4);
  padding-bottom: var(--spacing-3);
  border-bottom: 2px solid var(--color-primary);
  gap: var(--spacing-3);
}

/* 分组拖拽手柄样式 */
.group-drag-handle {
  cursor: grab;
  color: var(--color-text-tertiary);
  padding: var(--spacing-2);
  border-radius: var(--border-radius-md);
  transition: all var(--transition-normal);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.group-drag-handle:hover {
  color: var(--color-primary);
  background: rgba(100, 108, 255, 0.1);
}

.group-drag-handle:active {
  cursor: grabbing;
}

.group-info-wrapper {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-1);
  flex: 1;
}

.group-name-wrapper {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  cursor: pointer;
  padding: var(--spacing-1) var(--spacing-2);
  border-radius: var(--border-radius-md);
  transition: all var(--transition-normal);
}



.group-name-wrapper:hover .group-name {
  color: var(--color-primary);
}

.group-name-wrapper:hover .edit-icon {
  color: var(--color-primary);
  opacity: 1;
}

.group-name {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  transition: all var(--transition-normal);
}

/* 头部操作图标样式 */
.group-header-right {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
}

.group-header-right .header-action-icon {
  cursor: pointer;
  transition: all var(--transition-normal);
  padding: var(--spacing-2);
  border-radius: var(--border-radius-md);
}

.group-header-right .header-action-icon {
  color: var(--color-text-tertiary);
  width: 18px;
  height: 18px;
}

.group-header-right .header-action-icon :deep(svg) {
  width: 18px !important;
  height: 18px !important;
}

.group-header-right .header-action-icon:hover,
.group-header-right .header-action-icon:hover :deep(.el-icon) {
  color: var(--color-primary);
}

.group-header-right .header-action-icon:hover {
  background: rgba(100, 108, 255, 0.1);
}

.group-header-right .header-action-icon.delete-icon:hover,
.group-header-right .header-action-icon.delete-icon:hover :deep(.el-icon) {
  color: var(--color-danger);
}

.group-header-right .header-action-icon.delete-icon:hover {
  background: rgba(239, 68, 68, 0.1);
}

/* 分组说明样式 */
.group-description-wrapper {
  padding: 0 var(--spacing-2);
}

.description-display {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  cursor: pointer;
  padding: var(--spacing-1) var(--spacing-2);
  border-radius: var(--border-radius-md);
  transition: all var(--transition-normal);
  min-height: 24px;
}

.description-display:hover {
  background: rgba(100, 108, 255, 0.05);
}

.description-display:hover .description-edit-icon {
  opacity: 1;
  color: var(--color-primary);
}

.description-text {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.description-placeholder {
  font-size: var(--font-size-sm);
  color: var(--color-text-tertiary);
  font-style: italic;
}

.description-edit-icon {
  color: var(--color-text-tertiary);
  opacity: 0;
  transition: all var(--transition-normal);
}

.description-edit {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
}

.description-input {
  flex: 1;
  max-width: 300px;
  padding: var(--spacing-1) var(--spacing-3);
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
  background: var(--color-surface);
  border: 1px solid var(--color-primary);
  border-radius: var(--border-radius-md);
  outline: none;
  transition: all var(--transition-fast);
}

.description-input:focus {
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

.description-actions {
  display: flex;
  gap: var(--spacing-1);
}

.desc-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: none;
  border-radius: var(--border-radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
  padding: 0;
}

.desc-btn.save {
  background: var(--color-success);
  color: white;
}

.desc-btn.save:hover {
  background: var(--color-success-hover);
}

.desc-btn.cancel {
  background: var(--color-surface-hover);
  color: var(--color-text-secondary);
}

.desc-btn.cancel:hover {
  background: var(--color-border);
  color: var(--color-text-primary);
}

.columns-select {
  height: 28px;
  padding: 0 var(--spacing-2);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  cursor: pointer;
  outline: none;
  transition: all var(--transition-normal);
}

.columns-select:hover {
  border-color: var(--color-primary);
}

.columns-select:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

.group-actions {
  display: flex;
  gap: var(--spacing-1);
}

.action-icon {
  color: var(--color-text-tertiary);
  cursor: pointer;
  transition: all var(--transition-normal);
  padding: var(--spacing-1);
  border-radius: var(--border-radius-md);
}

.action-icon:hover {
  color: var(--color-primary);
  background: rgba(100, 108, 255, 0.1);
}

.group-content {
  min-height: 80px;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
  margin-bottom: var(--spacing-4);
}

/* 空状态 */
.empty-state {
  height: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-6) var(--spacing-4);
  background: var(--color-surface-hover);
  border-radius: var(--border-radius-md);
  border: 2px dashed var(--color-border);
  transition: all var(--transition-normal);
}

.empty-state:hover {
  border-color: var(--color-primary);
  background: rgba(100, 108, 255, 0.1);
}

.empty-icon {
  color: var(--color-text-tertiary);
  margin-bottom: var(--spacing-3);
  transition: all var(--transition-normal);
}

.empty-state:hover .empty-icon {
  color: var(--color-primary);
  transform: scale(1.1);
}

.empty-state p {
  margin: 0;
  color: var(--color-text-tertiary);
  font-size: var(--font-size-sm);
}

/* 动态组件样式 */
.dynamic-comp {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  padding: var(--spacing-4);
  border-radius: var(--border-radius-md);
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all var(--transition-normal);
  position: relative;
  overflow: hidden;
}

.dynamic-comp:hover {
  background: rgba(100, 108, 255, 0.1);
  border-color: var(--color-primary);
  box-shadow: var(--shadow-sm);
}

.comp-preview {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--spacing-4);
  flex: 1;
  overflow: hidden;
}

/* 拖拽手柄样式 */
.drag-handle {
  cursor: grab;
  color: var(--color-text-tertiary);
  padding: var(--spacing-2);
  border-radius: var(--border-radius-md);
  transition: all var(--transition-normal);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.drag-handle:hover {
  color: var(--color-primary);
  background: rgba(100, 108, 255, 0.1);
}

.drag-handle:active {
  cursor: grabbing;
}

.comp-title-section {
  margin-bottom: 0;
}

.comp-title {
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
}

/**
 * 组件类型标签样式
 * 显示在组件标题旁，标识组件类型
 */
.comp-type-tag {
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: var(--font-weight-medium);
  background: var(--color-surface-hover);
  color: var(--color-text-secondary);
}

.comp-type-tag.radio {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.comp-type-tag.checkbox {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.comp-type-tag.select {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.comp-type-tag.select-multiple {
  background: rgba(236, 72, 153, 0.1);
  color: #ec4899;
}

.comp-type-tag.select-switch {
  background: rgba(139, 92, 246, 0.1);
  color: #8b5cf6;
}

/**
 * 组件选项网格布局容器
 * 使用CSS Grid布局实现选项的网格展示
 * 根据group.columns动态设置列数（默认为4列）
 */
.comp-options {
  display: grid;
  gap: var(--spacing-3);
  flex: 1;
  align-items: start;
}

/**
 * 单选选项样式
 * 在网格布局中均匀分布，保持一致的间距和对齐
 */
.radio-option {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  cursor: default;
  padding: var(--spacing-2) var(--spacing-3);
  border-radius: var(--border-radius-md);
  transition: all var(--transition-normal);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  min-width: 0; /* 允许在网格中收缩 */
  overflow: hidden; /* 防止内容溢出 */
}

.radio-option input[type="radio"] {
  accent-color: var(--color-primary);
  width: 16px;
  height: 16px;
}

.option-text {
  user-select: none;
}

.default-badge {
  background: #52c41a;
  color: white;
  font-size: 9px;
  padding: 1px 4px;
  border-radius: 8px;
  font-weight: var(--font-weight-medium);
  margin-left: var(--spacing-1);
}

/**
 * 选项分值样式
 * 显示在单选选项右侧，如"1分"
 */
.option-score {
  color: var(--color-text-tertiary);
  font-size: var(--font-size-xs);
  margin-left: auto;
  padding-left: var(--spacing-2);
}

/**
 * 单选选项默认选中状态样式
 */
.radio-option.is-default {
  color: #dc2626;
}

.radio-option.is-default .option-text {
  color: #dc2626;
  font-weight: var(--font-weight-medium);
}

/**
 * Checkbox 复选选项样式
 */
.checkbox-options {
  display: grid;
  gap: var(--spacing-3);
  flex: 1;
  align-items: start;
}

.checkbox-option {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  cursor: default;
  padding: var(--spacing-2) var(--spacing-3);
  border-radius: var(--border-radius-md);
  transition: all var(--transition-normal);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  min-width: 0;
  overflow: hidden;
}

.checkbox-option input[type="checkbox"] {
  accent-color: var(--color-primary);
  width: 16px;
  height: 16px;
}

.checkbox-option.is-checked {
  color: #dc2626;
}

.checkbox-option.is-checked .option-text {
  color: #dc2626;
  font-weight: var(--font-weight-medium);
}

/**
 * Select 下拉列表预览样式
 */
.select-options {
  flex: 1;
}

.select-preview {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-2) var(--spacing-3);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  min-width: 120px;
  max-width: 200px;
}

.select-label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.select-arrow {
  color: var(--color-text-tertiary);
  transform: rotate(90deg);
}

/**
 * Select-Multiple 多选下拉列表预览样式
 */
.select-multiple-options {
  flex: 1;
}

.select-multiple-preview {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  padding: var(--spacing-2) var(--spacing-3);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
  min-width: 200px;
  max-width: 400px;
}

.select-multiple-label {
  color: var(--color-text-tertiary);
  white-space: nowrap;
}

.selected-items {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-1);
  flex: 1;
}

.selected-tag {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: var(--font-weight-medium);
}

.no-selection {
  color: var(--color-text-tertiary);
  font-style: italic;
}

/**
 * Select-Switch 下拉&开关预览样式
 */
.select-switch-options {
  flex: 1;
}

.select-switch-preview {
  display: flex;
  align-items: center;
  gap: var(--spacing-4);
}

.switch-checkbox-part {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  cursor: default;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.switch-checkbox-part input[type="checkbox"] {
  accent-color: var(--color-primary);
  width: 16px;
  height: 16px;
}

.switch-checkbox-label {
  user-select: none;
}

.select-part {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-2) var(--spacing-3);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  min-width: 120px;
}

.comp-options::-webkit-scrollbar {
  height: 4px;
}

.comp-options::-webkit-scrollbar-track {
  background: var(--color-surface-hover);
  border-radius: var(--border-radius-full);
}

.comp-options::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: var(--border-radius-full);
}

.comp-options::-webkit-scrollbar-thumb:hover {
  background: var(--color-text-tertiary);
}

.comp-action {
  margin-left: var(--spacing-3);
  cursor: pointer;
  color: var(--color-text-tertiary);
  background: none;
  border: none;
  padding: var(--spacing-2);
  border-radius: var(--border-radius-md);
  transition: all var(--transition-normal);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.comp-action:hover {
  color: var(--color-primary);
  background: rgba(100, 108, 255, 0.1);
  transform: rotate(15deg);
}

.group-footer {
  display: flex;
  gap: var(--spacing-2);
  padding-top: var(--spacing-4);
  border-top: 1px solid var(--color-border);
  flex-wrap: wrap;
}

.add-comp-btn {
  flex: 1;
  min-width: 100px;
  font-size: var(--font-size-sm);
  background: var(--color-surface-hover);
  border: 1px dashed var(--color-primary);
  color: var(--color-primary);
  padding: var(--spacing-2) var(--spacing-3);
  border-radius: var(--border-radius-md);
  transition: all var(--transition-normal);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-1);
}

.add-comp-btn:hover {
  background: var(--color-primary);
  color: var(--color-text-primary);
  border-style: solid;
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

/* 按钮样式 */
.btn {
  padding: var(--spacing-2) var(--spacing-4);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  cursor: pointer;
  background: var(--color-surface);
  transition: all var(--transition-normal);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-2);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
}

.btn:hover {
  color: var(--color-primary);
  border-color: var(--color-primary);
  background: rgba(100, 108, 255, 0.1);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .group-box {
    padding: var(--spacing-4);
  }

  .group-header {
    margin-bottom: var(--spacing-4);
  }

  .group-content {
    margin-bottom: var(--spacing-4);
  }

  .group-footer {
    gap: var(--spacing-1);
  }

  .add-comp-btn {
    flex: 1;
    min-width: 80px;
    font-size: var(--font-size-xs);
    padding: var(--spacing-2) var(--spacing-2);
  }

  .comp-preview {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-2);
  }

  .comp-title {
    min-width: unset;
  }

  /* 小屏幕下网格布局自适应调整 */
  .comp-options {
    width: 100%;
    /* 强制使用内联样式设置的grid-template-columns，保持用户选择的列数 */
  }
}

/* 超小屏幕设备适配 */
@media (max-width: 480px) {
  .comp-options {
    /* 在超小屏幕上，如果列数大于2，则强制改为2列以保证可读性 */
    grid-template-columns: repeat(2, 1fr) !important;
  }
}

/* 选项文本溢出处理 */
.option-text {
  user-select: none;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
