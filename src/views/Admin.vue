<template>
  <div class="admin-container">
    <!-- 左侧菜单 -->
    <div class="left-sidebar">
      <h2>后台管理</h2>
      <div class="backend-menu">
        <!-- 游戏管理-test 菜单 -->
        <button 
          @click="switchEnv('test')" 
          class="menu-item"
          :class="{ 'active': activeEnv === 'test' }"
        >
          <Icon name="grid" size="16" class="mr-2" />
          游戏管理-test
        </button>
        <!-- 游戏管理-online 菜单 -->
        <button 
          @click="switchEnv('online')" 
          class="menu-item"
          :class="{ 'active': activeEnv === 'online' }"
        >
          <Icon name="grid" size="16" class="mr-2" />
          游戏管理-online
        </button>
        <h4>！！！这里搞两个菜单主要是为了演示发布系统的双环境差异</h4>
      </div>
    </div>
    
    <!-- 右侧内容 -->
    <div class="right-content">
      <!-- 游戏配置列表区域 -->
      <div v-if="activePanel === 'gameConfigs'">
        <!-- 头部区域：标题和新增按钮 -->
        <div class="page-header">
          <div class="header-left">
            <h3>游戏配置列表</h3>
            <span class="env-badge" :class="activeEnv">
              {{ activeEnv === 'test' ? '测试环境' : '线上环境' }}
            </span>
          </div>
          <button class="action-btn" @click="showAddGameModal = true">
            
            新增游戏
          </button>
        </div>
        
        <!-- 游戏列表表格 -->
        <div class="config-table-container">
          <table class="config-table">
            <thead>
              <tr>
                <th style="width: 40px;">ID</th>
                <th style="width: 150px;">名称</th>
                <th style="width: 200px;">描述</th>
                <th style="width: 200px;">创建信息</th>
                <th style="width: 200px;">编辑信息</th>
                <th >操作</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="config in gameConfigs" 
                :key="config.id"
                class="config-table-row"
                @click.stop="enterGameDirectory(config.id)"
              >
                <td>{{ config.id }}</td>
                <td>
                  <div class="game-name">
                    {{ config.name }}
                  </div>
                </td>
                <td>
                  <span class="game-description">{{ config.description || '-' }}</span>
                </td>
                <td>
                  <div class="info-cell">
                    <div class="info-user">{{ config.createdBy || '系统' }}</div>
                    <div class="info-time">{{ formatDateTime(config.createdAt) }}</div>
                  </div>
                </td>
                <td>
                  <div class="info-cell">
                    <div class="info-user">{{ config.updatedBy || '系统' }}</div>
                    <div class="info-time">{{ formatDateTime(config.updatedAt) }}</div>
                  </div>
                </td>
                <td>
                  <div class="action-buttons">
                    <button class="action-btn small" @click.stop="enterGameDirectory(config.id)">
                     
                      进入
                    </button>
                    <button class="action-btn small outline" @click.stop="editGame(config)">
                    
                      编辑
                    </button>
                    <button class="action-btn small outline" @click.stop="viewGame(config)">
                      
                      查看
                    </button>
                    <button class="action-btn small danger" @click.stop="deleteGame(config.id)">
                   
                      删除
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          
          <!-- 空状态提示 -->
          <div v-if="gameConfigs.length === 0" class="empty-state">
            <Icon name="box" size="48" class="empty-icon" />
            <p>暂无游戏配置</p>
            <button class="action-btn" @click="showAddGameModal = true">创建第一个游戏</button>
          </div>
        </div>
      </div>
      
      <!-- 新增游戏弹窗 -->
      <div v-if="showAddGameModal" class="modal-overlay" @click="closeAddGameModal">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h4>新增游戏</h4>
            <button class="modal-close-btn" @click="closeAddGameModal">
              <Icon name="x" size="16" />
            </button>
          </div>
          <div class="modal-body">
            <!-- 游戏名称输入 -->
            <div class="form-group">
              <label for="gameName">
                游戏名称
                <span class="required">*</span>
              </label>
              <input 
                type="text" 
                id="gameName" 
                v-model="newGameName" 
                placeholder="请输入游戏名称"
                class="form-input"
                @keyup.enter="addNewGame"
              />
            </div>
            <!-- 游戏描述输入 -->
            <div class="form-group">
              <label for="gameDescription">游戏描述</label>
              <textarea 
                id="gameDescription" 
                v-model="newGameDescription" 
                placeholder="请输入游戏描述（可选）"
                class="form-textarea"
                rows="3"
              ></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn-text" @click="closeAddGameModal">取消</button>
            <button class="action-btn" @click="addNewGame" :disabled="!newGameName.trim()">
              确认
            </button>
          </div>
        </div>
      </div>

      <!-- 编辑游戏弹窗 -->
      <GameInfoModal
        v-if="showEditModal"
        :game="currentGame"
        :visible="showEditModal"
        @close="closeEditModal"
        @save="saveGameEdit"
      />
      
      <!-- Loading动画 -->
      <div v-if="showLoading" class="loading-overlay">
        <div class="loading-content">
          <div class="loading-spinner">
            <div class="spinner-core"></div>
          </div>
          <p class="loading-text">正在加载游戏配置...</p>
          <div class="loading-dots">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
          </div>
        </div>
      </div>
      
    </div>
  </div>
