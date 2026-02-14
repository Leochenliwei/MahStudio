<template>
  <div v-if="isOpen" class="room-creator-container">
    <!-- 顶部导航栏 -->
    <div class="header">
      <button class="back-btn" @click="closePanel">
        <Icon name="arrow-left" size="16" />
        退出编辑
      </button>
      <span style="margin-left: auto;">?</span>
    </div>

    <!-- 主布局 -->
    <div class="main-layout">
      <!-- 左侧侧边栏 -->
      <Sidebar 
        @add-group="addGroup"
        @open-dependency-editor="openDependencyEditor"
      />

      <!-- 中间内容区 -->
      <div class="content-area" ref="canvasRef">
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
      :round-mode="roomConfig.basic.roundCount.mode"
      :editing-component="editingComponent"
      @close-all-drawers="closeAllDrawers"
      @select-player-count-template="selectPlayerCountTemplate"
      @save-player-count-config="savePlayerCountConfig"
      @switch-round-mode="switchRoundMode"
      @select-round-count-template="selectRoundCountTemplate"
      @save-round-count-config="saveRoundCountConfig"
      @add-option="addOption"
      @save-component-config="saveComponentConfig"
      @open-advanced-rules="openAdvancedRules"
    />

    <!-- 依赖编辑器组件 -->
    <DependencyEditor 
      :is-open="showDependencyEditor"
      :rules="roomConfig.dependencies"
      :form-schema="roomConfig.groups"
      @close="showDependencyEditor = false"
      @update:rules="(newRules) => roomConfig.dependencies = newRules"
    />
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Icon from './Icon.vue'
import Sidebar from './Sidebar.vue'
import BasicParams from './BasicParams.vue'
import GroupManager from './GroupManager.vue'
import Drawer from './Drawer.vue'
import DependencyEditor from './DependencyEditor.vue'

// Props
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  gameId: {
    type: [String, Number],
    required: true
  }
})

// Emits
const emit = defineEmits(['update:isOpen', 'config-updated'])

const router = useRouter()

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
const canvasRef = ref(null)

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

const selectedPlayerCountTemplate = ref(0)
const selectedRoundCountTemplate = ref(0)

// 编辑状态
const editingComponent = ref(null)
const editingGroupId = ref(null)

// 依赖编辑器状态
const showDependencyEditor = ref(false)

// 加载配置
function loadConfig() {
  const savedConfig = localStorage.getItem(`roomConfig_${props.gameId}`)
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
    localStorage.setItem(`roomConfig_${props.gameId}`, JSON.stringify(roomConfig.value))
    emit('config-updated', roomConfig.value)
    closePanel()
  } catch (error) {
    console.error('保存配置失败:', error)
  }
}

// 关闭面板
function closePanel() {
  emit('update:isOpen', false)
}

// 添加分组
function addGroup() {
  const newGroup = {
    id: `group_${Date.now()}`,
    name: `分组${roomConfig.value.groups.length + 1}`,
    components: []
  }
  roomConfig.value.groups.push(newGroup)
  // 滚动到底部
  setTimeout(() => {
    if (canvasRef.value) {
      canvasRef.value.scrollTop = canvasRef.value.scrollHeight
    }
  }, 100)
}

// 编辑分组名称
function editGroupName(group) {
  const newName = prompt('请输入分组名称:', group.name)
  if (newName && newName.trim()) {
    group.name = newName.trim()
  }
}

// 添加控件
function addComponent(groupId, type) {
  const group = roomConfig.value.groups.find(g => g.id === groupId)
  if (group) {
    const newComponent = {
      id: `comp_${Date.now()}`,
      type,
      title: `${getComponentTypeText(type)}控件`,
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
    group.components.push(newComponent)
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

// 保存组件配置
function saveComponentConfig() {
  if (editingGroupId.value && editingComponent.value) {
    const group = roomConfig.value.groups.find(g => g.id === editingGroupId.value)
    if (group) {
      const componentIndex = group.components.findIndex(c => c.id === editingComponent.value.id)
      if (componentIndex !== -1) {
        group.components[componentIndex] = { ...editingComponent.value }
      }
    }
    closeAllDrawers()
  }
}

// 打开选项联动编辑器
function openDependencyEditor() {
  showDependencyEditor.value = true
}

// 打开高级规则页面
function openAdvancedRules() {
  router.push({
    path: `/workbench/${props.gameId}/advanced-rules`
  })
  closePanel()
}

// 监听isOpen变化，加载配置
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    loadConfig()
  }
})

// 组件挂载时初始化
onMounted(() => {
  if (props.isOpen) {
    loadConfig()
  }
})
</script>

<style scoped>
.room-creator-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f0f2f5;
  color: #333333;
  font-size: 14px;
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

/* 顶部导航栏 */
.header {
  padding: 0 24px;
  height: 64px;
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  align-items: center;
  font-weight: 600;
  background: #ffffff;
  z-index: 10;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.back-btn {
  cursor: pointer;
  margin-right: 24px;
  font-size: 16px;
  background: none;
  border: none;
  color: #333333;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.back-btn:hover {
  color: #1890ff;
  background: rgba(24, 144, 255, 0.08);
}

/* 主布局 */
.main-layout {
  display: flex;
  width: 100%;
  height: calc(100vh - 64px);
  overflow: hidden;
}

/* 中间内容区 */
.content-area {
  flex: 1;
  padding: 24px;
  background: #f0f2f5;
  overflow-y: auto;
  scroll-behavior: smooth;
}

.content-area::-webkit-scrollbar {
  width: 6px;
}

.content-area::-webkit-scrollbar-track {
  background: #f0f2f5;
}

.content-area::-webkit-scrollbar-thumb {
  background: #e8e8e8;
  border-radius: 3px;
}

.content-area::-webkit-scrollbar-thumb:hover {
  background: #999999;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .main-layout {
    flex-direction: column;
  }
  
  .header {
    padding: 0 16px;
    height: 56px;
  }
  
  .content-area {
    padding: 16px;
  }
}
</style>