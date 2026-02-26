<template>
  <div class="game-directory-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <!-- 面包屑导航 -->
      <div class="breadcrumb">
        <a href="#" @click.prevent="goBack" class="breadcrumb-item">
          <Icon name="arrow-left" size="14" class="mr-1" />
          游戏管理
        </a>
        <span class="breadcrumb-separator">/</span>
        <span class="breadcrumb-item active">{{ game?.name || '游戏目录' }}</span>
      </div>
      
      
    </div>

    <!-- 游戏信息卡片 -->
    <div v-if="game" class="game-info-card">
      <div class="game-info-header">
        <h2 class="game-title">{{ game.name }}</h2>
        <div class="game-meta">
          <span class="meta-item">
            <Icon name="clock" size="14" class="mr-1" />
            创建于 {{ formatDateTime(game.createdAt) }}
          </span>
          <span class="meta-item">
            <Icon name="clock" size="14" class="mr-1" />
            更新于 {{ formatDateTime(game.updatedAt) }}
          </span>
        </div>
      </div>
      <div class="game-description">
        {{ game.description || '暂无描述' }}
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner">
        <div class="spinner-core"></div>
      </div>
      <p>加载中...</p>
    </div>

    <!-- 错误状态 -->
    <div v-if="error" class="error-container">
      <Icon name="alert-circle" size="48" class="error-icon" />
      <p>{{ error }}</p>
      <button class="action-btn" @click="loadGameData">重新加载</button>
    </div>

    <!-- 文件列表区域 -->
    <div v-if="game" class="file-list-container">
      <!-- 测试区域容器（两列布局） -->
      <div class="test-sections-container">
        <!-- 测试约局区域 -->
        <div class="file-section">
          <div class="section-header">
            <h3 class="section-title">
              <Icon name="layout-dashboard" size="16" class="mr-2" />
              测试约局
            </h3>
          </div>
          <div class="file-grid">
            <FileCard 
              v-if="testMatchFile" 
              :key="testMatchFile.id || 'testMatch'"
              :file="testMatchFile"
              :environment="activeEnv"
              @copy="copyFile"
              @copy-to="showCopyToModal"
              @publish="publishFile"
            />
            <div v-else class="empty-file-card">
              <Icon name="inbox" size="32" class="empty-icon" />
              <p>暂无测试约局配置</p>
              <p class="empty-hint">请从草稿提测创建</p>
            </div>
          </div>
        </div>

        <!-- 测试金币区域 -->
        <div class="file-section">
          <div class="section-header">
            <h3 class="section-title">
              <Icon name="coin" size="16" class="mr-2" />
              测试金币
            </h3>
          </div>
          <div class="file-grid">
            <FileCard 
              v-if="testGoldFile" 
              :key="testGoldFile.id || 'testGold'"
              :file="testGoldFile"
              :environment="activeEnv"
              @copy="copyFile"
              @copy-to="showCopyToModal"
              @publish="publishFile"
            />
            <div v-else class="empty-file-card">
              <Icon name="inbox" size="32" class="empty-icon" />
              <p>暂无测试金币配置</p>
              <p class="empty-hint">请从草稿提测创建</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 草稿区域 -->
      <div class="file-section">
        <div class="section-header">
          <h3 class="section-title">
            <Icon name="file-text" size="16" class="mr-2" />
            草稿
            <span class="section-count">({{ draftFiles.length }})</span>
          </h3>
          <button class="action-btn" @click="showCreateDraftModal = true">
          新建草稿
        </button>
        </div>
        <div class="file-list">
          <div 
            v-for="file in draftFiles" 
            :key="file.id || file.name"
            class="file-list-item"
          >
            <div class="file-list-item-info">
              <div class="file-list-item-name">{{ file.name }}</div>
              <div class="file-list-item-meta">
                <span class="file-list-item-updated">更新于 {{ formatDateTime(file.updatedAt) }}</span>
              </div>
            </div>
            <div class="file-list-item-actions">
              <button class="action-btn small" @click="editFile(file)">
                <Icon name="edit" size="14" class="mr-1" />
                编辑
              </button>
              <button class="action-btn small outline" @click="copyFile(file)">
                <Icon name="copy" size="14" class="mr-1" />
                复制
              </button>
              <button class="action-btn small outline" @click="showCopyToModal(file)">
                <Icon name="send" size="14" class="mr-1" />
                复制到
              </button>
              <button class="action-btn small danger" @click="showSubmitTestModal(file)">
                <Icon name="send" size="14" class="mr-1" />
                提测
              </button>
            </div>
          </div>
          <div v-if="draftFiles.length === 0" class="empty-list-item">
            <Icon name="inbox" size="24" class="empty-icon" />
            <p>暂无草稿文件</p>
            <p class="empty-hint">点击"新建草稿"按钮创建</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 新建草稿弹窗 -->
    <div v-if="showCreateDraftModal" class="modal-overlay" @click="closeCreateDraftModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h4>新建草稿</h4>
          <button class="modal-close-btn" @click="closeCreateDraftModal">
            <Icon name="x" size="16" />
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label for="draftName">
              草稿名称
              <span class="required">*</span>
            </label>
            <input 
              type="text" 
              id="draftName" 
              v-model="newDraftName" 
              placeholder="请输入草稿名称" 
              class="form-input"
              @keyup.enter="createDraft"
            />
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-text" @click="closeCreateDraftModal">取消</button>
          <button class="action-btn" @click="createDraft" :disabled="!newDraftName.trim()">
            确认
          </button>
        </div>
      </div>
    </div>

    <!-- 复制到弹窗 -->
    <CopyToModal 
      :visible="showCopyToModalVisible"
      :source-file="currentCopyFile"
      :target-games="otherGames"
      @close="showCopyToModalVisible = false"
      @copy-to="handleCopyTo"
    />

    <!-- 提测弹窗 -->
    <SubmitTestModal 
      :visible="showSubmitTestModalVisible"
      :source-draft="currentSubmitDraft"
      @close="showSubmitTestModalVisible = false"
      @submit-test="handleSubmitTest"
    />
  </div>
