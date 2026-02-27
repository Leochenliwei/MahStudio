<template>
  <div class="workbench-container">
    <!-- 左侧组件列表 -->
    <div class="components-sidebar" :class="{ 'collapsed': isComponentsSidebarCollapsed }">
      <div class="sidebar-header">
        <h3 v-if="!isComponentsSidebarCollapsed">
          <Icon name="grid" size="18" />
          组件列表
        </h3>
        <button class="sidebar-toggle" @click="toggleComponentsSidebar">
          <Icon :name="isComponentsSidebarCollapsed ? 'chevron-right' : 'chevron-left'" size="18" />
        </button>
      </div>
      <div v-if="!isComponentsSidebarCollapsed" class="components-filter">
        <!-- 搜索输入框 -->
        <div class="search-box">
          <Icon name="search" size="16" />
          <input 
            type="text" 
            v-model="searchKeyword" 
            placeholder="搜索组件..."
            class="search-input"
          >
        </div>
      </div>
      <div class="components-list">
        <div 
          v-for="(categoryComponents, category) in groupedComponents" 
          :key="category"
          class="category-folder"
        >
          <div 
            class="folder-header"
            @click="toggleCategory(category)"
          >
            <div class="folder-icon">
              <Icon :name="isCategoryExpanded(category) ? 'chevron-down' : 'chevron-right'" size="16" />
              <Icon name="folder" size="16" />
            </div>
            <h4 class="folder-title">{{ category }}</h4>
            <span class="component-count">{{ categoryComponents.length }}</span>
          </div>
          <div 
            class="folder-content"
            v-show="isCategoryExpanded(category)"
          >
            <div 
              v-for="component in categoryComponents" 
              :key="component.id"
              class="component-item"
            >
              <div class="component-icon"><Icon name="box" /></div>
              <div class="component-info">
                <h4>{{ component.name }}</h4>
                <p>{{ component.description }}</p>
              </div>
              <div class="component-toggle">
                <label class="toggle-switch" :class="{ 'locked': component.locked }">
                  <input 
                    type="checkbox" 
                    v-model="component.enabled"
                    @change="toggleComponent(component)"
                    :disabled="component.locked"
                  >
                  <span class="toggle-slider"></span>
                  <span v-if="component.locked" class="lock-icon">
                    <Icon name="lock" size="14" />
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 中间工作区画布 -->
    <div class="workbench-main">

      
      <!-- 工具栏 -->
      <div class="workbench-toolbar">
        <!-- 历史记录功能 -->
        <div class="toolbar-section history-section">
          <button class="toolbar-btn" @click="undo" title="撤销 (Ctrl+Z)">
            <Icon name="arrow-undo" size="16" />
            <span>撤销</span>
          </button>
          <button class="toolbar-btn" @click="redo" title="重做 (Ctrl+Y)">
            <Icon name="arrow-redo" size="16" />
            <span>重做</span>
          </button>
          <div class="toolbar-dropdown">
            <button class="toolbar-btn dropdown-toggle" @click="toggleHistoryDropdown">
              <Icon name="clock" size="16" />
              <span>历史记录</span>
              <Icon name="chevron-down" size="14" />
            </button>
            <div class="dropdown-menu" v-if="showHistoryDropdown">
              <div class="dropdown-header">操作历史</div>
              <div 
                v-for="(item, index) in history" 
                :key="index"
                class="dropdown-item"
                @click="rollbackToHistory(index)"
              >
                {{ item.action }}
              </div>
              <div v-if="history.length === 0" class="dropdown-item disabled">
                无历史记录
              </div>
            </div>
          </div>
        </div>
        
        <!-- 提测功能 -->
        <div class="toolbar-section publish-section">
          <button class="toolbar-btn save-btn" @click="save" title="保存 (Ctrl+S)">
            <Icon name="save" size="16" />
            <span>保存</span>
          </button>
          
          <button class="toolbar-btn publish-btn" @click="publish" title="提测 (Ctrl+Enter)">
            <Icon name="send" size="16" />
            <span>提测</span>
          </button>
        </div>
      </div>
      
      <div 
        class="workbench-canvas"
        @click="onCanvasClick"
        @mousedown="handleCanvasMouseDown"
        @wheel="handleCanvasWheel"
      >
        <!-- 画布内容容器 -->
        <div 
          class="canvas-content"
          :style="canvasContentStyle"
        >
        <!-- 分类容器和步骤条连线 -->
        <div class="category-steps-container">
          <div 
            v-for="(category, index) in categories" 
            :key="category.name"
            class="category-step"
            :style="{
              left: `${130 + index * 250}px`,
              top: '50px'
            }"
          >
            <!-- 步骤节点 -->
            <div class="step-node">
              <div class="step-number">{{ index + 1 }}</div>
            </div>
            
            <!-- 分类容器 -->
            <div class="category-container">
              <div class="category-header">{{ category.name }}</div>
              <div class="category-body">
                <div 
                  v-for="(component, compIndex) in category.components" 
                  :key="component.id"
                  class="category-component-item"
                  @click="selectCategoryComponent($event, component)"
                >
                  <div class="component-icon small"><Icon name="box" size="16" /></div>
                  <div class="component-info small">
                    <h5>{{ component.name }}</h5>
                  </div>
                </div>
                <div v-if="category.components.length === 0" class="empty-category">
                  <p>暂无组件</p>
                </div>
              </div>
            </div>
            
            <!-- 连接线 -->
            <div 
              v-if="index < categories.length - 1"
              class="step-connector"
              :style="{
                left: '220px',
                width: '30px'
              }"
            ></div>
          </div>
        </div>



        <VueDraggableResizable
          v-for="panel in panels"
          :key="panel.id"
          :x="panel.x"
          :y="panel.y"
          :width="panel.width"
          :height="panel.height"
          :min-width="200"
          :min-height="200"
          :grid="[10, 10]"
          :active="selectedPanelId === panel.id"
          @dragging="(x, y) => updatePanel(panel.id, { x, y })"
          @resizing="(left, top, width, height) => updatePanel(panel.id, { x: left, y: top, width, height })"
          @click="selectPanel(panel.id)"
        >
          <div class="panel-header">
            <h4>{{ panel.title }}</h4>
            <div class="panel-actions">
              <button class="panel-action-btn"><Icon name="minus" size="14" /></button>
              <button class="panel-action-btn"><Icon name="square" size="14" /></button>
              <button class="panel-action-btn" @click.stop="removePanel(panel.id)"><Icon name="x" size="14" /></button>
            </div>
          </div>
          <div class="panel-body">
            <div v-if="panel.type && components.length > 0">
              <!-- 显示组件的属性 -->
              <div v-if="getComponentProperties(panel.type).length > 0">
                <h5>{{selectedPanel.title}}</h5>
                <div class="component-properties">
                  <div 
                    v-for="property in getComponentProperties(panel.type)" 
                    :key="property.id"
                    class="property-item"
                  >
                    <label>{{ property.name }}</label>
                    <div class="property-value">
                      {{ property.defaultValue !== undefined ? property.defaultValue : '无默认值' }}
                    </div>
                  </div>
                </div>
              </div>
              <div v-else>
                <p>该组件暂无属性</p>
              </div>
            </div>
            <div v-else-if="panel.type">
              <!-- 空内容，不显示demo信息 -->
            </div>
          </div>
        </VueDraggableResizable>
        </div>
      </div>
      
      <!-- 底部悬浮工具栏 -->
      <div class="bottom-toolbar">
        <div class="toolbar-content">
          <button class="toolbar-item" @click="openTemplateLibrary">
            <Icon name="grid" size="18" />
            <span>游戏表现</span>
          </button>
          <button class="toolbar-item" @click="openVariableManagement">
            <Icon name="sliders" size="18" />
            <span>变量管理</span>
          </button>
          <button class="toolbar-item" @click="navigateToRoomCreator">
            <Icon name="box" size="18" />
            <span>创房选项</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 右侧属性面板 -->
    <div class="properties-panel" :class="{ 'collapsed': isPropertiesSidebarCollapsed }">
      <div class="panel-header">
        <h3 v-if="!isPropertiesSidebarCollapsed">
          <Icon name="sliders" size="18" />
          组件属性
        </h3>
        <button class="sidebar-toggle" @click="togglePropertiesSidebar">
          <Icon :name="isPropertiesSidebarCollapsed ? 'chevron-left' : 'chevron-right'" size="18" />
        </button>
      </div>
      <div class="properties-content">
        <div v-if="!selectedComponent" class="no-selection">
          <p>请选择一个组件</p>
        </div>
        <div v-else>
          <!-- 组件属性 -->
          <div class="property-group">
            <h4>{{selectedComponent.name}}</h4>
            <div v-for="property in selectedComponentProperties" :key="property.id" class="property-item">
              <label>{{ property.name }}</label>
              <div class="property-control">
                <!-- 开关类型 -->
                <label v-if="property.type === 'component_switch'" class="toggle-switch">
                  <input 
                    type="checkbox" 
                    :checked="selectedComponent?.enabled || false"
                    :disabled="selectedComponent?.locked || false"
                    @change="e => {
                      if (!selectedComponent?.locked) {
                        selectedComponent.enabled = e.target.checked
                        toggleComponent(selectedComponent)
                      }
                    }"
                  >
                  <span class="toggle-slider"></span>
                </label>
                <label v-else-if="property.type === 'switch'" class="toggle-switch">
                  <input 
                    type="checkbox" 
                    :checked="property.defaultValue || false"
                  >
                  <span class="toggle-slider"></span>
                </label>
                
                <!-- 单选按钮组类型 -->
                <div v-else-if="property.type === 'toggle'" class="toggle-group">
                  <label 
                    v-for="option in property.datas" 
                    :key="option.value"
                    class="toggle-option"
                  >
                    <input 
                      type="radio" 
                      :name="property.id"
                      :value="option.value"
                      :checked="property.defaultValue === option.value"
                    >
                    {{ option.label }}
                  </label>
                </div>
                
                <!-- 下拉选择框类型 -->
                <select v-else-if="property.type === 'select'" class="property-select">
                  <option 
                    v-for="option in property.datas" 
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </option>
                </select>
                
                <!-- 复选框类型 -->
                <div v-else-if="property.type === 'checkbox'" class="checkbox-group">
                  <label 
                    v-for="option in property.datas" 
                    :key="option.value"
                    class="checkbox-option"
                  >
                    <input 
                      type="checkbox" 
                      :value="option.value"
                      :checked="Array.isArray(property.defaultValue) ? property.defaultValue.includes(option.value) : property.defaultValue === option.value"
                    >
                    {{ option.label }}
                  </label>
                </div>
                
                <!-- 按钮类型 -->
                <button v-else-if="property.type === 'button'" class="property-button" @click="handleButtonClick(property)">
                  {{ property.name }}
                </button>
                
                <!-- 其他类型 -->
                <input v-else type="text" class="property-input">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 变量管理弹窗 -->
    <VariableManagementModal 
      :visible="isVariableManagementModalVisible"
      @close="closeVariableManagement"
    />

    <!-- 算分规则配置弹窗 -->
    <div v-if="isCalcScoreConfigModalVisible" class="modal-overlay-center">
      <div class="modal-wrapper">
        <CalcScoreConfig @close="isCalcScoreConfigModalVisible = false" />
      </div>
    </div>

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
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import VueDraggableResizable from 'vue-draggable-resizable'
import Icon from '../components/Icon.vue'
import VariableManagementModal from '../components/VariableManagementModal.vue'
import CalcScoreConfig from '../components/CalcScoreConfig.vue'
import SubmitTestModal from '../components/SubmitTestModal.vue'

