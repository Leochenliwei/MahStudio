<template>
  <!--
    添加分组弹窗组件
    用于创建新的分组，包含分组名称、列数和说明
    关联需求：创房面板配置 - 添加分组功能
  -->
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="visible" class="modal-overlay" @click.self="handleClose">
        <div class="modal-container">
          <!-- 弹窗头部 -->
          <div class="modal-header">
            <h3 class="modal-title">
              <el-icon :size="18"><FolderAdd /></el-icon>
              {{ mode === 'create' ? '添加分组' : '编辑分组' }}
            </h3>
            <button class="close-btn" @click="handleClose" title="关闭">
              <el-icon :size="18"><Close /></el-icon>
            </button>
          </div>

          <!-- 弹窗主体 -->
          <div class="modal-body">
            <form class="form" @submit.prevent="handleConfirm">
              <!-- 分组名称 -->
              <div class="form-item">
                <label class="form-label">
                  <span class="required">*</span>
                  分组名称
                </label>
                <div class="form-input-wrapper">
                  <el-icon :size="16" class="input-icon"><Folder /></el-icon>
                  <input
                    v-model="formData.name"
                    type="text"
                    class="form-input"
                    placeholder="请输入分组名称"
                    maxlength="20"
                  />
                </div>
                <span class="form-hint">最多20个字符</span>
              </div>

              <!-- 列数选择 -->
              <div class="form-item">
                <label class="form-label">
                  <span class="required">*</span>
                  列数
                </label>
                <div class="form-select-wrapper">
                  <el-icon :size="16" class="input-icon"><Grid /></el-icon>
                  <select v-model="formData.columns" class="form-select">
                    <option value="1">1列</option>
                    <option value="2">2列</option>
                    <option value="3">3列</option>
                    <option value="4">4列</option>
                  </select>
                  <el-icon :size="14" class="select-arrow"><ArrowDown /></el-icon>
                </div>
                <span class="form-hint">设置分组内组件的列数布局</span>
              </div>

              <!-- 说明 -->
              <div class="form-item">
                <label class="form-label">说明</label>
                <textarea
                  v-model="formData.description"
                  class="form-textarea"
                  placeholder="请输入分组说明（可选）"
                  maxlength="100"
                  rows="3"
                ></textarea>
                <span class="form-hint">最多100个字符</span>
              </div>
            </form>
          </div>

          <!-- 弹窗底部 -->
          <div class="modal-footer">
            <button class="btn btn-outline" @click="handleClose">
              取消
            </button>
            <button
              class="btn btn-primary"
              :disabled="!isFormValid"
              @click="handleConfirm"
            >
              <el-icon :size="14"><Check /></el-icon>
              {{ mode === 'create' ? '确认创建' : '确认修改' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
/**
 * AddGroupModal.vue - 添加分组弹窗组件
 * 
 * 功能说明：
 * 用于创建新的分组，包含分组名称、列数和说明
 * 支持表单验证，名称为必填项
 * 
 * Props:
 * @property {boolean} visible - 是否显示弹窗
 * 
 * Events:
 * @event update:visible - 更新弹窗显示状态
 * @event confirm - 确认创建，携带 { name: string, columns: number, description: string }
 * @event close - 关闭弹窗
 */

import { ref, computed, watch } from 'vue'
import { FolderAdd, Close, Folder, Grid, ArrowDown, Check } from '@element-plus/icons-vue'

// 定义Props
const props = defineProps({
  /**
   * 是否显示弹窗
   * @type {boolean}
   */
  visible: {
    type: Boolean,
    default: false
  },
  /**
   * 弹窗模式：create-创建, edit-编辑
   * @type {string}
   */
  mode: {
    type: String,
    default: 'create',
    validator: (value) => ['create', 'edit'].includes(value)
  },
  /**
   * 分组数据（编辑模式时使用）
   * @type {Object}
   */
  groupData: {
    type: Object,
    default: () => null
  }
})

// 定义事件
const emit = defineEmits(['update:visible', 'confirm', 'close'])

// 表单数据
const formData = ref({
  name: '',
  columns: 4,
  description: ''
})

// 计算属性：表单是否有效
const isFormValid = computed(() => {
  return formData.value.name.trim().length > 0
})

// 监听visible变化，重置表单或填充数据
watch(() => props.visible, (newVal) => {
  if (newVal) {
    if (props.mode === 'edit' && props.groupData) {
      // 编辑模式：填充现有数据
      formData.value = {
        name: props.groupData.name,
        columns: props.groupData.columns || 4,
        description: props.groupData.description || ''
      }
    } else {
      // 创建模式：重置表单
      formData.value = {
        name: '',
        columns: 4,
        description: ''
      }
    }
  }
})

/**
 * 处理关闭弹窗
 * 关联需求：分组管理 - 取消添加分组
 */
function handleClose() {
  emit('update:visible', false)
  emit('close')
}

/**
 * 处理确认创建/编辑
 * 关联需求：分组管理 - 确认创建/编辑分组
 */
function handleConfirm() {
  if (!isFormValid.value) {
    return
  }

  emit('confirm', {
    mode: props.mode,
    groupId: props.mode === 'edit' ? props.groupData?.id : undefined,
    name: formData.value.name.trim(),
    columns: parseInt(formData.value.columns),
    description: formData.value.description.trim()
  })
  emit('update:visible', false)
}
</script>

<style scoped>
/* 弹窗遮罩层 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-4);
}

/* 弹窗容器 */
.modal-container {
  background: var(--color-background);
  border-radius: var(--border-radius-xl);
  box-shadow: var(--shadow-xl);
  width: 100%;
  max-width: 480px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: modal-in 0.3s ease;
}

@keyframes modal-in {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(-10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* 弹窗头部 */
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-4) var(--spacing-6);
  border-bottom: 1px solid var(--color-border);
  background: var(--color-surface);
}

.modal-title {
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
}

.modal-title :deep(.el-icon) {
  color: var(--color-primary);
}

.close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: var(--border-radius-md);
  border: none;
  background: transparent;
  color: var(--color-text-tertiary);
  cursor: pointer;
  transition: all var(--transition-fast);
  padding: 0;
}

.close-btn:hover {
  background: var(--color-surface-hover);
  color: var(--color-text-primary);
}

/* 弹窗主体 */
.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-6);
}

