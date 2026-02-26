<template>
  <!--
    提测记录弹窗组件
    用于显示提测历史记录
    关联需求：文件管理模块 - 提测记录查看
  -->
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="visible" class="modal-overlay" @click.self="handleClose">
        <div class="modal-container">
          <!-- 弹窗头部 -->
          <div class="modal-header">
            <h3 class="modal-title">
              <Icon name="history" size="18" />
              提测记录
            </h3>
            <button class="close-btn" @click="handleClose" title="关闭">
              <Icon name="x" size="18" />
            </button>
          </div>

          <!-- 弹窗主体 -->
          <div class="modal-body">
            <!-- 提测记录列表 -->
            <div class="history-list">
              <div v-if="filteredHistory.length === 0" class="empty-state">
                <Icon name="inbox" size="48" class="empty-icon" />
                <p>暂无提测记录</p>
              </div>
              <div v-else class="history-items">
                <div 
                  v-for="record in filteredHistory" 
                  :key="record.id"
                  class="history-item"
                >
                  <div class="history-item-header">
                    <div class="history-item-time">{{ formatDateTime(record.createdAt) }}</div>
                    <div class="history-item-type" :class="record.targetType">
                      {{ getTargetTypeLabel(record.targetType) }}
                    </div>
                  </div>
                  <div class="history-item-body">
                    <div class="history-item-info">
                      <span class="info-label">草稿ID：</span>
                      <span class="info-value">{{ record.draftId }}</span>
                    </div>
                    <div class="history-item-info">
                      <span class="info-label">操作人：</span>
                      <span class="info-value">{{ record.createdBy || '未知' }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 弹窗底部 -->
          <div class="modal-footer">
            <button class="btn btn-primary" @click="handleClose">
              关闭
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
/**
 * SubmitHistoryModal.vue - 提测记录弹窗组件
 * 
 * 功能说明：
 * 用于显示提测历史记录
 * 支持按目标类型过滤
 * 以时间倒序显示记录
 * 
 * Props:
 * @property {boolean} visible - 是否显示弹窗
 * @property {Array} submitHistory - 提测记录数组
 * @property {string} targetType - 目标类型过滤（可选）
 * 
 * Events:
 * @event update:visible - 更新弹窗显示状态
 * @event close - 关闭弹窗
 */

import { ref, computed } from 'vue'
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
   * 提测记录数组
   * @type {Array}
   */
  submitHistory: {
    type: Array,
    default: () => []
  },
  /**
   * 目标类型过滤
   * @type {string}
   */
  targetType: {
    type: String,
    default: ''
  }
})

// 定义事件
const emit = defineEmits(['update:visible', 'close'])

// 计算属性：过滤后的提测记录
const filteredHistory = computed(() => {
  let history = [...(props.submitHistory || [])]
  
  // 按目标类型过滤
  if (props.targetType) {
    history = history.filter(record => record.targetType === props.targetType)
  }
  
  // 按时间倒序排序
  history.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  
  return history
})

/**
 * 获取目标类型标签
 * @param {string} targetType - 目标类型
 * @returns {string} 类型标签
 */
function getTargetTypeLabel(targetType) {
  const typeMap = {
    testMatch: '测试约局',
    testGold: '测试金币'
  }
  return typeMap[targetType] || targetType
}

/**
 * 格式化日期时间
 * @param {string} dateString - ISO格式的日期字符串
 * @returns {string} 格式化后的日期时间
 */
function formatDateTime(dateString) {
  if (!dateString) return '-'
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return '-'
  
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  
  return `${year}-${month}-${day} ${hours}:${minutes}`
}

/**
 * 处理关闭弹窗
 * 关联需求：文件管理 - 关闭提测记录弹窗
 */
function handleClose() {
  emit('update:visible', false)
  emit('close')
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
  max-width: 600px;
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
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-5);
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-8) var(--spacing-4);
  text-align: center;
}

.empty-icon {
  color: var(--color-text-tertiary);
  margin-bottom: var(--spacing-4);
}

.empty-state p {
  margin: 0;
  color: var(--color-text-secondary);
  font-size: var(--font-size-base);
}

/* 提测记录列表 */
.history-list {
  flex: 1;
}

.history-items {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
}

/* 提测记录项 */
.history-item {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-4);
  transition: all var(--transition-fast);
}

.history-item:hover {
  border-color: var(--color-border-dark);
  box-shadow: var(--shadow-sm);
}

/* 记录项头部 */
.history-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-3);
  padding-bottom: var(--spacing-3);
  border-bottom: 1px solid var(--color-border);
}

.history-item-time {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  font-family: 'Monaco', 'Menlo', monospace;
}

/* 记录项类型标签 */
.history-item-type {
  font-size: var(--font-size-xs);
  padding: var(--spacing-1) var(--spacing-2);
  border-radius: var(--border-radius-full);
  font-weight: var(--font-weight-medium);
}

.history-item-type.testMatch {
  background: rgba(59, 130, 246, 0.1);
  color: var(--color-primary);
}

.history-item-type.testGold {
  background: rgba(16, 185, 129, 0.1);
  color: var(--color-success);
}

/* 记录项主体 */
.history-item-body {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.history-item-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
}

.info-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  flex-shrink: 0;
  width: 80px;
}

.info-value {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  font-family: 'Monaco', 'Menlo', monospace;
  flex: 1;
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

.btn-primary {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

.btn-primary:hover:not(:disabled) {
  background: var(--color-primary-hover);
  border-color: var(--color-primary-hover);
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
    max-height: 90vh;
  }

  .modal-header,
  .modal-body,
  .modal-footer {
    padding-left: var(--spacing-4);
    padding-right: var(--spacing-4);
  }

  .history-item-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-2);
  }

  .info-label {
    width: 70px;
  }
}
</style>