<template>
  <!--
    提测确认弹窗组件
    用于确认将草稿文件提交到测试环境
    关联需求：文件管理模块 - 提交测试
  -->
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="visible" class="modal-overlay" @click.self="handleClose">
        <div class="modal-container">
          <!-- 弹窗头部 -->
          <div class="modal-header">
            <h3 class="modal-title">
              <Icon name="send" size="18" />
              提交测试
            </h3>
            <button class="close-btn" @click="handleClose" title="关闭">
              <Icon name="x" size="18" />
            </button>
          </div>

          <!-- 弹窗主体 -->
          <div class="modal-body">
            <!-- 源文件信息 -->
            <div v-if="sourceDraft" class="source-info">
              <div class="info-item">
                <span class="info-label">源文件：</span>
                <span class="info-value">{{ sourceDraft.name }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">文件类型：</span>
                <span class="info-type draft">草稿</span>
              </div>
            </div>

            <!-- 提测目标选择 -->
            <div class="target-section">
              <label class="section-label">提测到</label>
              <div class="target-options">
                <div
                  class="target-option"
                  :class="{ selected: selectedTarget === 'test' }"
                  @click="selectTarget('test')"
                >
                  <div class="option-radio">
                    <div class="radio-inner" :class="{ checked: selectedTarget === 'test' }">
                      <div v-if="selectedTarget === 'test'" class="radio-dot"></div>
                    </div>
                  </div>
                  <div class="option-content">
                    <div class="option-title">
                      <Icon name="users" size="16" />
                      测试约局
                    </div>
                    <div class="option-desc">用于多人对战测试环境</div>
                  </div>
                </div>

                <div
                  class="target-option"
                  :class="{ selected: selectedTarget === 'gold' }"
                  @click="selectTarget('gold')"
                >
                  <div class="option-radio">
                    <div class="radio-inner" :class="{ checked: selectedTarget === 'gold' }">
                      <div v-if="selectedTarget === 'gold'" class="radio-dot"></div>
                    </div>
                  </div>
                  <div class="option-content">
                    <div class="option-title">
                      <Icon name="coins" size="16" />
                      测试金币
                    </div>
                    <div class="option-desc">用于金币模式测试环境</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 警告提示 -->
            <div class="warning-section">
              <div class="warning-box">
                <Icon name="alert-triangle" size="18" class="warning-icon" />
                <div class="warning-content">
                  <div class="warning-title">注意</div>
                  <div class="warning-text">
                    提交测试将<span class="highlight">覆盖</span>现有的
                    <span v-if="selectedTarget === 'test'">测试约局</span>
                    <span v-else>测试金币</span>
                    配置文件，此操作不可撤销。
                  </div>
                </div>
              </div>
            </div>

            <!-- 确认信息 -->
            <div class="confirm-section">
              <label class="confirm-checkbox">
                <input
                  v-model="isConfirmed"
                  type="checkbox"
                  class="confirm-input"
                />
                <span class="checkbox-visual">
                  <Icon v-if="isConfirmed" name="check" size="12" />
                </span>
                <span class="confirm-text">我已了解，确认提交测试</span>
              </label>
            </div>
          </div>

          <!-- 弹窗底部 -->
          <div class="modal-footer">
            <button class="btn btn-outline" @click="handleClose">
              取消
            </button>
            <button
              class="btn btn-primary"
              :disabled="!canSubmit"
              @click="handleConfirm"
            >
              <Icon name="check" size="14" />
              确认提测
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
/**
 * SubmitTestModal.vue - 提测确认弹窗组件
 * 
 * 功能说明：
 * 用于确认将草稿文件提交到测试环境
 * 支持选择提测目标（测试约局/测试金币）
 * 显示警告信息和确认选项
 * 
 * Props:
 * @property {boolean} visible - 是否显示弹窗
 * @property {Object} sourceDraft - 源草稿文件对象
 *   @property {string} sourceDraft.id - 文件ID
 *   @property {string} sourceDraft.name - 文件名称
 *   @property {string} sourceDraft.type - 文件类型
 * 
 * Events:
 * @event update:visible - 更新弹窗显示状态
 * @event submit-test - 确认提测，携带 { targetType: 'test' | 'gold' }
 * @event close - 关闭弹窗
 */

import { ref, computed, watch } from 'vue'
import Icon from './Icon.vue'

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
   * 源草稿文件对象
   * @type {Object}
   */
  sourceDraft: {
    type: Object,
    default: null
  }
})

// 定义事件
const emit = defineEmits(['update:visible', 'submit-test', 'close'])