const router = useRouter()
const route = useRoute()

// 选中的游戏配置
const selectedConfig = ref(null)

// 游戏配置列表数据
const gameConfigs = ref([
  {
    id: 1,
    name: '游戏配置 1',
    description: '这是第一个游戏配置',
    status: '启用',
    version: '1.0.0',
    createdAt: '2026-02-01',
    updatedAt: '2026-02-01'
  },
  {
    id: 2,
    name: '游戏配置 2',
    description: '这是第二个游戏配置',
    status: '禁用',
    version: '1.1.0',
    createdAt: '2026-02-02',
    updatedAt: '2026-02-03'
  },
  {
    id: 3,
    name: '游戏配置 3',
    description: '这是第三个游戏配置',
    status: '启用',
    version: '2.0.0',
    createdAt: '2026-02-03',
    updatedAt: '2026-02-04'
  },
  {
    id: 4,
    name: '游戏配置 4',
    description: '这是第四个游戏配置',
    status: '启用',
    version: '1.2.0',
    createdAt: '2026-02-04',
    updatedAt: '2026-02-05'
  },
  {
    id: 5,
    name: '游戏配置 5',
    description: '这是第五个游戏配置',
    status: '禁用',
    version: '1.3.0',
    createdAt: '2026-02-05',
    updatedAt: '2026-02-06'
  }
])