</template>

<script setup>
/**
 * GameDirectory.vue - 游戏目录详情页
 * 
 * 需求关联：
 * 1. 展示游戏基本信息
 * 2. 草稿列表区域（支持多份）
 * 3. 测试约局展示区域（仅一份）
 * 4. 测试金币展示区域（仅一份）
 * 5. 新建草稿按钮
 * 6. 支持test/online环境切换
 * 
 * @author Frontend Architect
 * @since 2026-02-26
 */

import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Icon from '../components/Icon.vue'
import FileCard from '../components/FileCard.vue'
import CopyToModal from '../components/CopyToModal.vue'
import SubmitTestModal from '../components/SubmitTestModal.vue'
import { FileType, getGameById, getOtherGames, updateGame } from '../data/mockData.js'

// ==================== 路由相关 ====================
const router = useRouter()
const route = useRoute()

// ==================== 状态管理 ====================

/**
 * 当前激活的环境
 * @type {Ref<string>}
 */
const activeEnv = ref('test')

/**
 * 加载状态
 * @type {Ref<boolean>}
 */
const loading = ref(true)

/**
 * 错误信息
 * @type {Ref<string|null>}
 */
const error = ref(null)

/**
 * 游戏数据
 * @type {Ref<Object|null>}
 */
const game = ref(null)

/**
 * 新建草稿弹窗状态
 * @type {Ref<boolean>}
 */
const showCreateDraftModal = ref(false)

/**
 * 新草稿名称
 * @type {Ref<string>}
 */
const newDraftName = ref('')

/**
 * 复制到弹窗状态
 * @type {Ref<boolean>}
 */
const showCopyToModalVisible = ref(false)

/**
 * 当前复制的文件
 * @type {Ref<Object|null>}
 */
const currentCopyFile = ref(null)

/**
 * 提测弹窗状态
 * @type {Ref<boolean>}
 */
const showSubmitTestModalVisible = ref(false)

