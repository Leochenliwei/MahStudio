<template>
  <div class="room-creator-page">
    

    <!-- 顶部Tab栏 -->
    <div class="tab-bar">
      <div class="tab-items">
        <button 
          class="tab-item" 
          :class="{ active: activeTab === 'config' }"
          @click="activeTab = 'config'"
        >
          <Icon name="sliders" size="16" />
          面板选项
        </button>
        <button 
          class="tab-item" 
          :class="{ active: activeTab === 'dependency' }"
          @click="activeTab = 'dependency'"
        >
          <Icon name="link" size="16" />
          选项联动
        </button>
      </div>

    <div class="page-header">
      <div class="header-left">
      </div>
      <div class="header-right">
        <button class="save-btn" @click="saveConfig">
          <Icon name="save" size="16" />
          保存配置
        </button>
      </div>
    </div>
    </div>

    <!-- 主内容区 -->
    <div class="main-content">
      <!-- 配置工具内容 -->
      <div v-if="activeTab === 'config'">
        <!-- 基础参数配置 -->
        <BasicParams 
          :basic-config="roomConfig.basic"
          @update-player-count-default="updatePlayerCountDefault"
          @update-round-count-default="updateRoundCountDefault"
          @update-basic-config="updateBasicConfig"
          @open-drawer="openDrawer"
        />

        <!-- 分组管理 -->
        <GroupManager 
          :groups="roomConfig.groups"
          @edit-group-name="editGroupName"
          @add-component="addComponent"
          @open-drawer="openDrawer"
          @add-group="addGroup"
        />
      </div>

      <!-- 选项联动内容 -->
      <div v-if="activeTab === 'dependency'" class="dependency-content">
        <DependencyEditor 
          :is-open="true"
          :rules="roomConfig.dependencies"
          :form-schema="roomConfig.groups"
          @update:rules="(newRules) => roomConfig.dependencies = newRules"
          @back-to-config="activeTab = 'config'"
        />
      </div>
    </div>

    <!-- 抽屉组件 -->
    <Drawer 
      :active-drawer="activeDrawer"
      :player-count-templates="playerCountTemplates"
      :selected-player-count-template="selectedPlayerCountTemplate"
      :round-count-templates="roundCountTemplates"
      :selected-round-count-template="selectedRoundCountTemplate"
      :base-score-templates="baseScoreTemplates"
      :selected-base-score-template="selectedBaseScoreTemplate"
      :round-mode="roomConfig.basic.roundCount.mode"
      :editing-component="editingComponent"
      @close-all-drawers="closeAllDrawers"
      @select-player-count-template="selectPlayerCountTemplate"
      @save-player-count-config="savePlayerCountConfig"
      @switch-round-mode="switchRoundMode"
      @select-round-count-template="selectRoundCountTemplate"
      @save-round-count-config="saveRoundCountConfig"
      @select-base-score-template="selectBaseScoreTemplate"
      @save-base-score-config="saveBaseScoreConfig"
      @add-option="addOption"
      @remove-option="removeOption"
      @save-component-config="saveComponentConfig"
      @open-advanced-rules="openAdvancedRules"
      @open-component-selector="openComponentSelector"
    />
    
    <!-- 组件选择器抽屉 -->
    <ComponentSelectorDrawer 
      :active="showComponentSelector"
      :components="components"
      @close="closeComponentSelector"
      @confirm-component-selection="confirmComponentSelection"
      @toggle-component-status="toggleComponentStatus"
      @update-component-property="updateComponentProperty"
    />
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Icon from '../components/Icon.vue'
import BasicParams from '../components/BasicParams.vue'
import GroupManager from '../components/GroupManager.vue'
import Drawer from '../components/Drawer.vue'
import ComponentSelectorDrawer from '../components/ComponentSelectorDrawer.vue'
import DependencyEditor from '../components/DependencyEditor.vue'

const router = useRouter()
const route = useRoute()

// 响应式数据
const roomConfig = ref({
  id: '',
  name: '',
  basic: {
    playerCount: {
      options: [4, 3, 2],
      default: 4,
      allowLess: false
    },
    roundCount: {
      mode: 'round',
      options: [4, 8, 16],
      default: 4
    },
    baseScore: 1,
    timeLimits: {
      prepare: 30,
      discard: 20,
      think: 15
    }
  },
  groups: [
    {
      id: 'group_1',
      name: '分组1',
      components: []
    }
  ],
  dependencies: []
})

// 抽屉相关
const activeDrawer = ref('')
const showComponentSelector = ref(false)

// 当前激活的Tab
const activeTab = ref('config')

// 模板数据
const playerCountTemplates = ref([
  { label: '4人/3人/2人，默认值4人', options: [4, 3, 2], default: 4 },
  { label: '3人/2人，默认值3人', options: [3, 2], default: 3 },
  { label: '2人，默认值2人', options: [2], default: 2 }
])