</template>

<script setup>
/**
 * Admin.vue - 游戏管理后台页面
 * 
 * 需求关联：
 * 1. 游戏列表展示（ID、名称、描述、创建/更新时间）
 * 2. 点击游戏行进入目录详情页
 * 3. 支持test/online环境切换
 * 4. 新增游戏后自动创建默认草稿
 * 
 * @author Frontend Architect
 * @since 2026-02-26
 */

import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Icon from '../components/Icon.vue'
import GameInfoModal from './gameinfo.vue'
import { FileType, getAllGames, addNewGame as addNewGameToMock, updateGame } from '../data/mockData.js'

// ==================== 路由相关 ====================
const router = useRouter()
const route = useRoute()

// ==================== 状态管理 ====================

/**
 * 当前激活的面板
 * @type {Ref<string>}
 */
const activePanel = ref('gameConfigs')

/**
 * 当前激活的环境（test/online）
 * @type {Ref<string>}
 */
const activeEnv = ref('test')

/**
 * 新增游戏弹窗显示状态
 * @type {Ref<boolean>}
 */
const showAddGameModal = ref(false)

/**
 * 新游戏名称输入
 * @type {Ref<string>}
 */
const newGameName = ref('')

/**
 * 新游戏描述输入
 * @type {Ref<string>}
 */
const newGameDescription = ref('')

/**
 * Loading动画显示状态
 * @type {Ref<boolean>}
 */
const showLoading = ref(false)

/**
 * 游戏编辑弹窗显示状态
 * @type {Ref<boolean>}
 */
const showEditModal = ref(false)

/**
 * 当前编辑的游戏数据
 * @type {Ref<Object>}
 */
const currentGame = ref(null)

// ==================== 数据模型 ====================

/**
 * 游戏配置列表数据
 * 数据模型：包含files数组，每个文件有type、name、content、updatedAt等字段
 * @type {Ref<Array<Object>>}
 */
const gameConfigs = ref(getAllGames())

// ==================== 计算属性 ====================

/**
 * 启用的配置数量
 * @type {ComputedRef<number>}
 */
const activeConfigs = computed(() => {
  return gameConfigs.value.length
})

/**
 * 最近更新的配置数量（7天内）
 * @type {ComputedRef<number>}
 */
const recentUpdates = computed(() => {
  const today = new Date()
  const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
  return gameConfigs.value.filter(config => {
    const updatedAt = new Date(config.updatedAt)
    return updatedAt >= sevenDaysAgo
  }).length
})

// ==================== 生命周期钩子 ====================

/**
 * 组件挂载时初始化
 * 从路由参数中读取环境设置
 */
