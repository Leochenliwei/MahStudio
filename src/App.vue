<template>
  <div class="app-container">
    <!-- 顶部标签栏 -->
    <div class="tab-bar">
      <!-- 窗口控制按钮 -->
      <!-- <div class="window-controls">
        <div class="control-btn close"></div>
        <div class="control-btn minimize"></div>
        <div class="control-btn maximize"></div>
      </div> -->
      
      <!-- 标签列表 -->
      <div class="tab-list">
        <!-- 首页标签 -->
        <div 
          class="tab-item" 
          :class="{ active: activeTab === 'home' }"
          @click="switchTab('home')"
        >
          <div class="tab-icon">
            <Icon name="home" size="16" />
          </div>
          <div class="tab-title">首页</div>
        </div>
        
        <!-- 工作台标签 -->
        <div 
          v-for="tab in workbenchTabs" 
          :key="tab.id"
          class="tab-item" 
          :class="{ active: activeTab === tab.id }"
          @click="switchTab(tab.id)"
        >
          <div class="tab-icon">
            <Icon name="layout-dashboard" size="16" />
          </div>
          <div class="tab-title">{{ tab.name }}</div>
          <div class="tab-close" @click.stop="closeTab(tab.id)">
            <Icon name="x" size="12" />
          </div>
        </div>
        
        <!-- 添加标签按钮 -->
        <div class="tab-add" @click="addTab">
          <Icon name="plus" size="16" />
        </div>
      </div>
    </div>
    
    <!-- 内容区域 -->
    <div class="content-container">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Icon from './components/Icon.vue'

const router = useRouter()
const route = useRoute()

// 活跃标签
const activeTab = ref('home')

// 工作台标签列表
const workbenchTabs = ref([
  {
    id: '1',
    name: '规则配置',
    path: '/workbench/1'
  }
])

// 监听路由变化，更新活跃标签
watch(() => route.path, (newPath) => {
  if (newPath === '/') {
    activeTab.value = 'home'
  } else {
    const tabId = newPath.split('/').pop()
    activeTab.value = tabId
    
    // 只有游戏目录路由才创建项目标签页，工作台路由使用浏览器标签页
    if (newPath.includes('/game-directory/')) {
      const gameName = route.query.gameName || `游戏目录 ${tabId}`
      const existingTab = workbenchTabs.value.find(tab => tab.id === tabId)
      if (existingTab) {
        existingTab.name = gameName
      } else {
        // 只有当没有通过openGameDirectoryTab触发的路由变化时，才在这里创建
        // 检查是否是通过这些方法触发的路由变化
        if (!window._isOpeningGameTab) {
          workbenchTabs.value.push({
            id: tabId,
            name: gameName,
            path: newPath
          })
        }
        // 重置标志
        window._isOpeningGameTab = false
      }
    }
  }
})

// 切换标签
const switchTab = (tabId) => {
  if (tabId === 'home') {
    router.push('/')
  } else {
    // 查找标签页对应的路径
    const tab = workbenchTabs.value.find(t => t.id === tabId)
    if (tab) {
      // 根据标签页的path属性来跳转，保留原来的路径
      router.push(tab.path)
    } else {
      // 如果标签页不存在，默认跳转到工作台页面
      router.push(`/workbench/${tabId}`)
    }
  }
}

// 添加新标签
const addTab = () => {
  // 创建新的工作台标签
  const newId = Date.now().toString()
  const newTab = {
    id: newId,
    name: '新建工作台',
    path: `/workbench/${newId}`
  }
  
  workbenchTabs.value.push(newTab)
  switchTab(newId)
}

// 打开游戏配置标签页（在新浏览器标签页中打开）
const openGameTab = (gameId, gameName, fileId, fileType, env) => {
  // 构建完整的URL，包括所有必要的参数
  const url = new URL(window.location.href)
  
  // 保留基础路径，确保包含正确的公共基础URL
  const basePath = url.pathname.split('/').filter(Boolean)[0]
  if (basePath) {
    url.pathname = `/${basePath}/workbench/${gameId}`
  } else {
    url.pathname = `/workbench/${gameId}`
  }
  
  // 清空现有的查询参数，然后添加新的参数
  url.search = ''
  if (fileId) url.searchParams.set('fileId', fileId)
  if (fileType) url.searchParams.set('fileType', fileType)
  if (env) url.searchParams.set('env', env)
  if (gameName) url.searchParams.set('gameName', gameName)
  
  // 在新的浏览器标签页中打开工作台页面
  window.open(url.toString(), '_blank')
}

// 打开游戏目录标签页
const openGameDirectoryTab = (gameId, gameName, env) => {
  // 检查是否已经存在相同游戏配置的标签页
  const existingTab = workbenchTabs.value.find(tab => tab.id === gameId)
  
  if (existingTab) {
    // 更新标签页的路径为GameDirectory页面
    existingTab.path = `/game-directory/${gameId}`
    existingTab.name = gameName || `游戏目录 ${gameId}`
    
    // 跳转到GameDirectory页面
    router.push({
      name: 'GameDirectory',
      params: { gameId: gameId },
      query: {
        env: env,
        gameName: gameName
      }
    })
  } else {
    // 设置标志，标识这是通过openGameDirectoryTab触发的路由变化
    window._isOpeningGameTab = true
    
    // 创建新的标签页
    const newTab = {
      id: gameId,
      name: gameName || `游戏目录 ${gameId}`,
      path: `/game-directory/${gameId}`
    }
    
    workbenchTabs.value.push(newTab)
    
    // 跳转到新标签页并传递参数
    router.push({
      name: 'GameDirectory',
      params: { gameId: gameId },
      query: {
        env: env,
        gameName: gameName
      }
    })
  }
}

