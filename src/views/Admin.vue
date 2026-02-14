<template>
  <div class="admin-container">
    <!-- 左侧菜单 -->
    <div class="left-sidebar">
      <h2>后台管理</h2>
      <div class="backend-menu">
        <!-- <button @click="activePanel = 'dashboard'" class="menu-item">
          <Icon name="PieChart" size="16" class="mr-2" />
          仪表盘
        </button>
        <button @click="activePanel = 'users'" class="menu-item">
          <Icon name="Users" size="16" class="mr-2" />
          用户管理
        </button> -->
        <button @click="activePanel = 'gameConfigs'" class="menu-item">
          <Icon name="Gamepad2" size="16" class="mr-2" />
          游戏配置
        </button>
        <!-- <button @click="activePanel = 'settings'" class="menu-item">
          <Icon name="Settings" size="16" class="mr-2" />
          系统设置
        </button> -->
      </div>
    </div>
    
    <!-- 右侧内容 -->
    <div class="right-content">
           
      <div v-if="activePanel === 'gameConfigs'">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-6);">
          <h3>游戏配置列表</h3>
          <button class="action-btn" @click="showAddGameModal = true">新增游戏</button>
        </div>
        <div class="config-table-container">
          <table class="config-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>名称</th>
                <th>描述</th>
                <th>状态</th>
                <th>创建信息</th>
                <th>编辑信息</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="config in gameConfigs" 
                :key="config.id"
                class="config-table-row"
                @click="enterWorkbench(config.id)"
              >
                <td>{{ config.id }}</td>
                <td>{{ config.name }}</td>
                <td>{{ config.description }}</td>
                <td>
                  <span class="config-status" :class="config.status">
                    {{ config.status }}
                  </span>
                </td>
                <td>{{ config.createdAt }}</td>
                <td>{{ config.updatedAt }}</td>
                <td>
                  <button class="action-btn">编辑</button>
                  <button class="action-btn-importentent">发布</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <!-- 新增游戏弹窗 -->
      <div v-if="showAddGameModal" class="modal-overlay" @click="closeAddGameModal">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h4>新增游戏</h4>
            <button class="modal-close-btn" @click="closeAddGameModal">
              <Icon name="X" size="16" />
            </button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label for="gameName">游戏名称</label>
              <input 
                type="text" 
                id="gameName" 
                v-model="newGameName" 
                placeholder="请输入游戏名称"
                class="form-input"
                @keyup.enter="addNewGame"
              />
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn-text" @click="closeAddGameModal">取消</button>
            <button class="action-btn" @click="addNewGame">确认</button>
          </div>
        </div>
      </div>

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
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import Icon from '../components/Icon.vue'

const router = useRouter()

// 激活的后台面板
const activePanel = ref('gameConfigs')

// 新增游戏弹窗状态
const showAddGameModal = ref(false)

// 新游戏名称
const newGameName = ref('')

// Loading动画状态
const showLoading = ref(false)

// 游戏配置列表数据
const gameConfigs = ref([
  {
    id: 1,
    name: '麻城痞子杠',
    description: '麻城地区特色麻将玩法',
    status: '启用',
    version: '1.0.0',
    createdAt: '2026-02-01',
    updatedAt: '2026-02-01'
  },
  {
    id: 2,
    name: '通用麻将',
    description: '标准通用麻将规则',
    status: '启用',
    version: '1.1.0',
    createdAt: '2026-02-02',
    updatedAt: '2026-02-03'
  },
  {
    id: 3,
    name: '香港麻将',
    description: '香港地区特色麻将玩法',
    status: '启用',
    version: '2.0.0',
    createdAt: '2026-02-03',
    updatedAt: '2026-02-04'
  },
  {
    id: 4,
    name: '深圳麻将',
    description: '深圳地区特色麻将玩法',
    status: '启用',
    version: '1.2.0',
    createdAt: '2026-02-04',
    updatedAt: '2026-02-05'
  },
  {
    id: 5,
    name: '四川麻将',
    description: '四川地区特色麻将玩法',
    status: '启用',
    version: '1.3.0',
    createdAt: '2026-02-05',
    updatedAt: '2026-02-06'
  }
])

// 计算属性：启用的配置数量
const activeConfigs = computed(() => {
  return gameConfigs.value.filter(config => config.status === '启用').length
})

// 计算属性：禁用的配置数量
const inactiveConfigs = computed(() => {
  return gameConfigs.value.filter(config => config.status === '禁用').length
})

// 计算属性：最近更新的配置数量
const recentUpdates = computed(() => {
  const today = new Date()
  const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
  return gameConfigs.value.filter(config => {
    const updatedAt = new Date(config.updatedAt)
    return updatedAt >= sevenDaysAgo
  }).length
})