onMounted(() => {
  // 从路由query中读取环境参数
  const env = route.query.env
  if (env && (env === 'test' || env === 'online')) {
    activeEnv.value = env
  }
})

// ==================== 方法函数 ====================

/**
 * 切换环境
 * @param {string} env - 环境类型（'test' 或 'online'）
 * @description 点击左侧菜单切换test/online环境
 */
function switchEnv(env) {
  activeEnv.value = env
  // 更新路由参数，保持环境状态
  router.replace({
    query: { ...route.query, env }
  })
}

/**
 * 进入游戏目录详情页
 * @param {number} gameId - 游戏ID
 * @description 点击游戏行跳转到目录详情页，携带环境参数
 */
function enterGameDirectory(gameId) {
  router.push({
    name: 'GameDirectory',
    params: { gameId: gameId.toString() },
    query: { env: activeEnv.value }
  })
}

/**
 * 关闭新增游戏弹窗
 * @description 关闭弹窗并清空输入内容
 */
function closeAddGameModal() {
  showAddGameModal.value = false
  newGameName.value = ''
  newGameDescription.value = ''
}

/**
 * 创建默认草稿文件
 * @returns {Object} 默认草稿文件对象
 * @description 为新游戏创建默认草稿配置
 */
function createDefaultDraft() {
  const now = new Date().toISOString()
  return {
    type: FileType.DRAFT,
    name: '默认草稿',
    content: JSON.stringify({
      gameName: newGameName.value,
      description: newGameDescription.value,
      createdAt: now
    }, null, 2),
    updatedAt: now,
    updatedBy: 'admin'
  }
}

/**
 * 新增游戏
 * @description 创建新游戏配置，自动添加默认草稿，完成后进入目录详情页
 */
function addNewGame() {
  if (!newGameName.value.trim()) {
    alert('请输入游戏名称')
    return
  }
  
  const now = new Date().toISOString()
  
  // 创建新游戏配置对象，包含files数组和默认草稿
  const newGameData = {
    name: newGameName.value.trim(),
    description: newGameDescription.value.trim(),
    createdBy: 'admin', // 默认为admin用户
    updatedBy: 'admin', // 默认为admin用户
    // 自动创建默认草稿
    files: [createDefaultDraft()]
  }
  
  // 添加到全局mock数据
  const newGame = addNewGameToMock(newGameData)
  
  // 更新本地游戏配置列表
  gameConfigs.value = getAllGames()
  
  // 关闭弹窗并清空输入
  closeAddGameModal()
  
  // 显示loading动画
  showLoading.value = true
  
  // 延迟一段时间后进入目录详情页，以展示loading动画
  setTimeout(() => {
    // 关闭loading动画
    showLoading.value = false
    
    // 进入目录详情页
    enterGameDirectory(newGame.id)
  }, 1500) // 1.5秒延迟，展示动画效果
}

/**
 * 编辑游戏
 * @param {Object} game - 游戏配置对象
 * @description 打开编辑游戏的弹窗，传递游戏数据
 */
function editGame(game) {
  currentGame.value = game
  showEditModal.value = true
}

/**
 * 查看游戏
 * @param {Object} game - 游戏配置对象
 * @description 查看游戏的详细信息
 */
function viewGame(game) {
  // 这里可以实现查看游戏详情的逻辑
  console.log('查看游戏:', game)
  alert(`查看游戏: ${game.name}\n描述: ${game.description}\n创建人: ${game.createdBy}\n创建时间: ${formatDateTime(game.createdAt)}\n编辑人: ${game.updatedBy}\n编辑时间: ${formatDateTime(game.updatedAt)}`)
}

/**
 * 删除游戏
 * @param {number} gameId - 游戏ID
 * @description 删除指定ID的游戏配置
 */
function deleteGame(gameId) {
  if (confirm('确定要删除这个游戏配置吗？')) {
    const index = gameConfigs.value.findIndex(config => config.id === gameId)
    if (index !== -1) {
      gameConfigs.value.splice(index, 1)
      console.log('删除游戏ID:', gameId)
      alert('游戏配置已删除')
    }
  }
}