// 组件列表数据
const components = ref([])

// 搜索关键词
const searchKeyword = ref('')
// 展开的分类
const expandedCategories = ref(new Set())

// 加载组件列表数据
async function loadComponents() {
  console.log('开始加载组件列表...')
  try {
    // 使用正确的路径，基于vite.config.js中的base配置
    console.log('尝试获取 components_list.json 文件...')
    const response = await fetch('/MahStudio/components_list.json')
    
    // 检查响应状态
    console.log('响应状态:', response.status)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    // 检查响应类型
    const contentType = response.headers.get('content-type')
    console.log('响应类型:', contentType)
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text()
      throw new Error(`Invalid content type: ${contentType}. Response: ${text.substring(0, 100)}...`)
    }
    
    const data = await response.json()
    console.log('获取到组件数据:', data.components.length, '个组件')
    
    // 检查是否有算分相关的组件
    const calscoreComponents = data.components.filter(component => {
      return component.properties && component.properties.some(prop => 
        prop.type === 'button' && prop.extend && prop.extend.editorType === 'calscore'
      )
    })
    console.log('找到算分规则按钮组件:', calscoreComponents.length, '个')
    
    // 为每个组件添加默认图标、启用状态和锁定状态
    components.value = data.components.map(component => ({
      ...component,
      icon: '📦', // 默认图标
      description: component.category, // 使用分类作为描述
      enabled: component.required || false, // 强制开启的组件默认启用
      locked: component.required || false // 强制开启的组件默认锁定
    }))
    console.log('组件列表加载完成:', components.value.length, '个组件')
    return components.value
  } catch (error) {
    console.error('加载组件列表失败:', error)
    return []
  }
}

// 过滤后的组件列表
const filteredComponents = computed(() => {
  return components.value.filter(component => {
    // 搜索过滤
    const matchesSearch = !searchKeyword.value || 
      component.name.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
      component.description.toLowerCase().includes(searchKeyword.value.toLowerCase())
    
    return matchesSearch
  })
})

// 按分类分组的组件
const groupedComponents = computed(() => {
  const filtered = filteredComponents.value
  const grouped = {}
  
  // 按分类分组
  filtered.forEach(component => {
    if (!grouped[component.category]) {
      grouped[component.category] = []
    }
    grouped[component.category].push(component)
  })
  
  return grouped
})

// 工作台面板数据
const panels = ref([])

// 画布缩放比例
const canvasScale = ref(100)

// 画布位置
const canvasPosition = ref({ x: 0, y: 0 })

// 拖拽状态
const isDragging = ref(false)
const lastMousePosition = ref({ x: 0, y: 0 })

// 拖拽模式
const dragMode = ref(null) // 'space' 或 'middleMouse'

// 选中的面板ID
const selectedPanelId = ref(null)

// 选中的category组件
const selectedCategoryComponent = ref(null)

// 分类列表数据（从组件中提取唯一分类）
const categories = ref([])

// 工具栏相关状态
const showHistoryDropdown = ref(false)
const history = ref([])
const historyIndex = ref(-1)



// 侧边栏折叠状态
const isComponentsSidebarCollapsed = ref(false)
const isPropertiesSidebarCollapsed = ref(false)

// 变量管理弹窗状态
const isVariableManagementModalVisible = ref(false)

// 算分规则配置弹窗状态
const isCalcScoreConfigModalVisible = ref(false)

// 提测弹窗状态
const showSubmitTestModalVisible = ref(false)
const currentSubmitDraft = ref(null)

// 切换左侧组件侧边栏
function toggleComponentsSidebar() {
  isComponentsSidebarCollapsed.value = !isComponentsSidebarCollapsed.value
}

// 切换右侧属性侧边栏
function togglePropertiesSidebar() {
  isPropertiesSidebarCollapsed.value = !isPropertiesSidebarCollapsed.value
}

// 切换分类展开/折叠状态
function toggleCategory(category) {
  const currentExpanded = expandedCategories.value
  if (currentExpanded.has(category)) {
    currentExpanded.delete(category)
  } else {
    currentExpanded.add(category)
  }
  // 重新赋值以触发响应式更新
  expandedCategories.value = new Set(currentExpanded)
}

// 检查分类是否展开
function isCategoryExpanded(category) {
  return expandedCategories.value.has(category)
}

// 打开模板库
function openTemplateLibrary() {
  alert('模板库功能暂未开发')
}

// 打开变量管理
function openVariableManagement() {
  isVariableManagementModalVisible.value = true
}

// 关闭变量管理
function closeVariableManagement() {
  isVariableManagementModalVisible.value = false
}

// 导航到创房选项页面
function navigateToRoomCreator() {
  router.push({ name: 'RoomCreator', params: { id: route.params.id } })
}

// 快捷键支持
function setupKeyboardShortcuts() {
  document.addEventListener('keydown', (event) => {
    // 撤销: Ctrl+Z
    if ((event.ctrlKey || event.metaKey) && event.key === 'z') {
      event.preventDefault()
      undo()
    }
    // 重做: Ctrl+Y
    if ((event.ctrlKey || event.metaKey) && event.key === 'y') {
      event.preventDefault()
      redo()
    }
    // 保存: Ctrl+S
    if ((event.ctrlKey || event.metaKey) && event.key === 's') {
      event.preventDefault()
      save()
    }
    // 预览: Ctrl+P
    if ((event.ctrlKey || event.metaKey) && event.key === 'p') {
      event.preventDefault()
      preview()
    }
    // 提测: Ctrl+Enter
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      event.preventDefault()
      publish()
    }
    // 空格键：开始拖拽
    if (event.key === ' ' && !isDragging.value) {
      event.preventDefault()
      dragMode.value = 'space'
      isDragging.value = true
    }
  })
  
  document.addEventListener('keyup', (event) => {
    // 空格键：结束拖拽
    if (event.key === ' ' && isDragging.value && dragMode.value === 'space') {
      isDragging.value = false
      dragMode.value = null
    }
  })
}