const roundCountTemplates = ref([
  { label: '4/8/16局，默认4局', options: [4, 8, 16], default: 4 },
  { label: '8/16/32局，默认8局', options: [8, 16, 32], default: 8 }
])

const baseScoreTemplates = ref([
  { label: '1/2/3/4/5分，默认1分', options: [1, 2, 3, 4, 5], default: 1 },
  { label: '2/4/6/8/10分，默认2分', options: [2, 4, 6, 8, 10], default: 2 },
  { label: '5/10/15/20分，默认5分', options: [5, 10, 15, 20], default: 5 }
])

const selectedPlayerCountTemplate = ref(0)
const selectedRoundCountTemplate = ref(0)
const selectedBaseScoreTemplate = ref(0)

// 编辑状态
const editingComponent = ref(null)
const editingGroupId = ref(null)

// 组件列表数据
const components = ref([])
const selectedComponentId = ref('')
const selectedOptionIndex = ref(-1)

// 加载组件列表数据
async function loadComponents() {
  try {
    const response = await fetch('/components_list.json')
    const data = await response.json()
    // 为每个组件添加默认图标、启用状态和锁定状态
    components.value = data.components.map(component => ({
      ...component,
      icon: '📦', // 默认图标
      enabled: component.required || false, // 强制开启的组件默认启用
      locked: component.required || false // 强制开启的组件默认锁定
    }))
    return components.value
  } catch (error) {
    console.error('加载组件列表失败:', error)
    return []
  }
}

// 打开组件选择器
function openComponentSelector(optionIndex) {
  selectedOptionIndex.value = optionIndex
  showComponentSelector.value = true
}

// 关闭组件选择器
function closeComponentSelector() {
  showComponentSelector.value = false
  selectedOptionIndex.value = -1
}

// 更新组件属性
function updateComponentProperty(component, propertyId, value) {
  console.log('更新组件属性:', component, propertyId, value)
  // 这里可以添加属性更新的逻辑
}

// 确认组件选择
function confirmComponentSelection(components) {
  // 处理从新组件传来的组件数组
  const selectedComponent = Array.isArray(components) ? components[0] : components
  
  if (editingComponent.value && selectedOptionIndex.value !== -1 && selectedComponent) {
    // 处理组件选择逻辑
    // 将选中的组件关联到当前选项
    const option = editingComponent.value.options[selectedOptionIndex.value]
    if (option) {
      // 为选项添加组件关联
      option.componentId = selectedComponent.id
      option.componentName = selectedComponent.name
      option.componentEnabled = selectedComponent.enabled
      
      // 显示成功提示
      alert(`已为选项 "${option.label}" 关联组件 "${selectedComponent.name}"`)
      
      console.log('选中组件:', selectedComponent)
      console.log('选项索引:', selectedOptionIndex.value)
      console.log('关联结果:', option)
    }
  }
  closeComponentSelector()
}

// 切换组件状态
function toggleComponentStatus(component) {
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
  }
  
  // 切换组件状态
  component.enabled = !component.enabled
}

// 加载配置
function loadConfig() {
  const gameId = route.params.id
  const savedConfig = localStorage.getItem(`roomConfig_${gameId}`)
  if (savedConfig) {
    try {
      roomConfig.value = JSON.parse(savedConfig)
    } catch (error) {
      console.error('加载配置失败:', error)
    }
  }
}

// 保存配置
function saveConfig() {
  try {
    const gameId = route.params.id
    localStorage.setItem(`roomConfig_${gameId}`, JSON.stringify(roomConfig.value))
    alert('配置已保存')
  } catch (error) {
    console.error('保存配置失败:', error)
    alert('保存配置失败')
  }
}

// 返回工作台
function goBack() {
  router.push({ name: 'Workbench', params: { id: route.params.id } })
}

// 添加分组
function addGroup() {
  const newGroup = {
    id: `group_${Date.now()}`,
    name: `分组${roomConfig.value.groups.length + 1}`,
    components: []
  }
  roomConfig.value.groups.push(newGroup)
}

// 编辑分组名称
function editGroupName(group) {
  const newName = prompt('请输入分组名称:', group.name)
  if (newName && newName.trim()) {
    group.name = newName.trim()
  }
}

/**
 * 生成4位UUID
 * @returns {string} 4位随机字符串
 */
function generate4DigitUUID() {
  return Math.random().toString(16).substr(2, 4);
}

// 添加控件
function addComponent(groupId, type) {
  const group = roomConfig.value.groups.find(g => g.id === groupId)
  if (group) {
    const newComponent = {
      id: `comp_${Date.now()}`,
      type,
      title: generate4DigitUUID(),
      options: [
        {
          label: '选项1',
          value: '1',
          isDefault: true
        },
        {
          label: '选项2',
          value: '2',
          isDefault: false
        }
      ],
      required: false,
      disabled: false
    }
    // 保存编辑中的组件和分组ID
    editingComponent.value = newComponent
    editingGroupId.value = groupId
    // 打开组件配置抽屉
    activeDrawer.value = 'drawer-props'
  }
}