// 响应式数据
const selectedTarget = ref('test')
const isConfirmed = ref(false)

// 计算属性：是否可以提交
const canSubmit = computed(() => {
  return selectedTarget.value && isConfirmed.value
})

// 监听visible变化，重置状态
watch(() => props.visible, (newVal) => {
  if (newVal) {
    // 打开弹窗时重置状态
    selectedTarget.value = 'test'
    isConfirmed.value = false
  }
})

/**
 * 选择提测目标
 * @param {string} target - 目标类型 ('test' | 'gold')
 * 关联需求：文件管理 - 选择提测目标
 */
function selectTarget(target) {
  selectedTarget.value = target
}

/**
 * 处理关闭弹窗
 * 关联需求：文件管理 - 取消提测操作
 */
function handleClose() {
  emit('update:visible', false)
  emit('close')
}

/**
 * 处理确认提测
 * 关联需求：文件管理 - 确认提交测试
 */
function handleConfirm() {
  if (!canSubmit.value) {
    return
  }
  const targetType = selectedTarget.value === 'test' ? 'testMatch' : 'testGold'
  emit('submit-test', { targetType })
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

.modal-title :deep(svg) {
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
  padding: var(--spacing-4) var(--spacing-6);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-5);
}

/* 源文件信息 */
.source-info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
  padding: var(--spacing-3) var(--spacing-4);
  background: var(--color-surface);
  border-radius: var(--border-radius-md);
  border: 1px solid var(--color-border);
}

.info-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
}

.info-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  flex-shrink: 0;
}

.info-value {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.info-type {
  font-size: var(--font-size-xs);
  padding: var(--spacing-1) var(--spacing-2);
  border-radius: var(--border-radius-full);
  font-weight: var(--font-weight-medium);
}

.info-type.draft {
  background: rgba(59, 130, 246, 0.1);
  color: var(--color-primary);
}

/* 目标选择区域 */
.target-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
}

.section-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

.target-options {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
}

.target-option {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-3);
  padding: var(--spacing-4);
  border: 2px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  cursor: pointer;
  transition: all var(--transition-fast);
  background: var(--color-surface);
}

.target-option:hover {
  border-color: var(--color-border-dark);
  background: var(--color-surface-hover);
}

.target-option.selected {
  border-color: var(--color-primary);
  background: rgba(59, 130, 246, 0.05);
}

/* 单选框样式 */
.option-radio {
  flex-shrink: 0;
  padding-top: 2px;
}

.radio-inner {
  width: 20px;
  height: 20px;
  border: 2px solid var(--color-border-dark);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
}

.radio-inner.checked {
  border-color: var(--color-primary);
  background: var(--color-primary);
}

.radio-dot {
  width: 8px;
  height: 8px;
  background: white;
  border-radius: 50%;
}

/* 选项内容 */
.option-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-1);
}

.option-title {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
}

.option-title :deep(svg) {
  color: var(--color-primary);
}

.option-desc {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

/* 警告区域 */
.warning-section {
  margin-top: var(--spacing-2);
}

.warning-box {
  display: flex;
  gap: var(--spacing-3);
  padding: var(--spacing-4);
  background: rgba(245, 158, 11, 0.1);
  border: 1px solid rgba(245, 158, 11, 0.2);
  border-radius: var(--border-radius-lg);
}

.warning-icon {
  color: var(--color-warning);
  flex-shrink: 0;
}

.warning-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-1);
}

.warning-title {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-warning);
}

.warning-text {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  line-height: var(--line-height-relaxed);
}

.highlight {
  color: var(--color-danger);
  font-weight: var(--font-weight-semibold);
}

/* 确认区域 */
.confirm-section {
  padding-top: var(--spacing-2);
}

.confirm-checkbox {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  cursor: pointer;
  user-select: none;
}

.confirm-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.checkbox-visual {
  width: 20px;
  height: 20px;
  border: 2px solid var(--color-border-dark);
  border-radius: var(--border-radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
  flex-shrink: 0;
  color: white;
}

.confirm-checkbox:hover .checkbox-visual {
  border-color: var(--color-primary);
}

.confirm-input:checked + .checkbox-visual {
  background: var(--color-primary);
  border-color: var(--color-primary);
}

.confirm-text {
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
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
    border-radius: var(--border-radius-xl) var(--border-radius-xl) 0 0;
  }

  .modal-header,
  .modal-body,
  .modal-footer {
    padding-left: var(--spacing-4);
    padding-right: var(--spacing-4);
  }

  .target-option {
    padding: var(--spacing-3);
  }
}
</style>
