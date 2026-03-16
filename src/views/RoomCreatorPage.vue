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
          <el-icon :size="16"><Operation /></el-icon>
          面板选项
        </button>
        <button
          class="tab-item"
          :class="{ active: activeTab === 'simple-dependency' }"
          @click="activeTab = 'simple-dependency'"
        >
          <el-icon :size="16"><Grid /></el-icon>
          选项联动（简版P0）
        </button>
        <button
          class="tab-item"
          :class="{ active: activeTab === 'dependency' }"
          @click="activeTab = 'dependency'"
        >
          <el-icon :size="16"><Link /></el-icon>
          选项联动（高阶等迭代）
        </button>
        
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
          @edit-group="handleEditGroup"
          @add-component="addComponent"
          @open-drawer="openDrawer"
          @show-add-group-modal="openCreateGroupModal"
          @update:group-description="updateGroupDescription"
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

      <!-- 简版选项联动内容 -->
      <div v-if="activeTab === 'simple-dependency'" class="simple-dependency-content">
        <SimpleDependencyPage
          :embedded="true"
          :game-id="route.params.id"
          :form-schema="roomConfig.groups"
          @back="activeTab = 'config'"
          @open-advanced-editor="activeTab = 'dependency'"
        />
      </div>
    </div>

    <!-- 基础创房面板抽屉 -->
    <BasicParamsDrawer
      :active-drawer="activeDrawer"
      :player-count-templates="playerCountTemplates"
      :selected-player-count-template="selectedPlayerCountTemplate"
      :round-count-templates="roundCountTemplates"
      :circle-count-templates="circleCountTemplates"
      :selected-round-count-template="selectedRoundCountTemplate"
      :base-score-templates="baseScoreTemplates"
      :selected-base-score-template="selectedBaseScoreTemplate"
      :round-mode="roomConfig.basic.roundCount.mode"
      :allow-less="roomConfig.basic.playerCount.allowLess"
      @close="closeAllDrawers"
      @select-player-count-template="selectPlayerCountTemplate"
      @save-player-count-config="savePlayerCountConfig"
      @switch-round-mode="switchRoundMode"
      @select-round-count-template="selectRoundCountTemplate"
      @save-round-count-config="saveRoundCountConfig"
      @select-base-score-template="selectBaseScoreTemplate"
      @save-base-score-config="saveBaseScoreConfig"
      @toggle-allow-less="toggleAllowLess"
    />

    <!-- 选项配置抽屉 -->
    <Drawer
      :active-drawer="activeDrawer"
      :editing-component="editingComponent"
      :show-component-selector="showComponentSelector"
      :components="components"
      :editing-option-index="selectedOptionIndex"
      @close-all-drawers="closeAllDrawers"
      @add-option="addOption"
      @remove-option="removeOption"
      @save-component-config="saveComponentConfig"
      @open-advanced-rules="openAdvancedRules"
      @open-component-selector="openComponentSelector"
      @close-component-selector="closeComponentSelector"
      @confirm-component-selection="confirmComponentSelection"
      @toggle-component-status="toggleComponentStatus"
      @update-component-property="updateComponentProperty"
    />

    <!-- 添加分组弹窗 -->
    <AddGroupModal
      v-model:visible="showAddGroupModal"
      :mode="groupModalMode"
      :group-data="editingGroupData"
      @confirm="handleGroupModalConfirm"
    />
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElNotification } from 'element-plus'
import { Operation, Grid, Link, CircleCheck } from '@element-plus/icons-vue'
import BasicParams from '../components/BasicParams.vue'
import GroupManager from '../components/GroupManager.vue'
import BasicParamsDrawer from '../components/BasicParamsDrawer.vue'
import Drawer from '../components/Drawer.vue'
import DependencyEditor from '../components/DependencyEditor.vue'
import SimpleDependencyPage from './SimpleDependencyPage.vue'
import AddGroupModal from '../components/AddGroupModal.vue'

const router = useRouter()
const route = useRoute()

/**
 * 默认麻将创房面板配置数据
 * 包含局数、人数、玩法选项、点杠规则、算杠规则、点炮规则、胡牌规则、特殊规则和番型配置
 */
