<template>
  <div class="game-management-container">
    <!-- 头部区域：标题和环境标识 -->
    <div class="page-header">
      <div class="header-left">
        <h3>游戏配置列表</h3>
        <span class="env-badge" :class="env">
          {{ env === 'test' ? '测试环境' : '线上环境' }}
        </span>
      </div>
      <button class="action-btn" @click="showAddGameModal = true">
        新增游戏
      </button>
    </div>

    <!-- 查询区域 -->
    <div class="search-bar">
      <div class="search-item checkbox-item">
        <label class="checkbox-label">
          <input
            type="checkbox"
            v-model="onlyMine"
          />
          <span>仅看我的</span>
        </label>
      </div>
      <div class="search-item">
        <label>游戏ID</label>
        <input
          type="text"
          v-model="searchGameId"
          placeholder="请输入游戏ID"
          class="search-input"
          @keyup.enter="handleSearch"
        />
      </div>
      <div class="search-item">
        <label>游戏名</label>
        <input
          type="text"
          v-model="searchGameName"
          placeholder="请输入游戏名称"
          class="search-input"
          @keyup.enter="handleSearch"
        />
      </div>
      <div class="search-item">
        <label>时间筛选</label>
        <select
          v-model="searchTimeRange"
          class="search-select"
        >
          <option
            v-for="option in TIME_RANGE_OPTIONS"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
      </div>
      <button class="action-btn small" @click="handleSearch">
        查询
      </button>
      <button class="action-btn small outline" @click="handleReset">
        重置
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
            <th>操作</th>
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
        <el-icon :size="48" class="empty-icon"><Box /></el-icon>
        <p>暂无游戏配置</p>
        <button class="action-btn" @click="showAddGameModal = true">创建第一个游戏</button>
      </div>
    </div>
    
    <!-- 新增游戏弹窗 -->
    <div v-if="showAddGameModal" class="modal-overlay" @click="closeAddGameModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h4>新增游戏</h4>
          <button class="modal-close-btn" @click="closeAddGameModal">
            <el-icon :size="16"><Close /></el-icon>
          </button>
        </div>
        <div class="modal-body">
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
      :is-read-only="isReadOnly"
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
</template>

<script setup>
/**
 * GameManagement.vue - 游戏管理页面
 * 
 * 功能：游戏列表展示、新增游戏、编辑游戏、删除游戏
 * 每个环境（test/online）独立为一个虚拟标签页
 * 
 * @author Frontend Architect
 * @since 2026-03-19
 */

import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { ElNotification } from 'element-plus'
import { Box, Close } from '@element-plus/icons-vue'
import GameInfoModal from '../../components/GameInfo.vue'
import { FileType, getAllGames, addNewGame as addNewGameToMock, updateGame, createGameFile, deleteGame as deleteGameApi } from '../../api/gameApi.js'

// ==================== LocalStorage Keys ====================
const ONLY_MINE_KEY = 'gameManagement_onlyMine'
const FILTER_STATE_KEY = 'gameManagement_filterState'

// ==================== 时间筛选常量 ====================
const TIME_RANGE_OPTIONS = [
  { label: '全部', value: 'all' },
  { label: '今天', value: 'today' },
  { label: '近7天', value: 'week' },
  { label: '近30天', value: 'month' },
  { label: '本月', value: 'currentMonth' }
]

// ==================== 路由和Props ====================
const route = useRoute()

/**
 * 环境参数（test/online）
 * 从路由query中读取
 */
const env = ref('test')

// ==================== 状态管理 ====================
const showAddGameModal = ref(false)
const newGameName = ref('')
const newGameDescription = ref('')
const showLoading = ref(false)
const showEditModal = ref(false)
const isReadOnly = ref(false)
const currentGame = ref(null)
const gameConfigs = ref([])
// 查询相关状态
const searchGameName = ref('')
const searchGameId = ref('')
const onlyMine = ref(false)
const searchTimeRange = ref('all')
// 原始游戏列表数据
const originalGameConfigs = ref([])