// 计算属性：最近的配置列表（按更新时间排序）
const recentConfigs = computed(() => {
  return [...gameConfigs.value]
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 3)
})

// 进入工作台
function enterWorkbench(id) {
  const config = gameConfigs.value.find(config => config.id === id)
  const gameName = config ? config.name : `游戏配置 ${id}`
  router.push({ name: 'Workbench', params: { id }, query: { gameName } })
}

// 关闭新增游戏弹窗
function closeAddGameModal() {
  showAddGameModal.value = false
  newGameName.value = ''
}

// 新增游戏
function addNewGame() {
  if (!newGameName.value.trim()) {
    alert('请输入游戏名称')
    return
  }
  
  // 生成新的唯一ID
  const maxId = gameConfigs.value.length > 0 
    ? Math.max(...gameConfigs.value.map(config => config.id)) 
    : 0
  const newId = maxId + 1
  
  // 创建新游戏配置对象
  const newGame = {
    id: newId,
    name: newGameName.value.trim(),
    description: '',
    status: '启用',
    version: '1.0.0',
    createdAt: new Date().toISOString().split('T')[0],
    updatedAt: new Date().toISOString().split('T')[0]
  }
  
  // 添加到游戏配置列表
  gameConfigs.value.push(newGame)
  
  // 关闭弹窗并清空输入
  closeAddGameModal()
  
  // 显示loading动画
  showLoading.value = true
  
  // 延迟一段时间后进入工作台，以展示loading动画
  setTimeout(() => {
    // 关闭loading动画
    showLoading.value = false
    
    // 进入工作台
    enterWorkbench(newId)
  }, 2000) // 2秒延迟，足够展示动画效果
}
</script>

<style scoped>
.admin-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
}

/* 左侧菜单样式 */
.left-sidebar {
  width: 300px;
  background-color: #1e1e1e;
  color: white;
  padding: 20px;
  border-right: 1px solid #333;
  display: flex;
  flex-direction: column;
}

.left-sidebar h2 {
  margin-top: 0;
  font-size: 18px;
  border-bottom: 1px solid #333;
  padding-bottom: 10px;
}

.backend-menu {
  margin: 20px 0;
}

.backend-menu button {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 12px 16px;
  margin-bottom: 8px;
  background-color: var(--color-surface);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  cursor: pointer;
  text-align: left;
  transition: all var(--transition-normal);
  position: relative;
  overflow: hidden;
}

.backend-menu button:hover {
  background-color: var(--color-surface-hover);
  border-color: var(--color-primary);
  transform: translateX(5px);
}

.backend-menu button::after {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 4px;
  height: 100%;
  background-color: var(--color-primary);
  transform: scaleY(0);
  transform-origin: top;
  transition: transform var(--transition-normal);
}

.backend-menu button:hover::after {
  transform: scaleY(1);
}

.menu-item {
  gap: var(--spacing-2);
}

/* 右侧内容样式 */
.right-content {
  flex: 1;
  background-color: var(--color-background);
  color: var(--color-text-primary);
  padding: var(--spacing-6);
  overflow-y: auto;
}

.right-content h3 {
  margin-top: 0;
  font-size: var(--font-size-xl);
  margin-bottom: var(--spacing-6);
  color: var(--color-text-primary);
  font-weight: var(--font-weight-semibold);
}

/* 仪表盘容器样式 */
.dashboard-container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-8);
}

/* 仪表盘头部 */
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-4);
}

.dashboard-actions {
  display: flex;
  gap: var(--spacing-4);
}

/* 统计卡片容器 */
.dashboard-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-6);
}

/* 统计卡片 */
.stat-card {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-6);
  display: flex;
  align-items: center;
  gap: var(--spacing-4);
  transition: all var(--transition-normal);
  box-shadow: var(--shadow-sm);
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  border-color: var(--color-primary);
}

/* 统计图标 */
.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--border-radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon.bg-primary {
  background-color: rgba(100, 108, 255, 0.2);
  color: var(--color-primary);
}

.stat-icon.bg-success {
  background-color: rgba(40, 167, 69, 0.2);
  color: var(--color-success);
}

.stat-icon.bg-warning {
  background-color: rgba(255, 189, 46, 0.2);
  color: var(--color-warning);
}

.stat-icon.bg-info {
  background-color: rgba(23, 162, 184, 0.2);
  color: var(--color-info);
}

/* 统计内容 */
.stat-content {
  flex: 1;
}

.stat-value {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin-bottom: 4px;
}

