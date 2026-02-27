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
        <!-- 测试约局/灰度约局区域 -->
        <div class="file-section">
          <div class="section-header">
            <h3 class="section-title">
              <Icon name="layout-dashboard" size="16" class="mr-2" />
              {{ activeEnv === 'online' ? '灰度约局' : '测试约局' }}
              <span class="meta-item">游戏ID：10001</span>
            </h3>
          </div>
          <FileCard 
            v-if="testMatchFile" 
            :key="testMatchFile.id || 'testMatch'"
            :file="testMatchFile"
            :environment="activeEnv"
            @view="viewFile"
            @copy="copyFile"
            @copy-to="showCopyToModal"
            @publish="publishFile"
            @view-history="handleViewHistory"
          />
          <div v-else class="empty-file-card">
            <Icon name="inbox" size="32" class="empty-icon" />
            <p>暂无测试约局配置</p>
            <p class="empty-hint">请从草稿提测创建</p>
          </div>
        </div>

        <!-- 测试金币/灰度金币区域 -->
        <div class="file-section">
          <div class="section-header">
            <h3 class="section-title">
              <Icon name="layout-dashboard" size="16" class="mr-2" />
              {{ activeEnv === 'online' ? '灰度金币' : '测试金币' }}
              <span class="meta-item">游戏ID：10002</span>
            </h3>
          </div>
          <FileCard 
            v-if="testGoldFile" 
            :key="testGoldFile.id || 'testGold'"
            :file="testGoldFile"
            :environment="activeEnv"
            @view="viewFile"
            @copy="copyFile"
            @copy-to="showCopyToModal"
            @publish="publishFile"
            @view-history="handleViewHistory"
          />
          <div v-else class="empty-file-card">
            <Icon name="inbox" size="32" class="empty-icon" />
            <p>暂无测试金币配置</p>
            <p class="empty-hint">请从草稿提测创建</p>
          </div>
        </div>
      </div>

      <!-- 正式模块区域（仅在线环境显示） -->
      <div v-if="activeEnv === 'online'" class="test-sections-container">
        <!-- 正式约局区域 -->
        <div class="file-section">
          <div class="section-header">
            <h3 class="section-title">
              <Icon name="layout-dashboard" size="16" class="mr-2" />
              正式约局
              <span class="meta-item">游戏ID：10003</span>
            </h3>
          </div>
          <FileCard 
            v-if="officialMatchFile" 
            :key="officialMatchFile.id || 'officialMatch'"
            :file="officialMatchFile"
            :environment="activeEnv"
            @view="viewFile"
            @copy="copyFile"
            @copy-to="showCopyToModal"
            @view-history="handleViewHistory"
          />
          <div v-else class="empty-file-card">
            <Icon name="inbox" size="32" class="empty-icon" />
            <p>暂无正式约局配置</p>
            <p class="empty-hint">请从灰度发布创建</p>
          </div>
        </div>

        <!-- 正式金币区域 -->
        <div class="file-section">
          <div class="section-header">
            <h3 class="section-title">
              <Icon name="layout-dashboard" size="16" class="mr-2" />
              正式金币
              <span class="meta-item">游戏ID：10004</span>
            </h3>
          </div>
          <FileCard 
            v-if="officialGoldFile" 
            :key="officialGoldFile.id || 'officialGold'"
            :file="officialGoldFile"
            :environment="activeEnv"
            @view="viewFile"
            @copy="copyFile"
            @copy-to="showCopyToModal"
            @view-history="handleViewHistory"
          />
          <div v-else class="empty-file-card">
            <Icon name="inbox" size="32" class="empty-icon" />
            <p>暂无正式金币配置</p>
            <p class="empty-hint">请从灰度发布创建</p>
          </div>
        </div>
      </div>

      <!-- 草稿区域 -->
      <div v-if="activeEnv === 'test'" class="file-section">
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
              <div class="file-list-item-name"> 
                <span class="file-list-item-name">{{ file.name }} </span>
              <span class="file-list-item-id">ID: {{ file.id }}</span>
            </div>
              <div class="file-list-item-meta">
                <span class="file-list-item-updated">更新于 {{ formatDateTime(file.updatedAt) }}</span>
                <span class="file-list-item-separator">|</span>
                <span class="file-list-item-updated-by">操作人：{{ file.updatedBy || '未知' }}</span>
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
    
    <!-- 提测记录弹窗 -->
    <SubmitHistoryModal 
      :visible="showSubmitHistoryModal"
      :submit-history="game?.submitHistory || []"
      :target-type="currentViewFile?.type"
      @close="closeSubmitHistoryModal"
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
import SubmitHistoryModal from '../components/SubmitHistoryModal.vue'
import { FileType, getGameById, getOtherGames, updateGame, createGameFile, updateGameFile, createSubmitHistory } from '../api/gameApi.js'

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

/**
 * 提测记录弹窗状态
 * @type {Ref<boolean>}
 */
const showSubmitHistoryModal = ref(false)

/**
 * 当前查看提测记录的文件
 * @type {Ref<Object|null>}
 */
const currentViewFile = ref(null)