// ==================== 生命周期钩子 ====================
onMounted(async () => {
  // 从路由query中读取环境参数
  const envParam = route.query.env
  if (envParam && (envParam === 'test' || envParam === 'online')) {
    env.value = envParam
  }

  // 恢复仅看我的状态
  const cachedOnlyMine = localStorage.getItem(ONLY_MINE_KEY)
  if (cachedOnlyMine !== null) {
    onlyMine.value = cachedOnlyMine === 'true'
  }

  // 恢复筛选状态
  loadFilterState()

  // 加载游戏列表
  await loadGames()
})

/**
 * 保存筛选状态到localStorage
 */
function saveFilterState() {
  const state = {
    searchGameId: searchGameId.value,
    searchGameName: searchGameName.value,
    onlyMine: onlyMine.value,
    searchTimeRange: searchTimeRange.value
  }
  localStorage.setItem(FILTER_STATE_KEY, JSON.stringify(state))
}

/**
 * 从localStorage恢复筛选状态
 */
function loadFilterState() {
  const cached = localStorage.getItem(FILTER_STATE_KEY)
  if (cached) {
    try {
      const state = JSON.parse(cached)
      searchGameId.value = state.searchGameId || ''
      searchGameName.value = state.searchGameName || ''
      onlyMine.value = state.onlyMine || false
      searchTimeRange.value = state.searchTimeRange || 'all'
    } catch (e) {
      console.error('恢复筛选状态失败:', e)
    }
  }
}

// 监听onlyMine变化，保存到localStorage
watch(onlyMine, (newVal) => {
  localStorage.setItem(ONLY_MINE_KEY, String(newVal))
  saveFilterState()
})

// 监听所有筛选条件，状态变化时保存
watch([searchGameId, searchGameName, onlyMine, searchTimeRange], () => {
  saveFilterState()
})

// ==================== 方法函数 ====================

/**
 * 加载游戏列表
 * @description 从API获取所有游戏配置
 */
async function loadGames() {
  try {
    const games = await getAllGames()
    const formattedGames = games.map(game => ({
      ...game,
      uniqueId: game.unique_id,
      createdBy: game.created_by,
      updatedBy: game.updated_by,
      createdAt: game.created_at,
      updatedAt: game.updated_at,
      test_apk_ids: game.test_apk_ids || [],
      gray_apk_ids: game.gray_apk_ids || [],
      pro_apk_ids: game.pro_apk_ids || []
    }))
    originalGameConfigs.value = formattedGames
    gameConfigs.value = sortGamesByEditTime(formattedGames)
  } catch (error) {
    console.error('加载游戏列表失败:', error)
    ElNotification({
      title: '错误',
      message: '加载游戏列表失败，请检查后端服务是否启动',
      type: 'error',
      duration: 3000
    })
  }
}

/**
 * 按编辑时间排序游戏列表（倒序）
 * @param {Array} games - 游戏列表
 * @returns {Array} 排序后的游戏列表
 */
function sortGamesByEditTime(games) {
  return [...games].sort((a, b) => {
    const timeA = new Date(a.updatedAt || 0).getTime()
    const timeB = new Date(b.updatedAt || 0).getTime()
    return timeB - timeA
  })
}

/**
 * 处理查询
 * @description 根据查询条件过滤游戏列表
 */
function handleSearch() {
  let filteredGames = [...originalGameConfigs.value]

  // 按游戏名过滤
  if (searchGameName.value.trim()) {
    const nameKeyword = searchGameName.value.trim().toLowerCase()
    filteredGames = filteredGames.filter(game =>
      game.name && game.name.toLowerCase().includes(nameKeyword)
    )
  }

  // 按游戏ID过滤
  if (searchGameId.value.trim()) {
    const idKeyword = searchGameId.value.trim()
    filteredGames = filteredGames.filter(game =>
      game.id && game.id.toString().includes(idKeyword)
    )
  }

  // 仅看我的
  if (onlyMine.value) {
    // 假设当前用户为 'admin'，实际项目中应从登录状态获取
    const currentUser = 'admin'
    filteredGames = filteredGames.filter(game =>
      game.createdBy === currentUser || game.updatedBy === currentUser
    )
  }

  // 时间筛选
  filteredGames = filterByTimeRange(filteredGames, searchTimeRange.value)

  gameConfigs.value = filteredGames
}