/**
 * 关闭编辑游戏弹窗
 * @description 关闭弹窗并清空当前编辑的游戏数据
 */
function closeEditModal() {
  showEditModal.value = false
  currentGame.value = null
}

/**
 * 保存游戏编辑
 * @param {Object} gameData - 更新后的游戏数据
 * @description 保存游戏数据并更新列表
 */
function saveGameEdit(gameData) {
  const updatedGame = updateGame(currentGame.value.id, gameData)
  if (updatedGame) {
    // 更新本地游戏配置列表
    gameConfigs.value = getAllGames()
    // 关闭弹窗
    closeEditModal()
    // 显示成功提示
    alert('游戏配置已更新')
  }
}

/**
 * 格式化日期时间
 * @param {string} dateString - ISO格式的日期字符串
 * @returns {string} 格式化后的日期时间字符串
 * @description 将ISO日期格式化为本地化的日期时间显示
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
 * 管理后台容器
 * 采用flex布局，左侧固定宽度侧边栏，右侧自适应内容区
 */
.admin-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
}

/* ==================== 左侧菜单样式 ==================== */

/**
 * 左侧侧边栏
 * 固定宽度240px，亮色系背景
 */
.left-sidebar {
  width: 240px;
  background-color: #ffffff;
  color: #1f2937;
  padding: 20px;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05);
}

.left-sidebar h2 {
  margin-top: 0;
  font-size: 18px;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 10px;
  color: #1f2937;
  font-weight: 600;
}

.backend-menu {
  margin: 20px 0;
}

/**
 * 菜单项按钮
 * 亮色系风格，有hover和active状态
 */
.menu-item {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 12px 16px;
  margin-bottom: 8px;
  background-color: #fafafa;
  color: #4b5563;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  text-align: left;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  font-size: 14px;
  gap: 8px;
}

.menu-item:hover {
  background-color: #f0f0f0;
  border-color: #3b82f6;
  color: #3b82f6;
}

.menu-item.active {
  background-color: #3b82f6;
  color: #ffffff;
  border-color: #3b82f6;
}

.menu-item.active:hover {
  background-color: #2563eb;
}

.menu-item::after {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 4px;
  height: 100%;
  background-color: #3b82f6;
  transform: scaleY(0);
  transform-origin: top;
  transition: transform 0.3s ease;
}

.menu-item:hover::after,
.menu-item.active::after {
  transform: scaleY(1);
}

.menu-item.active::after {
  background-color: #ffffff;
}

.mr-2 {
  margin-right: 8px;
}

/* ==================== 右侧内容样式 ==================== */

/**
 * 右侧内容区域
 * 自适应宽度，亮色系背景
 */
.right-content {
  flex: 1;
  background-color: #f5f5f5;
  color: #1f2937;
  padding: 24px;
  overflow-y: auto;
}

/* ==================== 页面头部样式 ==================== */

/**
 * 页面头部
 * flex布局，标题和按钮两端对齐
 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e5e7eb;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.page-header h3 {
  margin: 0;
  font-size: 20px;
  color: #1f2937;
  font-weight: 600;
}

/**
 * 环境标签
 * 显示当前激活的环境（test/online）
 */
.env-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
}

.env-badge.test {
  background-color: rgba(59, 130, 246, 0.15);
  color: #3b82f6;
  border: 1px solid #3b82f6;
}

.env-badge.online {
  background-color: rgba(16, 185, 129, 0.15);
  color: #10b981;
  border: 1px solid #10b981;
}

/* ==================== 表格样式 ==================== */

/**
 * 配置表格容器
 * 圆角边框，阴影效果
 */