.stat-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-tertiary);
  font-weight: var(--font-weight-medium);
}

/* 统计趋势 */
.stat-trend {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
}

.stat-trend.positive {
  color: var(--color-success);
}

.stat-trend.negative {
  color: var(--color-danger);
}

/* 仪表盘 sections */
.dashboard-sections {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: var(--spacing-6);
}

/* 区块卡片 */
.section-card {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-6);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-normal);
}

.section-card:hover {
  box-shadow: var(--shadow-md);
  border-color: var(--color-border-light);
}

/* 区块头部 */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-4);
  padding-bottom: var(--spacing-4);
  border-bottom: 1px solid var(--color-border);
}

.section-header h4 {
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
}

/* 文本按钮 */
.btn-text {
  padding: var(--spacing-2) var(--spacing-4);
  background-color: transparent;
  color: var(--color-primary);
  border: 1px solid var(--color-primary);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--transition-normal);
}

.btn-text:hover {
  background-color: var(--color-primary);
  color: white;
}

/* 最近配置列表 */
.recent-configs {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
}

/* 最近配置项 */
.recent-config-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: var(--spacing-4);
  background-color: var(--color-surface-hover);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  transition: all var(--transition-normal);
  cursor: pointer;
}

.recent-config-item:hover {
  background-color: var(--color-surface);
  border-color: var(--color-primary);
  transform: translateX(4px);
}

/* 配置信息 */
.config-info {
  flex: 1;
}

.config-info h5 {
  margin: 0 0 4px 0;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

.config-info p {
  margin: 0 0 8px 0;
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
  line-height: var(--line-height-normal);
}

/* 配置元数据 */
.config-meta {
  display: flex;
  gap: var(--spacing-3);
  align-items: center;
}

.config-version {
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
  background-color: var(--color-surface);
  padding: 2px 8px;
  border-radius: var(--border-radius-sm);
  border: 1px solid var(--color-border);
}

/* 配置操作 */
.config-actions {
  display: flex;
  gap: var(--spacing-2);
}

/* 图标按钮 */
.btn-icon {
  width: 32px;
  height: 32px;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transition-fast);
  color: var(--color-text-secondary);
}

.btn-icon:hover {
  background-color: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

/* 系统状态 */
.system-status {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
}

/* 状态项 */
.status-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-4);
  padding: var(--spacing-3);
  background-color: var(--color-surface-hover);
  border-radius: var(--border-radius-md);
  border: 1px solid var(--color-border);
}

.status-label {
  flex: 1;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

/* 状态指示器 */
.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.status-indicator.online {
  background-color: var(--color-success);
  box-shadow: 0 0 0 2px rgba(40, 167, 69, 0.3);
}

.status-indicator.warning {
  background-color: var(--color-warning);
  box-shadow: 0 0 0 2px rgba(255, 189, 46, 0.3);
}

.status-indicator.offline {
  background-color: var(--color-danger);
  box-shadow: 0 0 0 2px rgba(220, 53, 69, 0.3);
}

.status-text {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  font-weight: var(--font-weight-medium);
}

/* 游戏配置列表样式 */
.config-table-container {
  margin-top: var(--spacing-6);
  overflow-x: auto;
}

.config-table {
  width: 100%;
  border-collapse: collapse;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

.config-table th,
.config-table td {
  padding: var(--spacing-4) var(--spacing-5);
  text-align: left;
  border-bottom: 1px solid var(--color-border);
}

.config-table th {
  background-color: var(--color-surface-hover);
  font-weight: var(--font-weight-medium);
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.config-table-row {
  cursor: pointer;
  transition: background-color var(--transition-normal);
}

.config-table-row:hover {
  background-color: var(--color-surface-hover);
}

.config-table-row:last-child td {
  border-bottom: none;
}

.config-status {
  padding: 6px 12px;
  border-radius: var(--border-radius-full);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.config-status.启用 {
  background-color: rgba(40, 167, 69, 0.2);
  color: var(--color-success);
  border: 1px solid var(--color-success);
}

.config-status.禁用 {
  background-color: rgba(220, 53, 69, 0.2);
  color: var(--color-danger);
  border: 1px solid var(--color-danger);
}

.action-btn {
  padding: var(--spacing-2) var(--spacing-4);
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--transition-normal);
  border: 1px solid var(--color-primary);
  margin-right: var(--spacing-2);
}

.action-btn-importentent {
  padding: var(--spacing-2) var(--spacing-4);
  background-color: var(--color-danger);
  color: white;
  border: none;
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--transition-normal);
  border: 1px solid var(--color-danger);
  margin-right: var(--spacing-2);
}

.action-btn:hover {
  background-color: var(--color-primary-hover);
  border-color: var(--color-primary-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
}

/* 弹窗样式 */
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
}

.modal-content {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-6);
  width: 90%;
  max-width: 500px;
  box-shadow: var(--shadow-lg);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-6);
  padding-bottom: var(--spacing-4);
  border-bottom: 1px solid var(--color-border);
}

