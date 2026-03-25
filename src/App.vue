<template>
  <div class="app-container">
    <!-- 左侧菜单栏 -->
    <div class="sidebar" :class="{ collapsed: isSidebarCollapsed }">
      <div class="sidebar-header">
        <div class="logo">
          <el-icon :size="24"><Setting /></el-icon>
          <span v-if="!isSidebarCollapsed" class="logo-text">管理中台</span>
        </div>
        <button class="collapse-btn" @click="toggleSidebar">
          <el-icon :size="16">
            <ArrowLeft v-if="!isSidebarCollapsed" />
            <ArrowRight v-else />
          </el-icon>
        </button>
      </div>

      <!-- 主菜单区域 -->
      <div class="sidebar-content">
        <div class="menu-section">
          <div v-if="!isSidebarCollapsed" class="menu-title">主菜单</div>
          <div class="menu-list">
            <button
              v-for="menu in mainMenus"
              :key="menu.id"
              class="menu-item"
              :class="{ active: isMenuActive(menu) }"
              @click="openMenuTab(menu)"
              :title="menu.description"
            >
              <el-icon :size="18">
                <component :is="getIconComponent(menu.icon)" />
              </el-icon>
              <span v-if="!isSidebarCollapsed" class="menu-text">{{ menu.name }}</span>
            </button>
          </div>
        </div>

        <!-- 系统菜单区域 -->
        <div class="menu-section">
          <div v-if="!isSidebarCollapsed" class="menu-title">系统</div>
          <div class="menu-list">
            <button
              v-for="menu in systemMenus"
              :key="menu.id"
              class="menu-item"
              :class="{ active: isMenuActive(menu) }"
              @click="openMenuTab(menu)"
              :title="menu.description"
            >
              <el-icon :size="18">
                <component :is="getIconComponent(menu.icon)" />
              </el-icon>
              <span v-if="!isSidebarCollapsed" class="menu-text">{{ menu.name }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 底部信息 -->
      <div class="sidebar-footer" v-if="!isSidebarCollapsed">
        <div class="version">v1.0.0</div>
      </div>
    </div>

    <!-- 右侧内容区域 -->
    <div class="main-content">
      <!-- 顶部标签栏 -->
      <div class="tab-bar">
        <div class="tab-list">
          <!-- 首页标签 -->
          <div
            class="tab-item"
            :class="{ active: activeTab === 'home' }"
            @click="switchTab('home')"
          >
            <div class="tab-icon">
              <el-icon :size="14"><HomeFilled /></el-icon>
            </div>
            <div class="tab-title">首页</div>
          </div>

          <!-- 动态标签页 -->
          <div
            v-for="tab in workbenchTabs"
            :key="tab.id"
            class="tab-item"
            :class="{ active: activeTab === tab.id }"
            @click="switchTab(tab.id)"
          >
            <div class="tab-icon">
              <el-icon :size="14"><component :is="getTabIcon(tab)" /></el-icon>
            </div>
            <div class="tab-title">{{ tab.name }}</div>
            <div class="tab-close" @click.stop="closeTab(tab.id)">
              <el-icon :size="12"><Close /></el-icon>
            </div>
          </div>
        </div>
      </div>

      <!-- 页面内容 -->
      <div class="content-container">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * App.vue - 应用主组件
 *
 * 功能：
 * 1. 左侧可折叠菜单栏 - 支持多菜单独立打开
 * 2. 顶部虚拟标签页 - 每个菜单/页面独立标签
 * 3. 标签页管理 - 切换、关闭、记忆状态
 *
 * @author Frontend Architect
 * @since 2026-03-19
 */

import { ref, watch, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  HomeFilled, Grid, Box, User, Setting, Document,
  TrendCharts, Close, ArrowLeft, ArrowRight
} from '@element-plus/icons-vue'
import {
  menuConfig, getMainMenus, getSystemMenus, generateMenuTabId, buildMenuPath
} from './config/menuConfig.js'

const router = useRouter()
const route = useRoute()

// ==================== 状态管理 ====================

/**
 * 侧边栏折叠状态
 * @type {Ref<boolean>}
 */
const isSidebarCollapsed = ref(false)

/**
 * 活跃标签ID
 * @type {Ref<string>}
 */
const activeTab = ref('home')

/**
 * 工作台标签列表
 * @type {Ref<Array<Object>>}
 */
const workbenchTabs = ref([])

// ==================== 计算属性 ====================

/**
 * 主菜单列表
 * @type {ComputedRef<Array>}
 */
const mainMenus = computed(() => getMainMenus())

/**
 * 系统菜单列表
 * @type {ComputedRef<Array>}
 */
const systemMenus = computed(() => getSystemMenus())

// ==================== 图标映射 ====================

/**
 * 图标组件映射表
 */
const iconComponents = {
  Grid,
  Box,
  User,
  Setting,
  Document,
  TrendCharts
}

/**
 * 获取图标组件
 * @param {string} iconName - 图标名称
 * @returns {Component} 图标组件
 */
function getIconComponent(iconName) {
  return iconComponents[iconName] || Grid
}

/**
 * 获取标签页图标
 * @param {Object} tab - 标签页对象
 * @returns {Component} 图标组件
 */
function getTabIcon(tab) {
  if (tab.menuId) {
    const menu = menuConfig.find(m => m.id === tab.menuId)
    if (menu) {
      return getIconComponent(menu.icon)
    }
  }
  return Grid
}

// ==================== 菜单操作 ====================

/**
 * 切换侧边栏折叠状态
 */
function toggleSidebar() {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
}

/**
 * 检查菜单是否处于活跃状态
 * @param {Object} menu - 菜单配置对象
 * @returns {boolean} 是否活跃
 */
function isMenuActive(menu) {
  return workbenchTabs.value.some(tab =>
    tab.menuId === menu.id && tab.id === activeTab.value
  )
}

/**
 * 打开菜单标签页
 * @param {Object} menu - 菜单配置对象
 */
function openMenuTab(menu) {
  // 生成唯一标签页ID
  const tabId = generateMenuTabId(menu.id, menu.query)

  // 构建标签页路径
  const path = buildMenuPath(menu)

  // 创建新标签页
  const newTab = {
    id: tabId,
    name: menu.name,
    path: path,
    menuId: menu.id
  }

  // 添加到标签页列表
  workbenchTabs.value.push(newTab)

  // 切换到新标签页
  activeTab.value = tabId

  // 路由跳转
  router.push({
    path: menu.path,
    query: menu.query
  })
}

// ==================== 标签页操作 ====================

/**
 * 切换标签页
 * @param {string} tabId - 标签页ID
 */
function switchTab(tabId) {
  if (tabId === 'home') {
    activeTab.value = 'home'
    router.push('/')
  } else {
    const tab = workbenchTabs.value.find(t => t.id === tabId)
    if (tab) {
      activeTab.value = tabId
      router.push(tab.path)
    }
  }
}

/**
 * 关闭标签页
 * @param {string} tabId - 标签页ID
 */
function closeTab(tabId) {
  const index = workbenchTabs.value.findIndex(tab => tab.id === tabId)
  if (index > -1) {
    workbenchTabs.value.splice(index, 1)

    // 如果关闭的是活跃标签，切换到其他标签或首页
    if (activeTab.value === tabId) {
      if (workbenchTabs.value.length > 0) {
        const newIndex = index > 0 ? index - 1 : 0
        switchTab(workbenchTabs.value[newIndex].id)
      } else {
        switchTab('home')
      }
    }
  }
}

// ==================== 全局方法 ====================

/**
 * 打开游戏目录标签页
 * @param {string} gameId - 游戏ID
 * @param {string} gameName - 游戏名称
 * @param {string} env - 环境类型
 */
function openGameDirectoryTab(gameId, gameName, env) {
  const tabName = gameName ? `控制台-${gameName}` : `控制台- ${gameId}`
  const existingTab = workbenchTabs.value.find(tab => tab.id === gameId)

  if (existingTab) {
    existingTab.path = `/game-directory/${gameId}?env=${env}&gameName=${encodeURIComponent(gameName || '')}`
    existingTab.name = tabName
    switchTab(gameId)
  } else {
    const newTab = {
      id: gameId,
      name: tabName,
      path: `/game-directory/${gameId}?env=${env}&gameName=${encodeURIComponent(gameName || '')}`
    }
    workbenchTabs.value.push(newTab)
    activeTab.value = gameId
    router.push({
      name: 'GameDirectory',
      params: { gameId },
      query: { env, gameName }
    })
  }
}

/**
 * 打开游戏工作台标签页
 * @param {string} gameId - 游戏ID
 * @param {string} gameName - 游戏名称
 * @param {string} fileId - 文件ID
 * @param {string} fileType - 文件类型
 * @param {string} env - 环境类型
 */
function openGameTab(gameId, gameName, fileId, fileType, env) {
  const tabId = `workbench-${gameId}-${Date.now()}`
  const tabName = gameName ? `工作台-${gameName}` : `工作台- ${gameId}`
  console.log('打开游戏工作台标签页', tabName)
  
  let path = `/workbench/${gameId}`
  const query = { fileId, fileType, env, gameName }
  const queryParams = new URLSearchParams()
  if (fileId) queryParams.set('fileId', fileId)
  if (fileType) queryParams.set('fileType', fileType)
  if (env) queryParams.set('env', env)
  if (gameName) queryParams.set('gameName', gameName)
  if (queryParams.toString()) {
    path += `?${queryParams.toString()}`
  }

  const newTab = {
    id: tabId,
    name: tabName,
    path: path
  }

  workbenchTabs.value.push(newTab)
  activeTab.value = tabId

  router.push({
    name: 'Workbench',
    params: { id: gameId },
    query
  })
}

// 暴露方法给全局
window.openGameDirectoryTab = openGameDirectoryTab
window.openGameTab = openGameTab

// ==================== 路由监听 ====================

/**
 * 监听路由变化，更新活跃标签
 */
watch(() => route.path, (newPath) => {
  if (newPath === '/') {
    activeTab.value = 'home'
  } else if (newPath.includes('/game-directory/')) {
    const gameId = newPath.split('/').pop()
    const gameName = route.query.gameName
    const existingTab = workbenchTabs.value.find(tab => tab.id === gameId)

    if (existingTab) {
      activeTab.value = gameId
      if (gameName) existingTab.name = gameName
    } else {
      const newTab = {
        id: gameId,
        name: gameName || `游戏目录 ${gameId}`,
        path: newPath
      }
      workbenchTabs.value.push(newTab)
      activeTab.value = gameId
    }
  } else if (newPath.includes('/workbench/')) {
    const gameId = newPath.split('/').pop()
    const gameName = route.query.gameName
    const tabName = gameName ? `工作台-${gameName}` : `工作台 ${gameId}`

    const existingTab = workbenchTabs.value.find(tab =>
      tab.path && tab.path.includes(`/workbench/${gameId}`)
    )

    if (existingTab) {
      activeTab.value = existingTab.id
      if (gameName) existingTab.name = tabName
    } else {
      const newTab = {
        id: `workbench-${gameId}`,
        name: tabName,
        path: newPath
      }
      workbenchTabs.value.push(newTab)
      activeTab.value = newTab.id
    }
  } else if (newPath.includes('/room-creator/')) {
    const gameId = newPath.split('/').pop()
    const gameName = route.query.gameName
    const cfgId = route.query.cfgId || gameId
    const tabName = gameName ? `创房-${gameName}-${cfgId}` : `创房-${cfgId}`

    const existingTab = workbenchTabs.value.find(tab =>
      tab.path && tab.path.includes(`/room-creator/${gameId}`)
    )

    if (existingTab) {
      activeTab.value = existingTab.id
      if (gameName || cfgId) existingTab.name = tabName
    } else {
      const newTab = {
        id: `room-creator-${gameId}`,
        name: tabName,
        path: newPath
      }
      workbenchTabs.value.push(newTab)
      activeTab.value = newTab.id
    }
  } else if (newPath.includes('/admin/')) {
    // 处理admin路由
    const matchedTab = workbenchTabs.value.find(tab => tab.path === newPath)
    if (matchedTab) {
      activeTab.value = matchedTab.id
    }
  }
})

// ==================== 生命周期 ====================

onMounted(() => {
  // 初始化时检查路由
  const currentPath = route.path
  if (currentPath === '/') {
    activeTab.value = 'home'
  } else if (currentPath.includes('/game-directory/')) {
    const gameId = currentPath.split('/').pop()
    const gameName = route.query.gameName
    const existingTab = workbenchTabs.value.find(tab => tab.id === gameId)

    if (!existingTab) {
      workbenchTabs.value.push({
        id: gameId,
        name: gameName || `游戏目录 ${gameId}`,
        path: currentPath
      })
    }
    activeTab.value = gameId
  } else if (currentPath.includes('/workbench/')) {
    const gameId = currentPath.split('/').pop()
    const gameName = route.query.gameName
    const tabName = gameName ? `工作台-${gameName}` : `工作台 ${gameId}`

    const existingTab = workbenchTabs.value.find(tab =>
      tab.path && tab.path.includes(`/workbench/${gameId}`)
    )

    if (!existingTab) {
      workbenchTabs.value.push({
        id: `workbench-${gameId}`,
        name: tabName,
        path: currentPath
      })
    }
    activeTab.value = `workbench-${gameId}`
  } else if (currentPath.includes('/room-creator/')) {
    const gameId = currentPath.split('/').pop()
    const gameName = route.query.gameName
    const cfgId = route.query.cfgId || gameId
    const tabName = gameName ? `创房-${gameName}-${cfgId}` : `创房-${cfgId}`

    const existingTab = workbenchTabs.value.find(tab =>
      tab.path && tab.path.includes(`/room-creator/${gameId}`)
    )

    if (!existingTab) {
      workbenchTabs.value.push({
        id: `room-creator-${gameId}`,
        name: tabName,
        path: currentPath
      })
    }
    activeTab.value = `room-creator-${gameId}`
  } else if (currentPath.includes('/admin/')) {
    // 检查是否有匹配的菜单标签
    const matchedTab = workbenchTabs.value.find(tab => tab.path === currentPath)
    if (matchedTab) {
      activeTab.value = matchedTab.id
    }
  }
})
</script>

<style scoped>
.app-container {
  width: 100%;
  height: 100vh;
  display: flex;
  overflow: hidden;
  background-color: var(--color-background);
  color: var(--color-text-primary);
}

/* ==================== 侧边栏样式 ==================== */

.sidebar {
  width: 220px;
  background-color: #1f2937;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
  flex-shrink: 0;
}

.sidebar.collapsed {
  width: 60px;
}

.sidebar-header {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #3b82f6;
}

.logo-text {
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
  white-space: nowrap;
}

.collapse-btn {
  width: 28px;
  height: 28px;
  background-color: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 6px;
  color: #9ca3af;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.collapse-btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
  color: #ffffff;
}

.sidebar-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px 0;
}