/* 表单样式 */
.form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-5);
}

.form-item {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.form-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  display: flex;
  align-items: center;
  gap: var(--spacing-1);
}

.required {
  color: var(--color-danger);
}

.form-input-wrapper,
.form-select-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: var(--spacing-3);
  color: var(--color-text-tertiary);
  pointer-events: none;
}

.form-input,
.form-select {
  width: 100%;
  padding: var(--spacing-3) var(--spacing-4) var(--spacing-3) var(--spacing-10);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
  background: var(--color-surface);
  transition: all var(--transition-fast);
  color: var(--color-text-primary);
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-select {
  appearance: none;
  cursor: pointer;
  padding-right: var(--spacing-8);
}

.select-arrow {
  position: absolute;
  right: var(--spacing-3);
  color: var(--color-text-tertiary);
  pointer-events: none;
}

.form-textarea {
  width: 100%;
  padding: var(--spacing-3) var(--spacing-4);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
  background: var(--color-surface);
  transition: all var(--transition-fast);
  color: var(--color-text-primary);
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
}

.form-textarea:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-hint {
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
}

/* 弹窗底部 */
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-3);
  padding: var(--spacing-4) var(--spacing-6);
  border-top: 1px solid var(--color-border);
  background: var(--color-surface);
}

/* 按钮样式 */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-2);
  padding: var(--spacing-2) var(--spacing-5);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--transition-fast);
  border: 1px solid transparent;
}

.btn-outline {
  background: var(--color-surface);
  color: var(--color-text-secondary);
  border-color: var(--color-border);
}

.btn-outline:hover {
  background: var(--color-surface-hover);
  color: var(--color-text-primary);
  border-color: var(--color-border-dark);
}

.btn-primary {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

.btn-primary:hover:not(:disabled) {
  background: var(--color-primary-hover);
  border-color: var(--color-primary-hover);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 弹窗动画 */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  opacity: 0;
  transform: scale(0.95) translateY(-10px);
}

/* 响应式适配 */
@media (max-width: 480px) {
  .modal-overlay {
    padding: var(--spacing-2);
    align-items: flex-end;
  }

  .modal-container {
    max-height: 90vh;
    border-radius: var(--border-radius-xl) var(--border-radius-xl) 0 0;
  }

  .modal-header,
  .modal-body,
  .modal-footer {
    padding-left: var(--spacing-4);
    padding-right: var(--spacing-4);
  }
}
</style>