const defaultRoomConfig = {
  id: '',
  name: '',
  basic: {
    playerCount: {
      options: [4, 3, 2],
      default: 2,
      allowLess: false,
      allowLessStart: false
    },
    roundCount: {
      mode: 'round',
      options: [4, 8, 16],
      default: 8
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
      id: 'group_options',
      name: '选项',
      columns: 4,
      components: [
        {
          id: 'comp_options_type',
          type: 'radio',
          title: '选项类型',
          options: [
            { label: '经典选项', value: 'classic', isDefault: false },
            { label: '更多选项', value: 'more', isDefault: true }
          ],
          required: false,
          disabled: false
        }
      ]
    },
    {
      id: 'group_play_method',
      name: '玩法',
      columns: 4,
      components: [
        {
          id: 'comp_play_method',
          type: 'radio',
          title: '玩法选择',
          options: [
            { label: '常规玩法', value: 'normal', isDefault: true },
            { label: '风耗子', value: 'wind_joker', isDefault: false, help: '风牌作为万能牌' },
            { label: '随机耗子', value: 'random_joker', isDefault: false, help: '随机确定万能牌' },
            { label: '抓双耗子', value: 'double_joker', isDefault: false, help: '抓取两张万能牌' }
          ],
          required: false,
          disabled: false
        }
      ]
    },
    {
      id: 'group_dealer_options',
      name: '选项',
      columns: 4,
      components: [
        {
          id: 'comp_dealer_settings',
          type: 'checkbox',
          title: '庄家设置',
          options: [
            { label: '带庄', value: 'with_dealer', isDefault: false },
            { label: '自摸庄分翻倍', value: 'self_draw_double', isDefault: false, help: '自摸时庄家分数翻倍计算' },
            { label: '跟庄', value: 'follow_dealer', isDefault: false, help: '跟随庄家规则' },
            { label: '风嘴子', value: 'wind_bonus', isDefault: false, help: '风牌额外计分' },
            { label: '风嘴子算分', value: 'wind_score', isDefault: false, help: '风嘴子分数计算方式' },
            { label: '轮庄', value: 'rotate_dealer', isDefault: false }
          ],
          required: false,
          disabled: false
        }
      ]
    },
    {
      id: 'group_kong_call',
      name: '点杠',
      columns: 4,
      components: [
        {
          id: 'comp_kong_call',
          type: 'radio',
          title: '点杠规则',
          options: [
            { label: '听前杠包杠', value: 'before_listen', isDefault: true, help: '听牌前杠牌需要包杠' },
            { label: '点杠包杠', value: 'call_kong', isDefault: false, help: '点杠者包杠' },
            { label: '点杠不包杠', value: 'no_call_kong', isDefault: false, help: '点杠者不包杠' }
          ],
          required: false,
          disabled: false
        }
      ]
    },
    {
      id: 'group_kong_score',
      name: '算杠',
      columns: 4,
      components: [
        {
          id: 'comp_kong_score',
          type: 'radio',
          title: '算杠规则',
          options: [
            { label: '杠出即有', value: 'kong_immediate', isDefault: true },
            { label: '杠随胡走', value: 'kong_with_win', isDefault: false, help: '杠分随胡牌结算' },
            { label: '听牌保杠', value: 'listen_protect', isDefault: false, help: '听牌后保护杠分' }
          ],
          required: false,
          disabled: false
        }
      ]
    },
    {
      id: 'group_win_call',
      name: '点炮',
      columns: 4,
      components: [
        {
          id: 'comp_win_call',
          type: 'radio',
          title: '点炮规则',
          options: [
            { label: '听前点炮包胡', value: 'before_listen_win', isDefault: true },
            { label: '点炮包胡包杠', value: 'call_win_kong', isDefault: false, help: '点炮者包胡包杠' },
            { label: '点炮包胡家杠', value: 'call_win_dealer_kong', isDefault: false, help: '点炮者包胡和庄家杠' },
            { label: '听前点炮包胡包杠', value: 'before_listen_all', isDefault: false, help: '听牌前点炮包胡包杠' }
          ],
          required: false,
          disabled: false
        }
      ]
    },
    {
      id: 'group_win_limit',
      name: '胡牌',
      columns: 4,
      components: [
        {
          id: 'comp_win_limit',
          type: 'checkbox',
          title: '胡牌限制',
          options: [
            { label: '123点不可胡', value: 'no_123', isDefault: false, help: '123点数时不能胡牌' },
            { label: '1234点不可胡', value: 'no_1234', isDefault: false, help: '1234点数时不能胡牌' },
            { label: '小于6点可胡', value: 'less_6', isDefault: false, help: '小于6点可以胡牌' },
            { label: '有胡必胡', value: 'must_win', isDefault: false },
            { label: '过胡需自摸', value: 'pass_self_draw', isDefault: false, help: '过胡后只能自摸' }
          ],
          required: false,
          disabled: false
        }
      ]
    },
    {
      id: 'group_rules',
      name: '规则',
      columns: 4,
      components: [
        {
          id: 'comp_special_rules',
          type: 'checkbox',
          title: '特殊规则',
          options: [
            { label: '明报', value: 'open_call', isDefault: false, help: '公开报牌' },
            { label: '绝张不能听', value: 'no_last_listen', isDefault: false, help: '绝张牌不能听' },
            { label: '七墩荒庄', value: 'seven_empty', isDefault: false, help: '七墩牌后荒庄' },
            { label: '缺一门', value: 'missing_suit', isDefault: false },
            { label: '不带风', value: 'no_wind', isDefault: false },
            { label: '摔三张', value: 'throw_three', isDefault: false, help: '开局摔三张牌' },
            { label: '豪七必须胡绝张', value: 'seven_must_last', isDefault: false, help: '豪华七对必须胡绝张' }
          ],
          required: false,
          disabled: false
        }
      ]
    },
    {
      id: 'group_fan_type',
      name: '番型',
      columns: 4,
      components: [
        {
          id: 'comp_fan_calc',
          type: 'radio',
          title: '番型计算',
          options: [
            { label: '翻倍', value: 'double', isDefault: true, help: '番型分数翻倍计算' },
            { label: '加点', value: 'add_point', isDefault: false, help: '番型分数加点计算' },
            { label: '不翻倍加点', value: 'no_double_add', isDefault: false, help: '不翻倍只加点' }
          ],
          required: false,
          disabled: false
        },
        {
          id: 'comp_fan_types',
          type: 'select-multiple',
          title: '番型列表',
          options: [
            { label: '碰碰胡', value: 'pengpeng', isDefault: false, multiplier: 2 },
            { label: '七对', value: 'seven_pairs', isDefault: true, multiplier: 2 },
            { label: '豪华七对', value: 'luxury_seven', isDefault: true, multiplier: 4 },
            { label: '十三幺', value: 'thirteen_orphans', isDefault: true, multiplier: 4 },
            { label: '一条龙', value: 'pure_straight', isDefault: true, multiplier: 2 },
            { label: '清一色', value: 'full_flush', isDefault: true, multiplier: 2 },
            { label: '风一色', value: 'wind_flush', isDefault: true, multiplier: 2 }
          ],
          required: false,
          disabled: false
        }
      ]
    }
  ],
  dependencies: []
}