// 鼠标移动事件处理函数
function handleMouseMove(event) {
  if (isDragging.value) {
    const deltaX = event.clientX - lastMousePosition.value.x
    const deltaY = event.clientY - lastMousePosition.value.y
    
    // 更新画布位置
    canvasPosition.value.x += deltaX
    canvasPosition.value.y += deltaY
    
    // 更新鼠标位置
    lastMousePosition.value = { x: event.clientX, y: event.clientY }
  }
}

// 鼠标释放事件处理函数
function handleMouseUp() {
  if (isDragging.value) {
    isDragging.value = false
    dragMode.value = null
  }
}

// 画布鼠标按下事件处理函数
function handleCanvasMouseDown(event) {
  // 鼠标中键按下：开始拖拽
  if (event.button === 1 && !isDragging.value) {
    event.preventDefault()
    dragMode.value = 'middleMouse'
    isDragging.value = true
    lastMousePosition.value = { x: event.clientX, y: event.clientY }
  }
}

// 画布鼠标滚轮事件处理函数
function handleCanvasWheel(event) {
  event.preventDefault()
  
  // 检测是否按下了修饰键（Windows: Alt, Mac: Command）
  const isZooming = event.altKey || event.metaKey
  
  if (isZooming) {
    // 实现缩放功能
    const zoomSpeed = 0.05
    const delta = event.deltaY > 0 ? -zoomSpeed : zoomSpeed
    
    // 计算新的缩放比例
    let newScale = canvasScale.value + delta * 100
    
    // 限制缩放范围
    newScale = Math.max(10, Math.min(500, newScale))
    
    // 更新缩放比例
    canvasScale.value = newScale
  } else {
    // 实现滚动功能
    const scrollSpeed = 5
    
    // 更新画布位置以实现滚动效果
    canvasPosition.value.x += event.deltaX * scrollSpeed / 100
    canvasPosition.value.y += event.deltaY * scrollSpeed / 100
  }
}

// 初始化快捷键和事件监听器
onMounted(() => {
  setupKeyboardShortcuts()
  
  // 添加鼠标移动和释放事件监听器
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
})

// 清理事件监听器
onUnmounted(() => {
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
})

// 切换历史记录下拉菜单
function toggleHistoryDropdown() {
  showHistoryDropdown.value = !showHistoryDropdown.value
}

// 添加历史记录
function addHistory(action) {
  // 移除当前索引之后的历史记录
  if (historyIndex.value < history.value.length - 1) {
    history.value = history.value.slice(0, historyIndex.value + 1)
  }
  
  // 添加新的历史记录
  history.value.push({
    action,
    timestamp: new Date().toLocaleTimeString(),
    state: JSON.stringify({ panels: [...panels.value] })
  })
  
  // 更新历史记录索引
  historyIndex.value++
  
  // 限制历史记录数量
  if (history.value.length > 50) {
    history.value.shift()
    historyIndex.value--
  }
}

// 撤销
function undo() {
  if (historyIndex.value > 0) {
    historyIndex.value--
    const historyItem = history.value[historyIndex.value]
    const state = JSON.parse(historyItem.state)
    panels.value = state.panels
    addHistory('撤销操作')
  }
}

// 重做
function redo() {
  if (historyIndex.value < history.value.length - 1) {
    historyIndex.value++
    const historyItem = history.value[historyIndex.value]
    const state = JSON.parse(historyItem.state)
    panels.value = state.panels
    addHistory('重做操作')
  }
}

// 回滚到指定历史记录
function rollbackToHistory(index) {
  if (index >= 0 && index < history.value.length) {
    historyIndex.value = index
    const historyItem = history.value[index]
    const state = JSON.parse(historyItem.state)
    panels.value = state.panels
    addHistory('回滚到历史记录')
    showHistoryDropdown.value = false
  }
}

// 保存
function save() {
  console.log('保存配置')
  // 这里可以实现保存到本地存储或服务器的逻辑
  addHistory('保存配置')
  alert('配置已保存')
}

// 预览
function preview() {
  console.log('预览配置')
  // 这里可以实现预览功能的逻辑
  addHistory('预览配置')
  alert('预览功能开发中')
}

// 提测
function publish() {
  console.log('提测配置')
  // 准备提测的草稿数据
  currentSubmitDraft.value = {
    id: `draft-${Date.now()}`,
    name: selectedConfig.value?.name || '当前配置',
    type: 'DRAFT'
  }
  // 显示提测弹窗
  showSubmitTestModalVisible.value = true
  addHistory('提测配置')
}

// 处理提测操作
function handleSubmitTest({ targetType }) {
  console.log('处理提测操作:', targetType)
  // 这里可以实现提测到生产环境的逻辑
  showSubmitTestModalVisible.value = false
  currentSubmitDraft.value = null
  alert(`配置已提测到${targetType === 'testMatch' ? '测试约局' : '测试金币'}`)
}

// 加载分类列表
function loadCategories() {
  // 从组件中提取唯一分类
  const categorySet = new Set()
  components.value.forEach(component => {
    categorySet.add(component.category)
  })
  
  // 转换为数组并排序（按照游戏流程顺序）
  const categoryArray = Array.from(categorySet)
  // 定义游戏流程顺序
  const flowOrder = ['基   础', '发牌前', '发牌后', '行   牌', '胡   牌', '算   分']
  // 按照流程顺序排序
  categories.value = flowOrder.filter(cat => categoryArray.includes(cat)).map(category => ({
    name: category,
    components: []
  }))
}

