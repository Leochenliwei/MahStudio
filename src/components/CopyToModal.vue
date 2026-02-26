<template>
  <!--
    复制到目标游戏选择弹窗组件
    用于选择将文件复制到哪个目标游戏
    关联需求：文件管理模块 - 复制到其他游戏
  -->
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="visible" class="modal-overlay" @click.self="handleClose">
        <div class="modal-container">
          <!-- 弹窗头部 -->
          <div class="modal-header">
            <h3 class="modal-title">
              <Icon name="share" size="18" />
              复制到目标游戏
            </h3>
            <button class="close-btn" @click="handleClose" title="关闭">
              <Icon name="x" size="18" />
            </button>
          </div>

          <!-- 弹窗主体 -->
          <div class="modal-body">
            <!-- 源文件信息 -->
            <div v-if="sourceFile" class="source-info">
              <span class="info-label">源文件：</span>
              <span class="info-value">{{ sourceFile.name }}</span>
              <span class="info-type" :class="`type-${sourceFile.type}`">
                {{ getTypeLabel(sourceFile.type) }}
              </span>
            </div>

            <!-- 搜索框 -->
            <div class="search-section">
              <div class="search-input-wrapper">
                <Icon name="search" size="16" class="search-icon" />
                <input
                  v-model="searchQuery"
                  type="text"
                  class="search-input"
                  placeholder="搜索游戏名称..."
                  @input="handleSearch"
                />
                <button
                  v-if="searchQuery"
                  class="clear-btn"
                  @click="clearSearch"
                  title="清空"
                >
                  <Icon name="x-circle" size="16" />
                </button>
              </div>
            </div>

            <!-- 游戏列表 -->
            <div class="games-list-container">
              <div v-if="filteredGames.length === 0" class="empty-state">
                <Icon name="inbox" size="48" color="var(--color-text-tertiary)" />
                <p>未找到匹配的游戏</p>
              </div>
              <div v-else class="games-list">
                <div
                  v-for="game in filteredGames"
                  :key="game.id"
                  class="game-item"
                  :class="{ selected: selectedGameId === game.id, disabled: game.id === currentGameId }"
                  @click="selectGame(game)"
                >
                  <div class="game-checkbox">
                    <div class="checkbox-inner" :class="{ checked: selectedGameId === game.id }">
                      <Icon v-if="selectedGameId === game.id" name="check" size="12" />
                    </div>
                  </div>
                  <div class="game-info">
                    <div class="game-name">{{ game.name }}</div>
                    <div v-if="game.id === currentGameId" class="game-tag current">当前游戏</div>
                    <div v-else-if="game.hasConfig" class="game-tag has-config">已有配置</div>
                  </div>
                  <div v-if="game.id === currentGameId" class="game-disabled-hint">
                    不可选
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 弹窗底部 -->
          <div class="modal-footer">
            <button class="btn btn-outline" @click="handleClose">
              取消
            </button>
            <button
              class="btn btn-primary"
              :disabled="!selectedGameId || selectedGameId === currentGameId"
              @click="handleConfirm"
            >
              <Icon name="check" size="14" />
              确认复制
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
/**
 * CopyToModal.vue - 复制到目标游戏选择弹窗组件
 * 
 * 功能说明：
 * 用于选择将文件复制到哪个目标游戏
 * 支持搜索过滤游戏列表
 * 显示源文件信息和目标游戏列表
 * 
 * Props:
 * @property {boolean} visible - 是否显示弹窗
 * @property {Object} sourceFile - 源文件对象
 *   @property {string} sourceFile.id - 文件ID
 *   @property {string} sourceFile.name - 文件名称
 *   @property {string} sourceFile.type - 文件类型
 * @property {Array} targetGames - 目标游戏列表
 *   @property {string} targetGames[].id - 游戏ID
 *   @property {string} targetGames[].name - 游戏名称
 *   @property {boolean} [targetGames[].hasConfig] - 是否已有配置
 * 
 * Events:
 * @event update:visible - 更新弹窗显示状态
 * @event copy-to - 确认复制，携带 { targetGameId: string }
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
   * 源文件对象
   * @type {Object}
   */
  sourceFile: {
    type: Object,
    default: null
  },
  /**
   * 目标游戏列表
   * @type {Array}
   */
  targetGames: {
    type: Array,
    default: () => []
  },
  /**
   * 当前游戏ID（不可选）
   * @type {string}
   */
  currentGameId: {
    type: String,
    default: ''
  }
})

// 定义事件
const emit = defineEmits(['update:visible', 'copy-to', 'close'])

// 响应式数据
const searchQuery = ref('')
const selectedGameId = ref('')

// 计算属性：过滤后的游戏列表
const filteredGames = computed(() => {
  if (!searchQuery.value.trim()) {
    return props.targetGames
  }
  const query = searchQuery.value.toLowerCase()
  return props.targetGames.filter(game => 
    game.name.toLowerCase().includes(query)
  )
})

// 监听visible变化，重置状态
watch(() => props.visible, (newVal) => {
  if (newVal) {
    // 打开弹窗时重置状态
    searchQuery.value = ''
    selectedGameId.value = ''
  }
})