// 暴露方法给全局
window.openGameTab = openGameTab
window.openGameDirectoryTab = openGameDirectoryTab

// 关闭标签
const closeTab = (tabId) => {
  const index = workbenchTabs.value.findIndex(tab => tab.id === tabId)
  if (index > -1) {
    workbenchTabs.value.splice(index, 1)
    
    // 如果关闭的是活跃标签，切换到首页或其他标签
    if (activeTab.value === tabId) {
      if (workbenchTabs.value.length > 0) {
        switchTab(workbenchTabs.value[0].id)
      } else {
        switchTab('home')
      }
    }
  }
}

// 初始化时检查路由
onMounted(() => {
  if (route.path !== '/') {
    const tabId = route.path.split('/').pop()
    activeTab.value = tabId
    
    // 只有游戏目录路由才创建项目标签页，工作台路由使用浏览器标签页
    if (route.path.includes('/game-directory/')) {
      // 检查标签是否存在，不存在则添加
      const tabExists = workbenchTabs.value.some(tab => tab.id === tabId)
      if (!tabExists) {
        const gameName = route.query.gameName || `游戏目录 ${tabId}`
        workbenchTabs.value.push({
          id: tabId,
          name: gameName,
          path: route.path
        })
      } else {
        // 如果标签已存在，更新名称
        const gameName = route.query.gameName
        if (gameName) {
          const existingTab = workbenchTabs.value.find(tab => tab.id === tabId)
          if (existingTab) {
            existingTab.name = gameName
          }
        }
      }
    }
  }
})
</script>

<style scoped>
.app-container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: var(--color-background);
  color: var(--color-text-primary);
}

/* 定义缺失的辅助色变量 */
:root {
  --color-danger-hover: #dc2626;
  --color-warning-hover: #d97706;
  --color-success-hover: #059669;
}

/* 顶部标签栏 */
.tab-bar {
  height: 48px;
  background-color: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  padding: 0 var(--spacing-4);
  box-shadow: var(--shadow-sm);
}

/* 窗口控制按钮 */
.window-controls {
  display: flex;
  gap: var(--spacing-2);
  margin-right: var(--spacing-4);
  padding: var(--spacing-2);
  border-radius: var(--border-radius-md);
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
}

.control-btn {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  cursor: pointer;
  transition: all var(--transition-fast);
  position: relative;
  overflow: hidden;
}

.control-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.2);
}

.control-btn.close {
  background-color: var(--color-danger);
}

.control-btn.close:hover {
  background-color: var(--color-danger-hover);
}

.control-btn.minimize {
  background-color: var(--color-warning);
}

.control-btn.minimize:hover {
  background-color: var(--color-warning-hover);
}

.control-btn.maximize {
  background-color: var(--color-success);
}

.control-btn.maximize:hover {
  background-color: var(--color-success-hover);
}

/* 标签列表 */
.tab-list {
  display: flex;
  align-items: center;
  gap: var(--spacing-1);
  flex: 1;
  overflow-x: auto;
}

/* 标签项 */
.tab-item {
  height: 36px;
  min-width: 140px;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md) var(--border-radius-md) 0 0;
  display: flex;
  align-items: center;
  padding: 0 var(--spacing-3);
  cursor: pointer;
  position: relative;
  transition: all var(--transition-normal);
  border-bottom: 2px solid transparent;
}

.tab-item:hover {
  background-color: var(--color-surface-hover);
  border-color: var(--color-primary);
  transform: translateY(-1px);
}

.tab-item.active {
  background-color: var(--color-background);
  border-bottom-color: var(--color-primary);
  border-color: var(--color-border-light);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.tab-item.active::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background-color: var(--color-primary);
  border-radius: var(--border-radius-md) var(--border-radius-md) 0 0;
}

/* 标签图标 */
.tab-icon {
  margin-right: var(--spacing-2);
  font-size: 14px;
  display: flex;
  align-items: center;
}

/* 标签标题 */
.tab-title {
  flex: 1;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--color-text-secondary);
}

.tab-item.active .tab-title {
  color: var(--color-text-primary);
}

/* 标签关闭按钮 */
.tab-close {
  margin-left: var(--spacing-2);
  font-size: 14px;
  color: var(--color-text-tertiary);
  cursor: pointer;
  padding: 4px;
  border-radius: var(--border-radius-sm);
  transition: all var(--transition-fast);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.7;
}

.tab-item:hover .tab-close {
  opacity: 1;
}

.tab-close:hover {
  background-color: var(--color-danger);
  color: white;
  transform: scale(1.1);
}

/* 添加标签按钮 */
.tab-add {
  width: 36px;
  height: 36px;
  background-color: var(--color-surface);
  border: 1px dashed var(--color-border);
  border-radius: var(--border-radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 16px;
  color: var(--color-text-tertiary);
  transition: all var(--transition-normal);
  margin-left: var(--spacing-2);
  flex-shrink: 0;
}

.tab-add:hover {
  background-color: var(--color-primary-light);
  border-color: var(--color-primary);
  color: var(--color-primary);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(100, 108, 255, 0.2);
}

/* 内容容器 */
.content-container {
  flex: 1;
  overflow: hidden;
}

/* 滚动条样式 */
.tab-list::-webkit-scrollbar {
  height: 4px;
}

.tab-list::-webkit-scrollbar-track {
  background: var(--color-surface);
}

.tab-list::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: var(--border-radius-full);
}

.tab-list::-webkit-scrollbar-thumb:hover {
  background: var(--color-border-light);
}
</style>