// 将强制开启的组件添加到对应的分类中
function addRequiredComponentsToCategories() {
  components.value.forEach(component => {
    // 对于强制开启的组件，无论 enabled 状态如何，都添加到分类中
    if (component.required) {
      // 确保强制开启的组件状态为 enabled 和 locked
      component.enabled = true
      component.locked = true
      
      // 找到对应的分类并添加组件
      const category = categories.value.find(cat => cat.name.trim() === component.category.trim())
      if (category) {
        // 检查分类中是否已经存在该组件
        const isExists = category.components.some(c => c.id === component.id)
        if (!isExists) {
          // 使用 push 方法添加组件
          category.components.push(component)
          // 添加历史记录
          addHistory(`启用组件: ${component.name}`)
        }
      } else {
        // 如果找不到对应的分类，打印错误信息
        console.error(`找不到对应的分类: ${component.category}`)
      }
    }
  })
}

// 切换组件启用状态
function toggleComponent(component) {
  // 如果组件被锁定，不允许切换
  if (component.locked) {
    return
  }
  
  // 检查组件是否要启用
  if (component.enabled) {
    // 检查是否有相同ID的组件已经启用
    const isDuplicate = components.value.some(c => c.id === component.id && c.enabled && c !== component)
    if (isDuplicate) {
      alert('该组件已经启用，不能重复启用！')
      component.enabled = false
      return
    }
    
    // 找到对应的分类并添加组件
    const categoryIndex = categories.value.findIndex(cat => cat.name === component.category)
    if (categoryIndex !== -1) {
      // 检查分类中是否已经存在该组件
      const isExists = categories.value[categoryIndex].components.some(c => c.id === component.id)
      if (!isExists) {
        // 创建一个新的组件数组，以触发响应式更新
        categories.value[categoryIndex].components = [...categories.value[categoryIndex].components, component]
        // 添加历史记录
        addHistory(`启用组件: ${component.name}`)
      }
    }
  } else {
    // 找到对应的分类并移除组件
    const categoryIndex = categories.value.findIndex(cat => cat.name === component.category)
    if (categoryIndex !== -1) {
      const componentIndex = categories.value[categoryIndex].components.findIndex(c => c.id === component.id)
      if (componentIndex !== -1) {
        // 创建一个新的组件数组，以触发响应式更新
        categories.value[categoryIndex].components = categories.value[categoryIndex].components.filter(c => c.id !== component.id)
        // 添加历史记录
        addHistory(`取消启用组件: ${component.name}`)
      }
    }
  }
}

// 组件挂载后加载分类和组件
onMounted(async () => {
  const id = parseInt(route.params.id)
  loadGameConfig(id)
  try {
    // 加载组件
    await loadComponents()
    // 加载分类
    loadCategories()
    // 确保分类已加载完成
    console.log('Categories loaded:', categories.value)
    // 将强制开启的组件添加到对应的分类中
    addRequiredComponentsToCategories()
    // 确保强制开启的组件已添加到分类中
    console.log('Required components added to categories')
  } catch (error) {
    console.error('初始化组件失败:', error)
  }
})

// 计算属性：选中的面板
const selectedPanel = computed(() => {
  return panels.value.find(panel => panel.id === selectedPanelId.value)
})

// 计算属性：选中的组件（面板或category组件）
const selectedComponent = computed(() => {
  if (selectedCategoryComponent.value) {
    return selectedCategoryComponent.value
  }
  if (selectedPanel.value && selectedPanel.value.type) {
    return components.value.find(c => c.id === selectedPanel.value.type)
  }
  return null
})

// 计算属性：选中组件的属性
const selectedComponentProperties = computed(() => {
  if (selectedCategoryComponent.value) {
    return selectedCategoryComponent.value.properties || []
  }
  if (selectedPanel.value && selectedPanel.value.type) {
    return getComponentProperties(selectedPanel.value.type)
  }
  return []
})

// 计算属性：画布内容样式
const canvasContentStyle = computed(() => {
  const scale = canvasScale.value / 100
  return {
    transform: `translate(${canvasPosition.value.x}px, ${canvasPosition.value.y}px) scale(${scale})`,
    transformOrigin: '0 0'
  }
})

// 加载游戏配置数据
function loadGameConfig(id) {
  const config = gameConfigs.value.find(config => config.id === id)
  if (config) {
    selectedConfig.value = config
  }
}

// 返回管理台
function goBack() {
  router.push({ name: 'Admin' })
}

// 更新面板位置和大小
function updatePanel(id, newProps) {
  const panel = panels.value.find(p => p.id === id)
  if (panel) {
    Object.assign(panel, newProps)
  }
}

// 选择面板
function selectPanel(id) {
  selectedPanelId.value = id
  // 自动展开右侧属性面板
  isPropertiesSidebarCollapsed.value = false
}

// 点击画布空白处，取消选择
function onCanvasClick() {
  clearSelection()
}

// 选择category组件
function selectCategoryComponent(event, component) {
  // 阻止事件冒泡，避免触发画布的点击事件
  event.stopPropagation()
  selectedCategoryComponent.value = component
  selectedPanelId.value = null
  // 自动展开右侧属性面板
  isPropertiesSidebarCollapsed.value = false
}

// 清除选中状态
function clearSelection() {
  selectedCategoryComponent.value = null
  selectedPanelId.value = null
}

// 添加新面板
function addNewPanel(component, x, y) {
  const newId = panels.value.length > 0 ? Math.max(...panels.value.map(p => p.id)) + 1 : 1
  const newPanel = {
    id: newId,
    x: x - 100, // 调整位置，使组件居中显示
    y: y - 50,
    width: 400,
    height: 300,
    title: component.name,
    type: component.id,
    category: component.category
  }
  panels.value.push(newPanel)
  selectedPanelId.value = newId
  
  // 添加历史记录
  addHistory(`添加组件: ${component.name}`)
}

// 删除面板
function removePanel(id) {
  const index = panels.value.findIndex(p => p.id === id)
  if (index !== -1) {
    const panel = panels.value[index]
    panels.value.splice(index, 1)
    if (selectedPanelId.value === id) {
      selectedPanelId.value = null
    }
    
    // 添加历史记录
    addHistory(`删除组件: ${panel.title}`)
  }
}

// 更新面板属性
function updatePanelProperties() {
  // 当面板属性更新时，这里可以添加额外的逻辑
  console.log('面板属性已更新:', selectedPanel.value)
  
  // 添加历史记录
  if (selectedPanel.value) {
    addHistory(`更新组件属性: ${selectedPanel.value.title}`)
  }
}