/**
 * 获取类型标签文本
 * @param {string} type - 文件类型
 * @returns {string} 类型标签文本
 */
function getTypeLabel(type) {
  const typeMap = {
    draft: '草稿',
    testMatch: '测试约局',
    testGold: '测试金币'
  }
  return typeMap[type] || type
}

/**
 * 处理搜索输入
 * 关联需求：文件管理 - 搜索目标游戏
 */
function handleSearch() {
  // 搜索逻辑已在计算属性中实现
  // 这里可以添加防抖或额外的搜索逻辑
}

/**
 * 清空搜索
 * 关联需求：文件管理 - 清空搜索条件
 */
function clearSearch() {
  searchQuery.value = ''
}

/**
 * 选择游戏
 * @param {Object} game - 游戏对象
 * 关联需求：文件管理 - 选择目标游戏
 */
function selectGame(game) {
  if (game.id === props.currentGameId) {
    return
  }
  selectedGameId.value = game.id
}

/**
 * 处理关闭弹窗
 * 关联需求：文件管理 - 取消复制操作
 */
function handleClose() {
  emit('update:visible', false)
  emit('close')
}

/**
 * 处理确认复制
 * 关联需求：文件管理 - 确认复制到目标游戏
 */
function handleConfirm() {
  if (!selectedGameId.value || selectedGameId.value === props.currentGameId) {
    return
  }
  emit('copy-to', { targetGameId: selectedGameId.value })
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
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding: var(--spacing-4) var(--spacing-6);
}

/* 源文件信息 */
.source-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-3) var(--spacing-4);
  background: var(--color-surface);
  border-radius: var(--border-radius-md);
  margin-bottom: var(--spacing-4);
  border: 1px solid var(--color-border);
}

.info-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.info-value {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  flex: 1;
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

.info-type.type-draft {
  background: rgba(59, 130, 246, 0.1);
  color: var(--color-primary);
}

.info-type.type-testMatch {
  background: rgba(16, 185, 129, 0.1);
  color: var(--color-success);
}

.info-type.type-testGold {
  background: rgba(245, 158, 11, 0.1);
  color: var(--color-warning);
}

/* 搜索区域 */
.search-section {
  margin-bottom: var(--spacing-4);
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: var(--spacing-3);
  color: var(--color-text-tertiary);
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: var(--spacing-3) var(--spacing-4) var(--spacing-3) var(--spacing-10);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  font-size: var(--font-size-sm);
  background: var(--color-surface);
  transition: all var(--transition-fast);
}

.search-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.clear-btn {
  position: absolute;
  right: var(--spacing-3);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border: none;
  background: transparent;
  color: var(--color-text-tertiary);
  cursor: pointer;
  padding: 0;
  border-radius: var(--border-radius-full);
  transition: all var(--transition-fast);
}

.clear-btn:hover {
  color: var(--color-text-secondary);
  background: var(--color-surface-hover);
}

/* 游戏列表容器 */
.games-list-container {
  flex: 1;
  overflow-y: auto;
  min-height: 200px;
  max-height: 300px;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  background: var(--color-surface);
}

.games-list-container::-webkit-scrollbar {
  width: 6px;
}

.games-list-container::-webkit-scrollbar-track {
  background: transparent;
}

.games-list-container::-webkit-scrollbar-thumb {
  background: var(--color-border-dark);
  border-radius: var(--border-radius-full);
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-8);
  color: var(--color-text-tertiary);
  gap: var(--spacing-3);
}

.empty-state p {
  margin: 0;
  font-size: var(--font-size-sm);
}

/* 游戏列表 */
.games-list {
  padding: var(--spacing-2);
}

.game-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  padding: var(--spacing-3) var(--spacing-4);
  border-radius: var(--border-radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
  margin-bottom: var(--spacing-1);
}

.game-item:last-child {
  margin-bottom: 0;
}

.game-item:hover:not(.disabled) {
  background: var(--color-surface-hover);
}

.game-item.selected {
  background: rgba(59, 130, 246, 0.1);
}

.game-item.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 游戏复选框 */
.game-checkbox {
  flex-shrink: 0;
}

.checkbox-inner {
  width: 18px;
  height: 18px;
  border: 2px solid var(--color-border-dark);
  border-radius: var(--border-radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
}

.checkbox-inner.checked {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
}

.game-item.selected .checkbox-inner:not(.checked) {
  border-color: var(--color-primary);
}

/* 游戏信息 */
.game-info {
  flex: 1;
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  min-width: 0;
}

.game-name {
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.game-tag {
  font-size: var(--font-size-xs);
  padding: var(--spacing-1) var(--spacing-2);
  border-radius: var(--border-radius-full);
  font-weight: var(--font-weight-medium);
  flex-shrink: 0;
}

.game-tag.current {
  background: var(--color-gray-200);
  color: var(--color-text-secondary);
}

.game-tag.has-config {
  background: rgba(245, 158, 11, 0.1);
  color: var(--color-warning);
}

.game-disabled-hint {
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
  flex-shrink: 0;
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