/**
 * 当前提测的草稿
 * @type {Ref<Object|null>}
 */
const currentSubmitDraft = ref(null)

// ==================== 数据模型 ====================

// ==================== 计算属性 ====================

/**
 * 草稿文件列表
 * @type {ComputedRef<Array>}
 */
const draftFiles = computed(() => {
  if (!game.value?.files) return []
  return game.value.files.filter(file => file.type === FileType.DRAFT)
})

/**
 * 测试约局文件
 * @type {ComputedRef<Object|null>}
 */
const testMatchFile = computed(() => {
  if (!game.value?.files) return null
  return game.value.files.find(file => file.type === FileType.TEST_MATCH) || null
})

/**
 * 测试金币文件
 * @type {ComputedRef<Object|null>}
 */
const testGoldFile = computed(() => {
  if (!game.value?.files) return null
  return game.value.files.find(file => file.type === FileType.TEST_GOLD) || null
})

/**
 * 其他游戏列表
 * @type {ComputedRef<Array>}
 */
const otherGames = computed(() => {
  if (!game.value) return []
  return getOtherGames(game.value.id)
})

// ==================== 生命周期钩子 ====================

/**
 * 组件挂载时加载游戏数据
 */
onMounted(() => {
  // 从路由参数获取游戏ID
  const gameId = route.params.gameId
  if (!gameId) {
    error.value = '游戏ID不存在'
    loading.value = false
    return
  }
  
  // 从路由query获取环境参数
  const env = route.query.env
  if (env && (env === 'test' || env === 'online')) {
    activeEnv.value = env
  }
  
  // 加载游戏数据
  loadGameData()
})

// ==================== 方法函数 ====================

/**
 * 加载游戏数据
 */
function loadGameData() {
  loading.value = true
  error.value = null
  
  try {
    const gameId = route.params.gameId
    // 模拟API请求延迟
    setTimeout(() => {
      const gameData = getGameById(gameId)
      if (gameData) {
        game.value = gameData
      } else {
        error.value = '游戏不存在'
      }
      loading.value = false
    }, 500)
  } catch (err) {
    error.value = '加载失败，请重试'
    loading.value = false
  }
}

/**
 * 切换环境
 * @param {string} env - 环境类型
 */
function switchEnv(env) {
  activeEnv.value = env
  // 更新路由参数
  router.replace({
    query: { ...route.query, env }
  })
}

/**
 * 返回上一页
 */
function goBack() {
  router.push({
    name: 'Admin',
    query: { env: activeEnv.value }
  })
}

/**
 * 编辑文件
 * @param {Object} file - 文件对象
 */
function editFile(file) {
  router.push({
    name: 'Workbench',
    params: { id: game.value.id },
    query: {
      fileId: file.id,
      fileType: file.type,
      env: activeEnv.value
    }
  })
}

/**
 * 复制文件
 * @param {Object} file - 文件对象
 */
function copyFile(file) {
  // 模拟复制操作
  alert(`复制文件：${file.name}`)
  // 实际实现：创建文件副本并添加到游戏的files数组
}

/**
 * 显示复制到弹窗
 * @param {Object} file - 文件对象
 */
function showCopyToModal(file) {
  currentCopyFile.value = file
  showCopyToModalVisible.value = true
}

/**
 * 处理复制到操作
 * @param {number} targetGameId - 目标游戏ID
 */
function handleCopyTo(targetGameId) {
  // 模拟复制到操作
  alert(`复制到游戏ID：${targetGameId}`)
  showCopyToModalVisible.value = false
  currentCopyFile.value = null
}

/**
 * 显示提测弹窗
 * @param {Object} draft - 草稿文件
 */
function showSubmitTestModal(draft) {
  currentSubmitDraft.value = draft
  showSubmitTestModalVisible.value = true
}

/**
 * 处理提测操作
 * @param {string} targetType - 目标类型（testMatch/testGold）
 */
function handleSubmitTest(targetType) {
  // 模拟提测操作
  alert(`提测到：${targetType}`)
  showSubmitTestModalVisible.value = false
  currentSubmitDraft.value = null
}