// 根据组件类型获取属性列表
function getComponentProperties(componentId) {
  const component = components.value.find(c => c.id === componentId)
  return component ? component.properties : []
}

/**
 * 处理按钮点击事件
 * @param {object} property - 属性对象
 */
function handleButtonClick(property) {
  console.log('按钮被点击:', property)
  // 检查是否有extend属性和editorType
  if (property.extend && property.extend.editorType === 'calscore') {
    // 打开算分规则配置弹窗
    isCalcScoreConfigModalVisible.value = true
  }
}
</script>

<style scoped>
.workbench-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  background-color: var(--color-background-secondary);
  color: var(--color-text-primary);
}

/* 左侧组件列表样式 */
.components-sidebar {
  width: 240px;
  background-color: var(--color-surface);
  border-right: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: width 0.3s ease;
}

.components-sidebar.collapsed {
  width: 60px;
}

.components-sidebar.collapsed .components-list {
  display: none;
}

.components-sidebar.collapsed .sidebar-header h3 {
  display: none;
}

.sidebar-header {
  padding: var(--spacing-6);
  border-bottom: 1px solid var(--color-border);
  background-color: var(--color-surface-hover);
}

/* 组件筛选区域样式 */
.components-filter {
  padding: var(--spacing-4);
  border-bottom: 1px solid var(--color-border);
  background-color: var(--color-surface);
}

/* 搜索框样式 */
.search-box {
  position: relative;
  margin-bottom: var(--spacing-3);
}

.search-box Icon {
  position: absolute;
  left: var(--spacing-3);
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-tertiary);
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: var(--spacing-3) var(--spacing-3) var(--spacing-3) var(--spacing-10);
  background-color: var(--color-surface-hover);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
  transition: all var(--transition-normal);
}

.search-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(100, 108, 255, 0.2);
}



/* 锁定的切换开关样式 */
.toggle-switch.locked {
  position: relative;
}

.toggle-switch.locked input:disabled + .toggle-slider {
  background-color: var(--color-border);
  cursor: not-allowed;
}

.toggle-switch.locked input:disabled:checked + .toggle-slider {
  background-color: var(--color-primary);
  opacity: 0.7;
}

.lock-icon {
  position: absolute;
  right: -20px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-primary);
  font-size: 14px;
  cursor: not-allowed;
}

.sidebar-header h3 {
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
}

.sidebar-toggle {
  background: none;
  border: none;
  color: var(--color-text-primary);
  cursor: pointer;
  padding: var(--spacing-2);
  border-radius: var(--border-radius-md);
  transition: all var(--transition-normal);
  display: flex;
  align-items: center;
  justify-content: center;
}

.sidebar-toggle:hover {
  background-color: var(--color-surface-hover);
  color: var(--color-primary);
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.components-list {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-4);
}

.no-components {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: var(--color-text-tertiary);
  font-size: var(--font-size-sm);
}

/* 分类文件夹样式 */
.category-folder {
  margin-bottom: var(--spacing-2);
  border-radius: var(--border-radius-md);
  overflow: hidden;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
}

.folder-header {
  display: flex;
  align-items: center;
  padding: var(--spacing-3);
  cursor: pointer;
  transition: all var(--transition-normal);
  background-color: var(--color-surface-hover);
  border-bottom: 1px solid var(--color-border);
}

.folder-header:hover {
  background-color: var(--color-surface-hover);
}

.folder-icon {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  color: var(--color-primary);
  margin-right: var(--spacing-2);
}

.folder-title {
  flex: 1;
  margin: 0;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

.component-count {
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
  background-color: var(--color-surface);
  padding: 2px 8px;
  border-radius: var(--border-radius-full);
  border: 1px solid var(--color-border);
}

.folder-content {
  padding: var(--spacing-2);
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    max-height: 0;
  }
  to {
    opacity: 1;
    max-height: 500px;
  }
}

.component-item {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-2);
  margin-bottom: var(--spacing-1);
  transition: all var(--transition-normal);
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
}

.component-toggle {
  margin-left: auto;
}

/* 切换开关样式 */
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 48px;
  height: 24px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--color-border);
  transition: .4s;
  border-radius: 24px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .toggle-slider {
  background-color: var(--color-primary);
}

input:checked + .toggle-slider:before {
  transform: translateX(24px);
}

input:focus + .toggle-slider {
  box-shadow: 0 0 1px var(--color-primary);
}

.component-item:hover {
  background-color: var(--color-surface-hover);
  border-color: var(--color-primary);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(100, 108, 255, 0.15);
}

.component-item:active {
  cursor: grabbing;
}

.component-icon {
  width: 40px;
  height: 40px;
  background-color: var(--color-surface-hover);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: var(--color-primary);
}

.component-info {
  flex: 1;
}

.component-info h4 {
  margin: 0 0 4px 0;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

.component-info p {
  margin: 0;
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
  line-height: var(--line-height-normal);
}

/* 中间工作区样式 */
.workbench-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: var(--color-background);
}

.workbench-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--color-border);
  padding: var(--spacing-6);
  background-color: var(--color-surface);
  box-shadow: var(--shadow-sm);
}

.workbench-header h2 {
  margin: 0;
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  color: var(--color-text-primary);
}

.selected-config {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-normal);
  color: var(--color-primary);
  background-color: rgba(100, 108, 255, 0.1);
  padding: 6px 12px;
  border-radius: var(--border-radius-full);
  border: 1px solid var(--color-primary);
}

.header-actions {
  display: flex;
  gap: var(--spacing-4);
  align-items: center;
}

.canvas-action-btn {
  padding: var(--spacing-3) var(--spacing-6);
  background-color: var(--color-surface);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  cursor: pointer;
  transition: all var(--transition-normal);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
}

.canvas-action-btn:hover {
  background-color: var(--color-surface-hover);
  border-color: var(--color-primary);
}

.back-btn {
  padding: var(--spacing-3) var(--spacing-6);
  background-color: var(--color-surface);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  cursor: pointer;
  transition: all var(--transition-normal);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
}

.back-btn:hover {
  background-color: var(--color-surface-hover);
  border-color: var(--color-primary);
  transform: translateX(-3px);
}