// 获取控件类型文本
function getComponentTypeText(type) {
  const typeMap = {
    'radio': '单选',
    'checkbox': '复选',
    'select': '下拉列表',
    'select-switch': '下拉&开关'
  }
  return typeMap[type] || type
}

// 打开抽屉
function openDrawer(drawerId, groupId = null, componentId = null) {
  activeDrawer.value = drawerId
  
  if (drawerId === 'drawer-props' && groupId && componentId) {
    const group = roomConfig.value.groups.find(g => g.id === groupId)
    if (group) {
      const component = group.components.find(c => c.id === componentId)
      if (component) {
        editingComponent.value = JSON.parse(JSON.stringify(component))
        editingGroupId.value = groupId
      }
    }
  }
}

// 关闭所有抽屉
function closeAllDrawers() {
  activeDrawer.value = ''
  editingComponent.value = null
  editingGroupId.value = null
}

// 更新人数默认值
function updatePlayerCountDefault(option) {
  roomConfig.value.basic.playerCount.default = option
}

// 更新局数默认值
function updateRoundCountDefault(option) {
  roomConfig.value.basic.roundCount.default = option
}

// 更新基础配置
function updateBasicConfig() {
  // 基础配置已通过v-model双向绑定更新
}

// 选择人数模板
function selectPlayerCountTemplate(index) {
  selectedPlayerCountTemplate.value = index
}

// 保存人数配置
function savePlayerCountConfig() {
  const template = playerCountTemplates.value[selectedPlayerCountTemplate.value]
  if (template) {
    roomConfig.value.basic.playerCount.options = template.options
    roomConfig.value.basic.playerCount.default = template.default
  }
  closeAllDrawers()
}

// 切换局数模式
function switchRoundMode(mode) {
  roomConfig.value.basic.roundCount.mode = mode
}

// 选择局数模板
function selectRoundCountTemplate(index) {
  selectedRoundCountTemplate.value = index
}

// 保存局数配置
function saveRoundCountConfig() {
  const template = roundCountTemplates.value[selectedRoundCountTemplate.value]
  if (template) {
    roomConfig.value.basic.roundCount.options = template.options
    roomConfig.value.basic.roundCount.default = template.default
  }
  closeAllDrawers()
}

// 选择底分模板
function selectBaseScoreTemplate(index) {
  selectedBaseScoreTemplate.value = index
}

// 保存底分配置
function saveBaseScoreConfig() {
  const template = baseScoreTemplates.value[selectedBaseScoreTemplate.value]
  if (template) {
    roomConfig.value.basic.baseScore = template.default
  }
  closeAllDrawers()
}

// 添加选项
function addOption() {
  if (editingComponent.value) {
    editingComponent.value.options.push({
      label: `选项${editingComponent.value.options.length + 1}`,
      value: `${editingComponent.value.options.length + 1}`,
      isDefault: false
    })
  }
}

// 删除选项
function removeOption(index) {
  if (editingComponent.value && editingComponent.value.options.length > 1) {
    editingComponent.value.options.splice(index, 1)
  }
}

// 保存组件配置
function saveComponentConfig() {
  if (editingGroupId.value && editingComponent.value) {
    const group = roomConfig.value.groups.find(g => g.id === editingGroupId.value)
    if (group) {
      const componentIndex = group.components.findIndex(c => c.id === editingComponent.value.id)
      if (componentIndex !== -1) {
        // 更新现有组件
        group.components[componentIndex] = { ...editingComponent.value }
      } else {
        // 添加新组件
        group.components.push({ ...editingComponent.value })
      }
    }
    closeAllDrawers()
  }
}

// 打开高级规则页面
function openAdvancedRules() {
  router.push({
    path: `/workbench/${route.params.id}/advanced-rules`
  })
}

// 打开选项联动编辑器
function openDependencyEditor() {
  alert('选项联动功能开发中')
}

// 组件挂载时初始化
onMounted(async () => {
  loadConfig()
  await loadComponents()
})
</script>

<style scoped>
.room-creator-page {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--color-background);
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
  overflow: hidden;
  font-family: var(--font-family);
}

/* 顶部导航栏 */
.page-header {
  padding: 0 var(--spacing-6);
  height: 64px;
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: var(--font-weight-semibold);
  background: var(--color-surface);
  box-shadow: var(--shadow-sm);
  z-index: 10;
}

.header-left {
  display: flex;
  align-items: center;
  gap: var(--spacing-6);
}