.modal-header h4 {
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

.modal-close-btn {
  width: 32px;
  height: 32px;
  background-color: transparent;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transition-fast);
  color: var(--color-text-secondary);
}

.modal-close-btn:hover {
  background-color: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

.modal-body {
  margin-bottom: var(--spacing-6);
}

.form-group {
  margin-bottom: var(--spacing-4);
}

.form-group label {
  display: block;
  margin-bottom: var(--spacing-2);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

.form-input {
  width: 100%;
  padding: var(--spacing-3) var(--spacing-4);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
  background-color: var(--color-background);
  transition: all var(--transition-normal);
}

.form-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(100, 108, 255, 0.1);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-4);
  padding-top: var(--spacing-4);
  border-top: 1px solid var(--color-border);
}

/* Loading动画样式 */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.9) 0%, rgba(20, 20, 40, 0.95) 100%);
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
  gap: var(--spacing-6);
  padding: var(--spacing-8);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(100, 108, 255, 0.3);
  border-radius: var(--border-radius-lg);
  box-shadow: 
    0 0 30px rgba(100, 108, 255, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  min-width: 320px;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.loading-content::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    45deg,
    transparent,
    rgba(100, 108, 255, 0.1),
    transparent
  );
  transform: rotate(45deg);
  animation: shine 3s linear infinite;
}

.loading-spinner {
  width: 100px;
  height: 100px;
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
  border: 4px solid rgba(100, 108, 255, 0.1);
  border-radius: 50%;
  animation: spin 2s linear infinite;
}

.loading-spinner::after {
  content: '';
  position: absolute;
  width: 80%;
  height: 80%;
  border: 4px solid transparent;
  border-top: 4px solid var(--color-primary);
  border-right: 4px solid var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  box-shadow: 0 0 20px rgba(100, 108, 255, 0.5);
}

.spinner-core {
  width: 60%;
  height: 60%;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-primary), #8b5cf6);
  animation: pulse 2s ease-in-out infinite;
  position: relative;
  overflow: hidden;
}

.spinner-core::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.4),
    transparent
  );
  animation: slide 3s ease-in-out infinite;
}

.loading-text {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  margin: 0;
  animation: fadeInOut 2s ease-in-out infinite;
  text-shadow: 0 0 10px rgba(100, 108, 255, 0.5);
  position: relative;
  z-index: 1;
}

.loading-dots {
  display: flex;
  gap: var(--spacing-2);
  margin-top: var(--spacing-2);
  position: relative;
  z-index: 1;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-primary), #8b5cf6);
  animation: dotPulse 2s ease-in-out infinite;
  box-shadow: 0 0 10px rgba(100, 108, 255, 0.7);
}

.dot:nth-child(2) {
  animation-delay: 0.3s;
}

.dot:nth-child(3) {
  animation-delay: 0.6s;
}

/* 动画关键帧 */
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes pulse {
  0% {
    transform: scale(0.9);
    box-shadow: 0 0 15px rgba(100, 108, 255, 0.5);
  }
  50% {
    transform: scale(1.1);
    box-shadow: 0 0 25px rgba(100, 108, 255, 0.8);
  }
  100% {
    transform: scale(0.9);
    box-shadow: 0 0 15px rgba(100, 108, 255, 0.5);
  }
}

@keyframes dotPulse {
  0% {
    transform: scale(0.7);
    opacity: 0.5;
    box-shadow: 0 0 5px rgba(100, 108, 255, 0.5);
  }
  50% {
    transform: scale(1.3);
    opacity: 1;
    box-shadow: 0 0 15px rgba(100, 108, 255, 0.8);
  }
  100% {
    transform: scale(0.7);
    opacity: 0.5;
    box-shadow: 0 0 5px rgba(100, 108, 255, 0.5);
  }
}

@keyframes fadeInOut {
  0%, 100% {
    opacity: 0.7;
    text-shadow: 0 0 5px rgba(100, 108, 255, 0.3);
  }
  50% {
    opacity: 1;
    text-shadow: 0 0 15px rgba(100, 108, 255, 0.8);
  }
}

@keyframes shine {
  0% {
    transform: translateX(-100%) rotate(45deg);
  }
  100% {
    transform: translateX(100%) rotate(45deg);
  }
}

@keyframes slide {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}
</style>