.back-btn::after {
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

.back-btn:hover::after {
  transform: scaleY(1);
}

/* 工具栏样式 */
.workbench-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-4) var(--spacing-6);
  background-color: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  box-shadow: var(--shadow-sm);
  gap: var(--spacing-4);
}

.toolbar-section {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
}

.toolbar-btn {
  padding: var(--spacing-2) var(--spacing-4);
  background-color: var(--color-surface);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  position: relative;
  overflow: hidden;
}

.toolbar-btn::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 5px;
  height: 5px;
  background: rgba(255, 255, 255, 0.5);
  opacity: 0;
  border-radius: 100%;
  transform: scale(1, 1) translate(-50%, -50%);
  transform-origin: 50% 50%;
}

.toolbar-btn:focus:not(:active)::after {
  animation: ripple 0.6s ease-out;
}

@keyframes ripple {
  0% {
    transform: scale(0, 0);
    opacity: 0.5;
  }
  100% {
    transform: scale(20, 20);
    opacity: 0;
  }
}

.toolbar-btn:hover {
  background-color: var(--color-surface-hover);
  border-color: var(--color-primary);
}

.toolbar-btn:active {
  transform: translateY(1px);
}

/* 工具栏按钮特殊样式 */
.save-btn:hover {
  background-color: rgba(16, 185, 129, 0.1);
  border-color: #10b981;
  color: #10b981;
}

.preview-btn:hover {
  background-color: rgba(59, 130, 246, 0.1);
  border-color: #3b82f6;
  color: #3b82f6;
}

.publish-btn:hover {
  background-color: rgba(249, 115, 22, 0.1);
  border-color: #f97316;
  color: #f97316;
}

/* 下拉菜单样式 */
.toolbar-dropdown {
  position: relative;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 4px;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-md);
  z-index: 100;
  min-width: 200px;
  max-height: 300px;
  overflow-y: auto;
}

.dropdown-header {
  padding: var(--spacing-3) var(--spacing-4);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-tertiary);
  border-bottom: 1px solid var(--color-border);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.dropdown-item {
  padding: var(--spacing-3) var(--spacing-4);
  cursor: pointer;
  transition: all var(--transition-normal);
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
}

.dropdown-item:hover {
  background-color: var(--color-surface-hover);
  color: var(--color-primary);
}

.dropdown-item.disabled {
  cursor: not-allowed;
  color: var(--color-text-tertiary);
}

.dropdown-item.disabled:hover {
  background-color: transparent;
  color: var(--color-text-tertiary);
}

.workbench-canvas {
  flex: 1;
  position: relative;
  background-color: var(--color-background-secondary);
  overflow: auto;
  cursor: default;
  /* 添加网格背景 - 亮色系 */
  background-image:
    linear-gradient(rgba(0, 0, 0, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 0, 0, 0.03) 1px, transparent 1px);
  background-size: 20px 20px;
  padding: var(--spacing-6);
}

.canvas-content {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.1s ease-out;
}

/* 步骤条容器样式 */
.category-steps-container {
  position: relative;
  width: 100%;
  height: 100%;
}

/* 分类步骤样式 */
.category-step {
  position: absolute;
  width: 250px;
  height: 420px;
  display: flex;
  align-items: flex-start;
  z-index: 1;
}

/* 步骤节点样式 */
.step-node {
  position: absolute;
  top: 20px;
  left: -15px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: var(--color-primary);
  border: 2px solid var(--color-background);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
}

/* 步骤数字样式 */
.step-number {
  color: white;
  font-size: 14px;
  font-weight: bold;
}

/* 分类容器样式 */
.category-container {
  position: relative;
  width: 220px;
  height: 420px;
  border: 2px dashed var(--color-border-dark);
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.6);
  z-index: 1;
  transition: all 0.3s ease;
  backdrop-filter: blur(4px);
}

/* 步骤连接线样式 */
.step-connector {
  position: absolute;
  top: 34px;
  height: 2px;
  background-color: var(--color-primary);
  z-index: 0;
  margin-top: 1px;
}

.category-container:hover {
  border-color: var(--color-primary);
  background-color: rgba(59, 130, 246, 0.05);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

.category-header {
  padding: 12px;
  background-color: var(--color-surface-hover);
  border-bottom: 1px dashed var(--color-border-dark);
  text-align: center;
  font-weight: 500;
  color: var(--color-text-primary);
  border-radius: 6px 6px 0 0;
  font-size: 14px;
}

.category-body {
  padding: 15px;
  height: calc(100% - 45px);
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
}

.category-component-item {
  background-color: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  padding: 10px;
  transition: all var(--transition-normal);
  display: flex;
  align-items: center;
  gap: 10px;
}

.category-component-item:hover {
  background-color: var(--color-surface-hover);
  border-color: var(--color-primary);
}

.component-icon.small {
  width: 32px;
  height: 32px;
  font-size: 16px;
}

.component-info.small h5 {
  margin: 0;
  font-size: 16px;
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

.empty-category {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: var(--color-text-tertiary);
  font-size: 14px;
}

/* 流程连线样式 */
.flow-connections {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
}

/* 算分规则配置弹窗样式 */
.modal-overlay-center {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-wrapper {
  width: 90vw;
  height: 90vh;
  max-width: 90vw;
  max-height: 90vh;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}
/* 右侧属性面板样式 */
.properties-panel {
  width: 480px;
  background-color: var(--color-surface);
  border-left: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: width 0.3s ease;
}

.properties-panel.collapsed {
  width: 60px;
}

.properties-panel.collapsed .properties-content {
  display: none;
}

.properties-panel.collapsed .panel-header h3 {
  display: none;
}

.panel-header {
  padding: var(--spacing-6);
  border-bottom: 1px solid var(--color-border);
  background-color: var(--color-surface-hover);
}

.panel-header h3 {
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
}

.properties-content {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-6);
}

.no-selection {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: var(--color-text-tertiary);
  font-size: var(--font-size-sm);
  flex-direction: column;
  gap: var(--spacing-4);
}

.no-selection::before {
  content: '';
  width: 64px;
  height: 64px;
  background-color: var(--color-surface-hover);
  border-radius: var(--border-radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed var(--color-border);
}

.panel-properties {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-6);
}

.property-group {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-3);
  box-shadow: var(--shadow-sm);
}

.property-group h4 {
  margin: 0 0 var(--spacing-4) 0;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  border-bottom: 1px solid var(--color-border);
  padding-bottom: var(--spacing-3);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.property-item {
  margin-bottom: var(--spacing-2);
}

.property-item:last-child {
  margin-bottom: 0;
}

.property-item label {
  display: block;
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
  margin-bottom: var(--spacing-2);
  font-weight: var(--font-weight-medium);
}

.property-item input {
  width: 100%;
  padding: var(--spacing-3) var(--spacing-4);
  background-color: var(--color-surface-hover);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
  transition: all var(--transition-normal);
  font-family: inherit;
}

.property-item input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(100, 108, 255, 0.2);
}

.property-control {
  display: flex;
  align-items: center;
}

/* 单选按钮组样式 */
.toggle-group {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-4);
  width: 100%;
}