.back-btn {
  cursor: pointer;
  font-size: var(--font-size-base);
  background: none;
  border: none;
  color: var(--color-text-primary);
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-2) var(--spacing-3);
  border-radius: var(--border-radius-md);
  transition: all var(--transition-normal);
}

.back-btn:hover {
  color: var(--color-primary);
  background: rgba(100, 108, 255, 0.1);
}

.header-right {
  display: flex;
  align-items: center;
}

.save-btn {
  cursor: pointer;
  font-size: var(--font-size-sm);
  background: var(--color-primary);
  color: var(--color-text-primary);
  border: 1px solid var(--color-primary);
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-2) var(--spacing-4);
  border-radius: var(--border-radius-md);
  transition: all var(--transition-normal);
  font-weight: var(--font-weight-medium);
}

.save-btn:hover {
  background: var(--color-primary-hover);
  border-color: var(--color-primary-hover);
  box-shadow: var(--shadow-md);
}

/* 顶部Tab栏 */
.tab-bar {
  padding: 0 var(--spacing-6);
  height: 48px;
  border-bottom: 1px solid var(--color-border);
  background: var(--color-surface);
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: var(--shadow-sm);
  z-index: 5;
}

.tab-items {
  display: flex;
  align-items: center;
  gap: var(--spacing-4);
}

.tab-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
}

.action-btn {
  cursor: pointer;
  font-size: var(--font-size-sm);
  background: var(--color-surface-hover);
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  gap: var(--spacing-1);
  padding: var(--spacing-1) var(--spacing-3);
  border-radius: var(--border-radius-md);
  transition: all var(--transition-normal);
  font-weight: var(--font-weight-medium);
}

.action-btn:hover {
  color: var(--color-primary);
  border-color: var(--color-primary);
  background: rgba(100, 108, 255, 0.1);
}

.tab-item {
  cursor: pointer;
  font-size: var(--font-size-sm);
  background: none;
  border: none;
  color: var(--color-text-secondary);
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-2) var(--spacing-4);
  border-radius: var(--border-radius-md);
  transition: all var(--transition-normal);
  font-weight: var(--font-weight-medium);
  position: relative;
}

.tab-item:hover {
  color: var(--color-primary);
  background: rgba(100, 108, 255, 0.1);
}

.tab-item.active {
  color: var(--color-primary);
  background: rgba(100, 108, 255, 0.1);
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: var(--spacing-4);
  right: var(--spacing-4);
  height: 2px;
  background: var(--color-primary);
  border-radius: var(--border-radius-full);
}

/* 主内容区 */
.main-content {
  flex: 1;
  padding: var(--spacing-6);
  background: var(--color-background);
  /* 网格背景 */
  background-image: 
    linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
  background-size: 20px 20px;
  overflow-y: auto;
  scroll-behavior: smooth;
}

.main-content::-webkit-scrollbar {
  width: 6px;
}

.main-content::-webkit-scrollbar-track {
  background: var(--color-background);
}

.main-content::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: var(--border-radius-full);
}

.main-content::-webkit-scrollbar-thumb:hover {
  background: var(--color-text-tertiary);
}

/* 选项联动内容样式 */
.content-card {
  background: var(--color-surface);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  margin-bottom: var(--spacing-6);
  border: 1px solid var(--color-border);
}

.card-header {
  padding: var(--spacing-4) var(--spacing-6);
  border-bottom: 1px solid var(--color-border);
  background: var(--color-surface);
}

.card-header h3 {
  margin: 0 0 var(--spacing-1) 0;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.card-desc {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--color-text-tertiary);
}

.card-body {
  padding: var(--spacing-6);
  background: var(--color-surface);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-8) var(--spacing-4);
  text-align: center;
}

.empty-icon {
  color: var(--color-primary);
  margin-bottom: var(--spacing-6);
  opacity: 0.6;
}

.empty-state p {
  margin: 0 0 var(--spacing-2) 0;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

.empty-desc {
  font-size: var(--font-size-sm) !important;
  color: var(--color-text-tertiary) !important;
}

/* 依赖内容区域 */
.dependency-content {
  height: calc(100vh - 160px);
  width: 100%;
  overflow: hidden;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .page-header {
    padding: 0 var(--spacing-4);
    height: 56px;
  }
  
  .header-left {
    gap: var(--spacing-4);
  }
  
  .page-title {
    font-size: var(--font-size-base);
  }
  
  .back-btn {
    font-size: var(--font-size-sm);
  }
  
  .save-btn {
    font-size: var(--font-size-sm);
    padding: var(--spacing-1) var(--spacing-3);
  }
  
  .tab-bar {
    padding: 0 var(--spacing-4);
    height: 44px;
  }
  
  .tab-item {
    font-size: var(--font-size-sm);
    padding: var(--spacing-1) var(--spacing-3);
  }
  
  .main-content {
    padding: var(--spacing-4);
  }
}
</style>