/**
 * 发布文件（发灰度）
 * @param {Object} file - 文件对象
 */
function publishFile(file) {
  // 模拟发布操作
  alert(`发布文件：${file.name}`)
}

/**
 * 关闭新建草稿弹窗
 */
function closeCreateDraftModal() {
  showCreateDraftModal.value = false
  newDraftName.value = ''
}

/**
 * 创建草稿
 */
function createDraft() {
  if (!newDraftName.value.trim()) {
    alert('请输入草稿名称')
    return
  }
  
  const now = new Date().toISOString()
  const newDraft = {
    id: `draft-${Date.now()}`,
    type: FileType.DRAFT,
    name: newDraftName.value.trim(),
    content: '{}',
    createdAt: now,
    updatedAt: now
  }
  
  // 添加到游戏的files数组并更新全局数据
  if (game.value) {
    const updatedFiles = [...game.value.files, newDraft]
    const updatedGame = updateGame(game.value.id, {
      files: updatedFiles,
      updatedAt: now
    })
    if (updatedGame) {
      game.value = updatedGame
    }
  }
  
  closeCreateDraftModal()
  
  // 跳转到工作台编辑
  setTimeout(() => {
    editFile(newDraft)
  }, 300)
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
</script>

<style scoped>
/* ==================== 布局样式 ==================== */

/**
 * 游戏目录容器
 */
.game-directory-container {
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
  padding: 8px 24px ;
  overflow-y: auto;
}

/* ==================== 页面头部样式 ==================== */

/**
 * 页面头部
 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e5e7eb;
  flex-wrap: wrap;
  gap: 16px;
}

/**
 * 面包屑导航
 */
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  color: #6b7280;
}

.breadcrumb-item {
  color: #6b7280;
  text-decoration: none;
  display: flex;
  align-items: center;
  transition: color 0.3s ease;
}

.breadcrumb-item:hover {
  color: #3b82f6;
}

.breadcrumb-item.active {
  color: #1f2937;
  font-weight: 500;
}

.breadcrumb-separator {
  color: #9ca3af;
}

/**
 * 头部操作区域
 */
.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

/**
 * 环境选择器
 */
.env-selector {
  display: flex;
  background-color: #f0f0f0;
  border-radius: 8px;
  padding: 2px;
}

.env-btn {
  padding: 8px 16px;
  border: none;
  background: transparent;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.3s ease;
}

.env-btn:hover {
  color: #3b82f6;
}

.env-btn.active {
  background-color: #3b82f6;
  color: #ffffff;
}

/* ==================== 游戏信息卡片 ==================== */

.game-info-card {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.game-info-header {
  margin-bottom: 16px;
}

.game-title {
  margin: 0 0 12px 0;
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
}

.game-meta {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #6b7280;
}

.game-description {
  color: #4b5563;
  font-size: 14px;
  line-height: 1.5;
  border-top: 1px solid #e5e7eb;
  padding-top: 16px;
}

/* ==================== 加载和错误状态 ==================== */

.loading-container,
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.loading-spinner {
  width: 60px;
  height: 60px;
  position: relative;
  margin-bottom: 20px;
}

.loading-spinner::before {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  border: 3px solid #e5e7eb;
  border-radius: 50%;
}

.loading-spinner::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  border: 3px solid transparent;
  border-top: 3px solid #3b82f6;
  border-right: 3px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.spinner-core {
  width: 40%;
  height: 40%;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  animation: pulse 2s ease-in-out infinite;
  position: absolute;
  top: 30%;
  left: 30%;
}

.error-icon {
  color: #ef4444;
  margin-bottom: 16px;
}

/* ==================== 文件列表区域 ==================== */

.file-list-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/**
 * 测试区域容器（两列布局）
 */
.test-sections-container {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.test-sections-container .file-section {
  flex: 1;
  min-width: 300px;
}

/**
 * 文件列表布局
 */
.file-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/**
 * 文件列表项
 */
.file-list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: #f8f9fa;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.file-list-item:hover {
  background-color: #f0f2f5;
  border-color: #d1d5db;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.file-list-item-info {
  flex: 1;
  min-width: 0;
}

.file-list-item-name {
  font-size: 16px;
  font-weight: 500;
  color: #1f2937;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.file-list-item-meta {
  font-size: 14px;
  color: #6b7280;
}

.file-list-item-updated {
  font-family: 'Monaco', 'Menlo', monospace;
}

/**
 * 文件列表项操作按钮
 */
.file-list-item-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

/**
 * 空列表项
 */
.empty-list-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
  background-color: #fafafa;
  border: 2px dashed #e5e7eb;
  border-radius: 8px;
  min-height: 200px;
}