/**
 * 其他游戏列表
 * @type {Ref<Array>}
 */
const otherGames = ref([])

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
 * 正式约局文件
 * @type {ComputedRef<Object|null>}
 */
const officialMatchFile = computed(() => {
  if (!game.value?.files) return null
  return game.value.files.find(file => file.type === FileType.OFFICIAL_MATCH) || null
})

/**
 * 正式金币文件
 * @type {ComputedRef<Object|null>}
 */
const officialGoldFile = computed(() => {
  if (!game.value?.files) return null
  return game.value.files.find(file => file.type === FileType.OFFICIAL_GOLD) || null
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
async function loadGameData() {
  loading.value = true
  error.value = null
  
  try {
    const gameId = route.params.gameId
    const gameData = await getGameById(gameId)
    if (gameData) {
      // 转换字段命名：蛇形命名 -> 驼峰命名
      game.value = {
        ...gameData,
        uniqueId: gameData.unique_id,
        createdBy: gameData.created_by,
        updatedBy: gameData.updated_by,
        createdAt: gameData.created_at,
        updatedAt: gameData.updated_at,
        // 转换文件数组中的字段命名
        files: gameData.files?.map(file => ({
          ...file,
          updatedBy: file.updated_by,
          createdAt: file.created_at,
          updatedAt: file.updated_at
        })) || [],
        // 转换提测记录中的字段命名
        submitHistory: gameData.submitHistory?.map(history => ({
          ...history,
          createdBy: history.created_by,
          createdAt: history.created_at
        })) || []
      }
      
      // 加载其他游戏列表
      const games = await getOtherGames(gameId)
      otherGames.value = games.map(g => ({
        ...g,
        createdBy: g.created_by,
        updatedBy: g.updated_by,
        createdAt: g.created_at,
        updatedAt: g.updated_at
      }))
    } else {
      error.value = '游戏不存在'
    }
  } catch (err) {
    error.value = '加载失败，请重试'
    console.error('加载游戏数据失败:', err)
  } finally {
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
  // 重新加载游戏数据，确保UI正确显示
  loadGameData()
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
  // 调用全局的openGameTab方法打开新标签页
  if (window.openGameTab) {
    window.openGameTab(
      game.value.id,
      game.value.name,
      file.id,
      file.type,
      activeEnv.value
    )
  } else {
    // 兼容处理：如果openGameTab方法不存在，使用原有的路由跳转
    router.push({
      name: 'Workbench',
      params: { id: game.value.id },
      query: {
        fileId: file.id,
        fileType: file.type,
        env: activeEnv.value,
        gameName: game.value.name
      }
    })
  }
}

/**
 * 查看文件配置
 * @param {Object} file - 文件对象
 */
function viewFile(file) {
  // 调用全局的openGameTab方法打开新标签页
  if (window.openGameTab) {
    window.openGameTab(
      game.value.id,
      game.value.name,
      file.id,
      file.type,
      activeEnv.value
    )
  } else {
    // 兼容处理：如果openGameTab方法不存在，使用原有的路由跳转
    router.push({
      name: 'Workbench',
      params: { id: game.value.id },
      query: {
        fileId: file.id,
        fileType: file.type,
        env: activeEnv.value,
        gameName: game.value.name
      }
    })
  }
}

/**
 * 复制文件
 * @param {Object} file - 文件对象
 */
async function copyFile(file) {
  try {
    // 使用API创建文件副本（复制为草稿类型）
    const now = new Date().toISOString()
    const copyFileData = {
      type: FileType.DRAFT, // 所有复制的文件都成为草稿
      name: `${file.name} (副本)`,
      content: file.content,
      updatedBy: 'admin'
    }
    
    await createGameFile(game.value.id, copyFileData)
    
    // 重新加载游戏数据以更新UI
    await loadGameData()
    
    alert(`复制文件成功：${file.name}`)
  } catch (error) {
    console.error('复制文件失败:', error)
    alert('复制文件失败: ' + error.message)
  }
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
async function handleCopyTo(targetGameId) {
  try {
    // 使用API将文件复制到目标游戏
    const now = new Date().toISOString()
    const copyFileData = {
      type: currentCopyFile.value.type,
      name: currentCopyFile.value.name,
      content: currentCopyFile.value.content,
      updatedBy: 'admin'
    }
    
    await createGameFile(targetGameId, copyFileData)
    
    alert(`复制到游戏成功：游戏ID ${targetGameId}`)
    showCopyToModalVisible.value = false
    currentCopyFile.value = null
  } catch (error) {
    console.error('复制到游戏失败:', error)
    alert('复制到游戏失败: ' + error.message)
  }
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
 * @param {Object|string} targetType - 目标类型对象或字符串
 */
async function handleSubmitTest(targetType) {
  if (!currentSubmitDraft.value) {
    alert('请选择要提测的草稿')
    return
  }
  
  try {
    const now = new Date().toISOString()
    
    // 提取目标类型字符串（处理对象或直接字符串）
    const targetTypeValue = typeof targetType === 'object' && targetType.targetType ? targetType.targetType : targetType
    
    console.log('提测目标类型:', targetTypeValue)
    
    // 1. 创建提测记录
    const submitRecord = {
      draftId: currentSubmitDraft.value.id,
      targetType: targetTypeValue,
      createdBy: 'admin'
    }
    
    console.log('提测记录数据:', submitRecord)
    console.log('游戏ID:', game.value.id)
    console.log('草稿ID:', currentSubmitDraft.value.id)
    console.log('目标类型:', targetTypeValue)
    
    await createSubmitHistory(game.value.id, submitRecord)
    
    // 2. 创建或更新测试文件
    const testFileData = {
      type: targetTypeValue,
      name: targetTypeValue === FileType.TEST_MATCH ? '测试约局配置' : '测试金币配置',
      content: currentSubmitDraft.value.content,
      updatedBy: 'admin'
    }
    
    // 检查是否已存在对应的测试文件
    const existingTestFile = game.value.files.find(f => f.type === targetTypeValue)
    if (existingTestFile) {
      // 更新现有测试文件
      await updateGameFile(game.value.id, existingTestFile.id, testFileData)
    } else {
      // 创建新的测试文件
      await createGameFile(game.value.id, testFileData)
    }
    
    // 重新加载游戏数据以更新UI
    await loadGameData()
    
    alert(`提测成功：已提测到 ${targetTypeValue}`)
    showSubmitTestModalVisible.value = false
    currentSubmitDraft.value = null
  } catch (error) {
    console.error('提测失败:', error)
    alert('提测失败: ' + error.message)
  }
}

/**
 * 处理查看提测记录
 * @param {Object} file - 文件对象
 */
function handleViewHistory(file) {
  currentViewFile.value = file
  showSubmitHistoryModal.value = true
}

/**
 * 关闭提测记录弹窗
 */
function closeSubmitHistoryModal() {
  showSubmitHistoryModal.value = false
  currentViewFile.value = null
}

/**
 * 发布文件（发灰度/发布到正式）
 * @param {Object} file - 文件对象
 */
async function publishFile(file) {
  if (!game.value) return
  
  try {
    const now = new Date().toISOString()
    let targetType = ''
    let targetName = ''
    
    // 根据当前文件类型确定目标正式文件类型
    if (file.type === FileType.TEST_MATCH) {
      targetType = FileType.OFFICIAL_MATCH
      targetName = '正式约局配置'
    } else if (file.type === FileType.TEST_GOLD) {
      targetType = FileType.OFFICIAL_GOLD
      targetName = '正式金币配置'
    } else {
      alert('只能发布灰度文件到正式环境')
      return
    }
    
    // 检查是否已存在对应的正式文件
    const existingOfficialFile = game.value.files.find(f => f.type === targetType)
    
    if (existingOfficialFile) {
      // 更新现有正式文件
      const testFileData = {
        type: targetType,
        name: targetName,
        content: file.content,
        updatedBy: 'admin'
      }
      await updateGameFile(game.value.id, existingOfficialFile.id, testFileData)
    } else {
      // 创建新的正式文件
      const testFileData = {
        type: targetType,
        name: targetName,
        content: file.content,
        updatedBy: 'admin'
      }
      await createGameFile(game.value.id, testFileData)
    }
    
    // 重新加载游戏数据以更新UI
    await loadGameData()
    
    alert(`发布成功：${file.name} 已发布到 ${targetName}`)
  } catch (error) {
    console.error('发布失败:', error)
    alert('发布失败: ' + error.message)
  }
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
async function createDraft() {
  if (!newDraftName.value.trim()) {
    alert('请输入草稿名称')
    return
  }
  
  const now = new Date().toISOString()
  const newDraftData = {
    type: FileType.DRAFT,
    name: newDraftName.value.trim(),
    content: '{}',
    updatedBy: 'admin'
  }
  
  try {
    // 使用API创建新草稿
    const newDraft = await createGameFile(game.value.id, newDraftData)
    
    // 重新加载游戏数据以更新UI
    await loadGameData()
    
    closeCreateDraftModal()
    
    // 跳转到工作台编辑
    setTimeout(() => {
      editFile({
        ...newDraft,
        updatedBy: newDraft.updated_by,
        createdAt: newDraft.created_at,
        updatedAt: newDraft.updated_at
      })
    }, 300)
  } catch (error) {
    console.error('创建草稿失败:', error)
    alert('创建草稿失败: ' + error.message)
  }
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
  margin-right: 16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.file-list-item-id {
  font-size: 12px;
  color: #6b7280;
  font-family: 'Monaco', 'Menlo', monospace;
  background-color: #f3f4f6;
  padding: 2px 8px;
  border-radius: 4px;
  display: inline-block;
  margin-bottom: 4px;
}

.file-list-item-meta {
  font-size: 14px;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 8px;
}

.file-list-item-updated {
  font-family: 'Monaco', 'Menlo', monospace;
}

.file-list-item-separator {
  color: #9ca3af;
}

.file-list-item-updated-by {
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
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/**
 * 分区头部
 */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

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
 * 文件网格样式已移除，直接在file-section中使用flex布局
 */

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