.menu-section {
  margin-bottom: 24px;
}

.menu-title {
  padding: 0 16px 8px;
  font-size: 12px;
  font-weight: 500;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.menu-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 0 8px;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  background-color: transparent;
  border: none;
  border-radius: 8px;
  color: #9ca3af;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
}

.menu-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

.menu-item.active {
  background-color: #3b82f6;
  color: #ffffff;
}

.menu-text {
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
}

.sidebar-footer {
  padding: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.version {
  font-size: 12px;
  color: #6b7280;
  text-align: center;
}

/* ==================== 主内容区域样式 ==================== */

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* ==================== 顶部标签栏样式 ==================== */

.tab-bar {
  height: 44px;
  background-color: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  padding: 0 12px;
  flex-shrink: 0;
}

.tab-list {
  display: flex;
  align-items: center;
  gap: 4px;
  flex: 1;
  overflow-x: auto;
}

.tab-item {
  height: 32px;
  min-width: 120px;
  max-width: 180px;
  background-color: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 6px 6px 0 0;
  display: flex;
  align-items: center;
  padding: 0 10px;
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;
  border-bottom: 2px solid transparent;
}

.tab-item:hover {
  background-color: #e5e7eb;
}

.tab-item.active {
  background-color: #ffffff;
  border-bottom-color: #3b82f6;
  border-color: #e5e7eb #e5e7eb #3b82f6;
}

.tab-icon {
  margin-right: 6px;
  color: #6b7280;
  display: flex;
  align-items: center;
}

.tab-item.active .tab-icon {
  color: #3b82f6;
}

.tab-title {
  flex: 1;
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #374151;
}

.tab-item.active .tab-title {
  color: #1f2937;
}

.tab-close {
  margin-left: 6px;
  width: 16px;
  height: 16px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  opacity: 0;
  transition: all 0.2s ease;
}

.tab-item:hover .tab-close {
  opacity: 1;
}

.tab-close:hover {
  background-color: #ef4444;
  color: #ffffff;
}

/* ==================== 内容容器样式 ==================== */

.content-container {
  flex: 1;
  overflow: hidden;
  background-color: #f5f5f5;
}

/* ==================== 滚动条样式 ==================== */

.tab-list::-webkit-scrollbar {
  height: 3px;
}

.tab-list::-webkit-scrollbar-track {
  background: transparent;
}

.tab-list::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 2px;
}

.sidebar-content::-webkit-scrollbar {
  width: 4px;
}

.sidebar-content::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar-content::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
}
</style>