.empty-list-item p {
  margin: 0 0 8px 0;
  color: #6b7280;
  font-size: 14px;
}

.empty-list-item .empty-hint {
  font-size: 12px !important;
  color: #9ca3af !important;
}

/**
 * 文件分区
 */
.file-section {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

/**
 * 分区头部
 */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e5e7eb;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  font-size: var(--font-size-20px, 20px);
  font-weight: var(--font-weight-semibold, 600);
  color: var(--color-text-primary, #1f2937);
  line-height: var(--line-height-tight, 1.25);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.section-count {
  font-size: 14px;
  font-weight: 400;
  color: #6b7280;
}

/**
 * 文件网格
 */
.file-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

/**
 * 空文件卡片
 */
.empty-file-card {
  background-color: #fafafa;
  border: 2px dashed #e5e7eb;
  border-radius: 8px;
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  min-height: 200px;
}

.empty-icon {
  color: #d1d5db;
  margin-bottom: 12px;
}

.empty-file-card p {
  margin: 0 0 8px 0;
  color: #6b7280;
  font-size: 14px;
}

.empty-hint {
  font-size: 12px !important;
  color: #9ca3af !important;
}

/* ==================== 弹窗样式 ==================== */

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal-content {
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;
  width: 90%;
  max-width: 480px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h4 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.modal-close-btn {
  width: 32px;
  height: 32px;
  background-color: transparent;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #6b7280;
}

.modal-close-btn:hover {
  background-color: #f0f0f0;
  border-color: #d1d5db;
  color: #1f2937;
}

.modal-body {
  margin-bottom: 20px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
}

/* ==================== 表单样式 ==================== */

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.required {
  color: #ef4444;
  margin-left: 4px;
}

.form-input {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  color: #1f2937;
  background-color: #ffffff;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* ==================== 按钮样式 ==================== */

.action-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 10px 20px;
  background-color: #3b82f6;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 1px 2px rgba(59, 130, 246, 0.2);
}

.action-btn:hover {
  background-color: #2563eb;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.action-btn:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* 小尺寸按钮 */
.action-btn.small {
  padding: 6px 12px;
  font-size: 12px;
  gap: 2px;
}

/* 轮廓按钮 */
.action-btn.small.outline {
  background-color: transparent;
  color: #4b5563;
  border: 1px solid #e5e7eb;
  box-shadow: none;
}

.action-btn.small.outline:hover {
  background-color: #f0f0f0;
  border-color: #d1d5db;
  transform: translateY(-1px);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

/* 危险按钮 */
.action-btn.small.danger {
  background-color: #ef4444;
  box-shadow: 0 1px 2px rgba(239, 68, 68, 0.2);
}

.action-btn.small.danger:hover {
  background-color: #dc2626;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.btn-text {
  padding: 10px 20px;
  background-color: transparent;
  color: #4b5563;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-text:hover {
  background-color: #f0f0f0;
  border-color: #d1d5db;
}

/* ==================== 动画 ==================== */

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(0.9);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.1);
    opacity: 1;
  }
}

/* ==================== 响应式 ==================== */

@media (max-width: 768px) {
  .game-directory-container {
    padding: 8px;
  }
  
  .page-header {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
  
  .header-actions {
    justify-content: space-between;
  }
  
  .file-grid {
    grid-template-columns: 1fr;
  }
  
  .game-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}
</style>