/**
 * 根据时间范围过滤游戏列表
 * @param {Array} games - 游戏列表
 * @param {string} timeRange - 时间范围值
 * @returns {Array} 过滤后的游戏列表
 */
function filterByTimeRange(games, timeRange) {
  if (timeRange === 'all') return games

  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  return games.filter(game => {
    const createdAt = new Date(game.createdAt)

    switch (timeRange) {
      case 'today':
        return createdAt >= today
      case 'week':
        const weekAgo = new Date(today)
        weekAgo.setDate(weekAgo.getDate() - 7)
        return createdAt >= weekAgo
      case 'month':
        const monthAgo = new Date(today)
        monthAgo.setDate(monthAgo.getDate() - 30)
        return createdAt >= monthAgo
      case 'currentMonth':
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
        return createdAt >= monthStart
      default:
        return true
    }
  })
}

/**
 * 处理重置
 * @description 清空查询条件并恢复原始列表
 */
function handleReset() {
  searchGameName.value = ''
  searchGameId.value = ''
  onlyMine.value = false
  searchTimeRange.value = 'all'
  gameConfigs.value = sortGamesByEditTime([...originalGameConfigs.value])
}

/**
 * 进入游戏目录详情页
 * @param {number} gameId - 游戏ID
 */
function enterGameDirectory(gameId) {
  if (window.openGameDirectoryTab) {
    const game = gameConfigs.value.find(g => g.id === gameId)
    const gameName = game ? game.name : null
    
    window.openGameDirectoryTab(
      gameId.toString(),
      gameName,
      env.value
    )
  }
}

/**
 * 关闭新增游戏弹窗
 */
function closeAddGameModal() {
  showAddGameModal.value = false
  newGameName.value = ''
  newGameDescription.value = ''
}

/**
 * 新增游戏
 */
async function addNewGame() {
  if (!newGameName.value.trim()) {
    ElNotification({
      title: '警告',
      message: '请输入游戏名称',
      type: 'warning',
      duration: 3000
    })
    return
  }
  
  try {
    const now = new Date().toISOString()
    
    const newGameData = {
      name: newGameName.value.trim(),
      description: newGameDescription.value.trim(),
      createdBy: 'admin',
      updatedBy: 'admin'
    }
    
    const newGame = await addNewGameToMock(newGameData)
    
    const defaultDraft = {
      type: FileType.DRAFT,
      name: '默认草稿',
      content: JSON.stringify({
        gameName: newGameName.value,
        description: newGameDescription.value,
        createdAt: now
      }, null, 2),
      updatedBy: 'admin'
    }
    
    await createGameFile(newGame.id, defaultDraft)
    await loadGames()
    closeAddGameModal()
    
    showLoading.value = true
    
    setTimeout(() => {
      showLoading.value = false
      enterGameDirectory(newGame.id)
    }, 1500)
  } catch (error) {
    console.error('创建游戏失败:', error)
    ElNotification({
      title: '错误',
      message: '创建游戏失败: ' + error.message,
      type: 'error',
      duration: 3000
    })
  }
}

/**
 * 编辑游戏
 * @param {Object} game - 游戏配置对象
 */
function editGame(game) {
  currentGame.value = {
    ...game,
    test_apk_ids: game.test_apk_ids || [],
    gray_apk_ids: game.gray_apk_ids || [],
    pro_apk_ids: game.pro_apk_ids || []
  }
  isReadOnly.value = false
  showEditModal.value = true
}

/**
 * 查看游戏
 * @param {Object} game - 游戏配置对象
 */
function viewGame(game) {
  currentGame.value = {
    ...game,
    test_apk_ids: game.test_apk_ids || [],
    gray_apk_ids: game.gray_apk_ids || [],
    pro_apk_ids: game.pro_apk_ids || []
  }
  isReadOnly.value = true
  showEditModal.value = true
}