// 响应式数据
const roomConfig = ref(JSON.parse(JSON.stringify(defaultRoomConfig)))

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

// 打局模式模板
const roundCountTemplates = ref([
  { label: '4/8/16局，默认4局', options: [4, 8, 16], default: 4 },
  { label: '8/16/32局，默认8局', options: [8, 16, 32], default: 8 }
])

// 打圈模式模板
const circleCountTemplates = ref([
  { label: '1/2/4圈，默认1圈', options: [1, 2, 4], default: 1 },
  { label: '2/4/8圈，默认2圈', options: [2, 4, 8], default: 2 }
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

// 添加分组弹窗显示状态
const showAddGroupModal = ref(false)
// 弹窗模式：'create' | 'edit'
const groupModalMode = ref('create')
// 当前编辑的分组
const editingGroupData = ref(null)

// 组件列表数据
const components = ref([])
const selectedComponentId = ref('')
const selectedOptionIndex = ref(-1)

// 加载组件列表数据
async function loadComponents() {
  try {
    const response = await fetch('/MahStudio/components_list.json')
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

/**
 * 确认组件选择
 * @param {Array} components - 选中的组件数组
 */
function confirmComponentSelection(components) {
  // 确保 components 是数组
  const selectedComponents = Array.isArray(components) ? components : [components]
  
  if (editingComponent.value && selectedOptionIndex.value !== -1 && selectedComponents.length > 0) {
    // 将选中的组件关联到当前选项
    const option = editingComponent.value.options[selectedOptionIndex.value]
    if (option) {
      // 为选项添加组件关联（支持多组件）
      option.selectedComponents = selectedComponents
      option.componentIds = selectedComponents.map(c => c.id)
      option.componentNames = selectedComponents.map(c => c.name)
      
      // 兼容单组件的旧字段
      option.componentId = selectedComponents[0].id
      option.componentName = selectedComponents[0].name
      option.componentEnabled = selectedComponents[0].enabled
      
      // 显示成功提示
      const componentNames = selectedComponents.map(c => c.name).join('、')
      ElNotification({
        title: '成功',
        message: `已为选项 "${option.label}" 关联 ${selectedComponents.length} 个组件：${componentNames}`,
        type: 'success',
        duration: 3000
      })
      
      console.log('选中组件:', selectedComponents)
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
      ElNotification({
        title: '警告',
        message: '该组件已经启用，不能重复启用！',
        type: 'warning',
        duration: 3000
      })
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
      // 加载失败时使用默认配置
      resetToDefaultConfig()
    }
  } else {
    // 没有保存的配置时使用默认 mock 数据
    resetToDefaultConfig()
  }
}

/**
 * 重置为默认 mock 配置
 * 将当前配置恢复为默认的麻将创房面板配置
 */
function resetToDefaultConfig() {
  roomConfig.value = JSON.parse(JSON.stringify(defaultRoomConfig))
  ElNotification({
    title: '提示',
    message: '已加载默认创房配置',
    type: 'info',
    duration: 2000
  })
}

// 保存配置
function saveConfig() {
  try {
    const gameId = route.params.id
    localStorage.setItem(`roomConfig_${gameId}`, JSON.stringify(roomConfig.value))
    ElNotification({
      title: '成功',
      message: '配置已保存',
      type: 'success',
      duration: 3000
    })
  } catch (error) {
    console.error('保存配置失败:', error)
    ElNotification({
      title: '错误',
      message: '保存配置失败',
      type: 'error',
      duration: 3000
    })
  }
}

// 返回工作台
function goBack() {
  router.push({ name: 'Workbench', params: { id: route.params.id } })
}

/**
 * 打开创建分组弹窗
 * 关联需求：分组管理 - 创建新分组
 */
function openCreateGroupModal() {
  groupModalMode.value = 'create'
  editingGroupData.value = null
  showAddGroupModal.value = true
}

/**
 * 处理编辑分组
 * @param {Object} group - 分组对象
 * 关联需求：分组管理 - 编辑分组
 */
function handleEditGroup(group) {
  groupModalMode.value = 'edit'
  editingGroupData.value = group
  showAddGroupModal.value = true
}

/**
 * 处理分组弹窗确认
 * @param {Object} data - 弹窗返回数据
 * @param {string} data.mode - 'create' | 'edit'
 * @param {string} data.groupId - 编辑时的分组ID
 * @param {string} data.name - 分组名称
 * @param {number} data.columns - 列数
 * @param {string} data.description - 说明
 */
function handleGroupModalConfirm(data) {
  if (data.mode === 'create') {
    // 创建新分组
    const newGroup = {
      id: `group_${Date.now()}`,
      name: data.name,
      columns: data.columns,
      description: data.description,
      components: []
    }
    roomConfig.value.groups.push(newGroup)

    ElNotification({
      title: '成功',
      message: `分组 "${data.name}" 创建成功`,
      type: 'success',
      duration: 2000
    })
  } else if (data.mode === 'edit' && data.groupId) {
    // 编辑现有分组
    const group = roomConfig.value.groups.find(g => g.id === data.groupId)
    if (group) {
      group.name = data.name
      group.columns = data.columns
      group.description = data.description

      ElNotification({
        title: '成功',
        message: `分组 "${data.name}" 修改成功`,
        type: 'success',
        duration: 2000
      })
    }
  }
}

/**
 * 更新分组分列数
 * @param {string} groupId - 分组ID
 * @param {number} columns - 分列数
 */
function updateGroupColumns(groupId, columns) {
  const group = roomConfig.value.groups.find(g => g.id === groupId)
  if (group) {
    group.columns = columns
  }
}

/**
 * 更新分组说明
 * @param {string} groupId - 分组ID
 * @param {string} description - 分组说明
 * 关联需求：分组管理 - 更新分组说明
 */
function updateGroupDescription(groupId, description) {
  const group = roomConfig.value.groups.find(g => g.id === groupId)
  if (group) {
    group.description = description
    ElNotification({
      title: '成功',
      message: '分组说明已更新',
      type: 'success',
      duration: 1500
    })
  }
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

// 切换允许少人开局
function toggleAllowLess(value) {
  roomConfig.value.basic.playerCount.allowLess = value
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
  ElNotification({
    title: '信息',
    message: '选项联动功能开发中',
    type: 'info',
    duration: 3000
  })
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

/* 简版选项联动内容区域 */
.simple-dependency-content {
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