.toggle-option {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-2);
  cursor: pointer;
  flex-basis: calc(33.333% - var(--spacing-4));
  min-width: 120px;
}

.toggle-option span {
  word-break: break-word;
}

.toggle-option input[type="radio"] {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

/* 下拉选择框样式 */
.property-select {
  width: 100%;
  padding: var(--spacing-3) var(--spacing-4);
  background-color: var(--color-surface-hover);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
  transition: all var(--transition-normal);
  font-family: inherit;
  cursor: pointer;
}

.property-select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(100, 108, 255, 0.2);
}

/* 复选框组样式 */
.checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-4);
  width: 100%;
}

.checkbox-option {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-2);
  cursor: pointer;
  flex-basis: calc(33.333% - var(--spacing-4));
  min-width: 120px;
}

.checkbox-option span {
  word-break: break-word;
}

.checkbox-option input[type="checkbox"] {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

/* 按钮样式 */
.property-button {
  padding: var(--spacing-3) var(--spacing-4);
  background-color: var(--color-primary);
  color: white;
  border: 1px solid var(--color-primary);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--transition-normal);
  font-family: inherit;
}

.property-button:hover {
  background-color: var(--color-primary-hover);
  border-color: var(--color-primary-hover);
}

/* 文本输入框样式 */
.property-input {
  width: 100%;
  padding: var(--spacing-3) var(--spacing-4);
  background-color: var(--color-surface-hover);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
  transition: all var(--transition-normal);
  font-family: inherit;
}

.property-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(100, 108, 255, 0.2);
}

/* 自定义面板样式 */
.panel-header {
  background-color: var(--color-surface);
  padding: var(--spacing-4) var(--spacing-5);
  border-bottom: 1px solid var(--color-border);
  cursor: move;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: var(--border-radius-md) var(--border-radius-md) 0 0;
  transition: all var(--transition-normal);
  border-left: 4px solid transparent;
  box-shadow: var(--shadow-sm);
}

.panel-header:hover {
  background-color: var(--color-surface-hover);
  border-left-color: var(--color-primary);
}

.panel-header h4 {
  margin: 0;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.panel-actions {
  display: flex;
  gap: var(--spacing-1);
}

.panel-action-btn {
  width: 24px;
  height: 24px;
  border: none;
  border-radius: var(--border-radius-sm);
  background-color: var(--color-surface-hover);
  color: var(--color-text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-xs);
  transition: all var(--transition-fast);
  border: 1px solid var(--color-border);
}

.panel-action-btn:hover {
  background-color: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

.panel-body {
  padding: var(--spacing-5);
  background-color: var(--color-surface);
  height: calc(100% - 56px);
  overflow-y: auto;
  border-radius: 0 0 var(--border-radius-md) var(--border-radius-md);
  border: 1px solid var(--color-border);
  border-top: none;
}

.panel-body p {
  margin: 0 0 var(--spacing-3) 0;
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-normal);
}

.panel-body h5 {
  margin: 0 0 var(--spacing-4) 0;
  font-size: 18px;
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  border-bottom: 1px solid var(--color-border);
  padding-bottom: var(--spacing-3);
}

.component-properties {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
}

.component-properties .property-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-3) 0;
  border-bottom: 1px solid var(--color-border);
}

.component-properties .property-item:last-child {
  border-bottom: none;
}

.component-properties .property-item label {
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
  margin: 0;
  font-weight: var(--font-weight-medium);
}

.component-properties .property-value {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  background-color: var(--color-surface-hover);
  padding: 4px 8px;
  border-radius: var(--border-radius-sm);
  border: 1px solid var(--color-border);
}

/* 底部悬浮工具栏 */
.bottom-toolbar {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
  padding: var(--spacing-3);
  z-index: 100;
}

.toolbar-content {
  display: flex;
  gap: var(--spacing-4);
}

.toolbar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-1);
  padding: var(--spacing-3);
  background: none;
  border: none;
  color: var(--color-text-primary);
  cursor: pointer;
  transition: all var(--transition-normal);
  border-radius: var(--border-radius-md);
}

.toolbar-item:hover {
  background-color: var(--color-surface-hover);
  color: var(--color-primary);
  transform: translateY(-2px);
}

.toolbar-item Icon {
  font-size: 18px;
}

.toolbar-item span {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
}

/* 覆盖 vue-draggable-resizable 的默认样式 */
:deep(.vdr) {
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-md);
  overflow: hidden;
  border: 1px solid var(--color-border);
}

:deep(.vdr.active) {
  box-shadow: 0 0 0 2px var(--color-primary), 0 4px 12px rgba(100, 108, 255, 0.2);
  border-color: var(--color-primary);
}

:deep(.vdr-drag-handle) {
  z-index: 10;
}

:deep(.vdr-resize-handle) {
  background-color: var(--color-primary);
  width: 6px;
  height: 6px;
  border-radius: var(--border-radius-sm);
  border: 1px solid white;
}

:deep(.vdr-resize-handle-tl),
:deep(.vdr-resize-handle-tr),
:deep(.vdr-resize-handle-bl),
:deep(.vdr-resize-handle-br) {
  width: 10px;
  height: 10px;
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: var(--color-surface);
  border-radius: var(--border-radius-full);
}

::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: var(--border-radius-full);
  transition: background var(--transition-fast);
}

::-webkit-scrollbar-thumb:hover {
  background: var(--color-border-light);
}
</style>