.config-table-container {
  margin-top: 0;
  overflow-x: auto;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.config-table {
  width: 100%;
  border-collapse: collapse;
  background-color: #ffffff;
  border-radius: 12px;
  overflow: hidden;
}

.config-table th,
.config-table td {
  padding: 8px 12px;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

.config-table th {
  background-color: #fafafa;
  font-weight: 600;
  font-size: 13px;
  color: #4b5563;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.config-table-row {
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.config-table-row:hover {
  background-color: #f0f0f0;
}

.config-table-row:last-child td {
  border-bottom: none;
}

/**
 * 游戏名称样式
 */
.game-name {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  color: #1f2937;
}

.game-icon {
  color: #3b82f6;
}

/**
 * 游戏描述样式
 */
.game-description {
  color: #6b7280;
  font-size: 14px;
}

/**
 * 时间文本样式
 */
.time-text {
  color: #6b7280;
  font-size: 13px;
  font-family: 'Monaco', 'Menlo', monospace;
}

/**
 * 信息单元格样式
 */
.info-cell {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-user {
  font-size: 13px;
  font-weight: 500;
  color: #374151;
}

.info-time {
  font-size: 12px;
  color: #6b7280;
  font-family: 'Monaco', 'Menlo', monospace;
}

/**
 * 操作按钮组样式
 */
.action-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

/**
 * 小按钮样式
 */
.action-btn.small {
  padding: 6px 12px;
  font-size: 12px;
  gap: 4px;
}

/**
 * 次要按钮样式
 */
.action-btn.small.secondary {
  background-color: #f59e0b;
  box-shadow: 0 1px 2px rgba(245, 158, 11, 0.2);
}

.action-btn.small.secondary:hover {
  background-color: #d97706;
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
}

/**
 * 轮廓按钮样式
 */
.action-btn.small.outline {
  background-color: transparent;
  color: #3b82f6;
  border: 1px solid #3b82f6;
  box-shadow: none;
}

.action-btn.small.outline:hover {
  background-color: rgba(59, 130, 246, 0.1);
  transform: translateY(-1px);
}

/**
 * 危险按钮样式
 */
.action-btn.small.danger {
  background-color: #ef4444;
  box-shadow: 0 1px 2px rgba(239, 68, 68, 0.2);
}

.action-btn.small.danger:hover {
  background-color: #dc2626;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

/* ==================== 空状态样式 ==================== */

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #9ca3af;
}

.empty-icon {
  margin-bottom: 16px;
  color: #d1d5db;
}

.empty-state p {
  margin: 0 0 20px 0;
  font-size: 16px;
}

/* ==================== 按钮样式 ==================== */

/**
 * 主要操作按钮
 * 亮色系蓝色主题
 */
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

.action-btn:active {
  background-color: #1d4ed8;
  transform: translateY(0);
}

.action-btn:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.mr-1 {
  margin-right: 4px;
}

/**
 * 文本按钮
 */
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

.form-input,
.form-textarea {
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

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
}

/* ==================== Loading动画样式 ==================== */

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  backdrop-filter: blur(10px);
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
  padding: 48px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  min-width: 320px;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.loading-content::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6, #3b82f6);
  background-size: 200% 100%;
  animation: gradientSlide 2s linear infinite;
}

.loading-spinner {
  width: 80px;
  height: 80px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-spinner::before {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  border: 4px solid #e5e7eb;
  border-radius: 50%;
}

.loading-spinner::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  border: 4px solid transparent;
  border-top: 4px solid #3b82f6;
  border-right: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.spinner-core {
  width: 50%;
  height: 50%;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  animation: pulse 2s ease-in-out infinite;
}

.loading-text {
  font-size: 16px;
  font-weight: 500;
  color: #374151;
  margin: 0;
}

.loading-dots {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #3b82f6;
  animation: dotPulse 1.4s ease-in-out infinite;
}

.dot:nth-child(2) {
  animation-delay: 0.2s;
}

.dot:nth-child(3) {
  animation-delay: 0.4s;
}

/* ==================== 动画关键帧 ==================== */

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

@keyframes dotPulse {
  0%, 100% {
    transform: scale(0.6);
    opacity: 0.4;
  }
  50% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes gradientSlide {
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 200% 50%;
  }
}
</style>