/**
 * 删除游戏
 * @param {number} gameId - 游戏ID
 */
async function deleteGame(gameId) {
  if (confirm('确定要删除这个游戏配置吗？')) {
    try {
      await deleteGameApi(gameId)
      await loadGames()
      ElNotification({
        title: '成功',
        message: '游戏配置已删除',
        type: 'success',
        duration: 3000
      })
    } catch (error) {
      console.error('删除游戏失败:', error)
      ElNotification({
        title: '错误',
        message: '删除游戏失败: ' + error.message,
        type: 'error',
        duration: 3000
      })
    }
  }
}

/**
 * 关闭编辑游戏弹窗
 */
function closeEditModal() {
  showEditModal.value = false
  currentGame.value = null
  isReadOnly.value = false
}

/**
 * 保存游戏编辑
 * @param {Object} gameData - 更新后的游戏数据
 */
async function saveGameEdit(gameData) {
  try {
    const snakeCaseGameData = {
      name: gameData.name,
      description: gameData.description,
      region: gameData.region,
      collaborators: gameData.collaborators,
      test_apk_ids: gameData.test_apk_ids,
      gray_apk_ids: gameData.gray_apk_ids,
      pro_apk_ids: gameData.pro_apk_ids,
      unique_id: gameData.uniqueId
    }
    
    const updatedGame = await updateGame(currentGame.value.id, snakeCaseGameData)
    
    if (updatedGame) {
      const updatedGameIndex = gameConfigs.value.findIndex(game => game.id === currentGame.value.id)
      if (updatedGameIndex > -1) {
        gameConfigs.value[updatedGameIndex] = {
          ...gameConfigs.value[updatedGameIndex],
          name: gameData.name,
          description: gameData.description,
          region: gameData.region,
          collaborators: gameData.collaborators,
          test_apk_ids: gameData.test_apk_ids || [],
          gray_apk_ids: gameData.gray_apk_ids || [],
          pro_apk_ids: gameData.pro_apk_ids || [],
          uniqueId: gameData.uniqueId,
          updatedAt: new Date().toISOString()
        }
      }
      closeEditModal()
      ElNotification({
        title: '成功',
        message: '游戏配置已更新',
        type: 'success',
        duration: 3000
      })
    }
  } catch (error) {
    console.error('更新游戏失败:', error)
    ElNotification({
      title: '错误',
      message: '更新游戏失败: ' + error.message,
      type: 'error',
      duration: 3000
    })
  }
}

/**
 * 格式化日期时间
 * @param {string} dateString - ISO格式的日期字符串
 * @returns {string} 格式化后的日期时间字符串
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
.game-management-container {
  width: 100%;
  height: 100%;
  padding: 24px;
  overflow-y: auto;
  background-color: #f5f5f5;
}

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

/* 查询区域样式 */
.search-bar {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
  padding: 16px 20px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.search-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.search-item label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  white-space: nowrap;
}

.search-input {
  width: 180px;
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  color: #1f2937;
  background-color: #ffffff;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.search-input::placeholder {
  color: #9ca3af;
}

.checkbox-item {
  margin-left: 8px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  font-size: 14px;
  color: #374151;
  user-select: none;
}

.checkbox-label input[type="checkbox"] {
  width: 16px;
  height: 16px;
  cursor: pointer;
  accent-color: #3b82f6;
}

.search-select {
  width: 120px;
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  color: #1f2937;
  background-color: #ffffff;
  transition: all 0.3s ease;
  cursor: pointer;
}

.search-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

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

.game-name {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  color: #1f2937;
}

.game-description {
  color: #6b7280;
  font-size: 14px;
}

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

.action-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

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

.action-btn.small {
  padding: 6px 12px;
  font-size: 12px;
  gap: 4px;
}

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

.action-btn.small.danger {
  background-color: #ef4444;
  box-shadow: 0 1px 2px rgba(239, 68, 68, 0.2);
}

.action-btn.small.danger:hover {
  background-color: #dc2626;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

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
