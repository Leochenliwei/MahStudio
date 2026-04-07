<template>
  <div class="simple-dependency-page" :class="{ embedded: embedded }">
    <!-- 顶部导航栏 - 非嵌入模式显示 -->
    <div v-if="!embedded" class="page-header">
      <div class="header-left">
        <button class="back-btn" @click="goBack">
          <el-icon :size="16"><ArrowLeft /></el-icon>
          返回
        </button>
        <span class="page-title">选项联动（简版）</span>
      </div>
      <div class="header-right">
        <button class="add-btn" @click="openAdvancedEditor">
          <el-icon :size="16"><Plus /></el-icon>
          新增联动规则
        </button>
      </div>
    </div>

    <!-- 嵌入模式标题栏 -->
    <div v-if="embedded" class="embedded-header">
     
      <button class="add-btn" @click="openAdvancedEditor">
        <el-icon :size="16"><Plus /></el-icon>
        新增规则
      </button>
    </div>

    <!-- 主内容区 -->
    <div class="main-content">
      <!-- 规则列表表格 -->
      <div class="table-container">
        <table class="rules-table">
          <thead>
            <tr>
              <th class="col-id">ID</th>
              <th class="col-desc">规则说明</th>
              <th class="col-create-info">创建信息</th>
              <th class="col-edit-info">编辑信息</th>
              <th class="col-ops">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="rule in rules" :key="rule.id" class="table-row" :class="{ disabled: rule.disabled }">
              <td class="col-id">#{{ rule.id }}</td>
              <td class="col-desc">{{ rule.description || '-' }}</td>
              <td class="col-create-info">{{ rule.createInfo || '-' }}</td>
              <td class="col-edit-info">{{ rule.editInfo || '-' }}</td>
              <td class="col-ops">
                <div class="ops-buttons">
                  <button class="op-btn edit" @click="openEditRuleEditor(rule)" title="编辑">
                    <el-icon :size="14"><Edit /></el-icon>
                  </button>
                  
                  <button class="op-btn delete" @click="confirmDelete(rule)" title="删除">
                    <el-icon :size="14"><Delete /></el-icon>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="rules.length === 0" class="empty-row">
              <td colspan="5" class="empty-cell">
                <div class="empty-state">
                  <el-icon :size="48"><Box /></el-icon>
                  <p>暂无联动规则</p>
                  <span class="empty-desc">点击右上角"新增规则"按钮创建第一条规则</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 删除确认弹窗 -->
    <div v-if="showDeleteConfirm" class="modal-overlay" @click.self="cancelDelete">
      <div class="modal-container small">
        <div class="modal-header">
          <h3>确认删除</h3>
          <button class="close-btn" @click="cancelDelete">
            <el-icon :size="18"><Close /></el-icon>
          </button>
        </div>
        <div class="modal-body">
          <p class="confirm-text">确定要删除规则 #{{ deleteTarget?.id }} 吗？此操作不可撤销。</p>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" @click="cancelDelete">取消</button>
          <button class="btn-danger" @click="executeDelete">删除</button>
        </div>
      </div>
    </div>

    <!-- 规则编辑器弹窗 -->
    <RuleEditorModalPro
      v-model="showRuleEditor"
      :is-editing="isEditingRule"
      :form-schema="formSchema"
      :rule-data="editingRuleData"
      @save="handleSaveRule"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElNotification } from 'element-plus'
import { ArrowLeft, Plus, Edit, VideoPlay, VideoPause, Delete, Box, Close } from '@element-plus/icons-vue'
import RuleEditorModalPro from '../components/RuleEditorModalPro.vue'

// Props
const props = defineProps({
  embedded: {
    type: Boolean,
    default: false
  },
  gameId: {
    type: String,
    default: ''
  },
  // 表单结构数据，支持从父组件传入
  // 需求关联: 支持外部传入表单结构
  formSchema: {
    type: Array,
    default: () => []
  }
})

// Emits
const emit = defineEmits(['back', 'open-advanced-editor'])

const router = useRouter()
const route = useRoute()

// 游戏ID - 优先使用props传入的值
const gameId = computed(() => props.gameId || route.params.id)

// 规则数据
const rules = ref([])

// 表单数据结构（本地状态）
// 优先使用 props.formSchema，否则从 localStorage 加载
const formSchema = ref([])

// 删除确认状态
const showDeleteConfirm = ref(false)
const deleteTarget = ref(null)

// 规则编辑器弹窗状态
const showRuleEditor = ref(false)
const isEditingRule = ref(false)
const editingRuleData = ref(null)

/**
 * 获取触发组件的选项列表
 * @param {string} componentId - 组件ID
 * @returns {Array} 选项列表
 */
function getTriggerOptions(componentId) {
  if (!componentId) return []
  for (const group of formSchema.value) {
    const comp = group.components.find(c => c.id === componentId)
    if (comp && comp.options) {
      return comp.options
    }
  }
  return []
}

/**
 * 获取触发条件描述
 * @param {Object} rule - 规则对象
 * @returns {string} 描述文本
 */
function getTriggerDesc(rule) {
  if (!rule.conditionTree || !rule.conditionTree.children || rule.conditionTree.children.length === 0) {
    return '未配置'
  }
  const condition = rule.conditionTree.children[0]
  const comp = getComponentById(condition.field)
  const compName = comp ? (comp.name || comp.title) : '未知组件'
  const opt = comp && comp.options ? comp.options.find(o => o.value === condition.val) : null
  const optLabel = opt ? opt.label : condition.val
  return `当 [${compName}] 等于 "${optLabel}"`
}

/**
 * 获取目标组件名称列表
 * @param {Object} rule - 规则对象
 * @returns {string} 名称列表
 */
function getTargetNames(rule) {
  if (!rule.targets || rule.targets.length === 0) {
    return '未配置'
  }
  return rule.targets.map(t => t.name || '未知').join('、')
}

/**
 * 获取动作类型列表
 * @param {Object} rule - 规则对象
 * @returns {Array} 动作类型数组
 */
function getActionTypes(rule) {
  const actions = []
  if (!rule.targets || rule.targets.length === 0) return actions

  rule.targets.forEach(target => {
    if (target.props) {
      if (target.props.visible && target.props.visible.enabled) {
        actions.push({ type: 'visible', label: '显示' })
      }
      if (target.props.disabled && target.props.disabled.enabled) {
        actions.push({ type: 'disabled', label: '交互' })
      }
      if (target.props.selected && target.props.selected.enabled) {
        actions.push({ type: 'selected', label: '选中' })
      }
    }
  })
  return actions
}

/**
 * 根据ID获取组件
 * @param {string} compId - 组件ID
 * @returns {Object|null} 组件对象
 */
function getComponentById(compId) {
  for (const group of formSchema.value) {
    const comp = group.components.find(c => c.id === compId)
    if (comp) return comp
  }
  return null
}

/**
 * 加载配置数据
 * 需求关联: 数据同步功能
 * 修改说明: 优先使用 props.formSchema，如果未传入则从 localStorage 加载
 */
function loadConfig() {
  // 如果 props.formSchema 有数据，直接使用它
  if (props.formSchema && props.formSchema.length > 0) {
    formSchema.value = props.formSchema
    // 从 localStorage 加载规则数据
    const savedConfig = localStorage.getItem(`roomConfig_${gameId.value}`)
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig)
        rules.value = config.dependencies || []
      } catch (error) {
        console.error('加载规则配置失败:', error)
        rules.value = []
      }
    }
    return
  }

  // 回退到从 localStorage 加载完整配置
  const savedConfig = localStorage.getItem(`roomConfig_${gameId.value}`)
  if (savedConfig) {
    try {
      const config = JSON.parse(savedConfig)
      rules.value = config.dependencies || []
      formSchema.value = config.groups || []
    } catch (error) {
      console.error('加载配置失败:', error)
      rules.value = []
      formSchema.value = []
    }
  }
}

/**
 * 保存配置数据
 * 需求关联: 数据同步功能
 */
function saveConfig() {
  const savedConfig = localStorage.getItem(`roomConfig_${gameId.value}`)
  if (savedConfig) {
    try {
      const config = JSON.parse(savedConfig)
      config.dependencies = rules.value
      localStorage.setItem(`roomConfig_${gameId.value}`, JSON.stringify(config))
      return true
    } catch (error) {
      console.error('保存配置失败:', error)
      return false
    }
  }
  return false
}

/**
 * 返回高阶编辑器
 * 需求关联: 返回高阶页面功能
 */
function goBack() {
  if (props.embedded) {
    emit('back')
  } else {
    router.push({
      path: `/room-creator/${gameId.value}`
    })
  }
}

/**
 * 打开规则编辑器弹窗（新增）
 * 需求关联: 使用 RuleEditorModal 新增规则
 */
function openAdvancedEditor() {
  isEditingRule.value = false
  editingRuleData.value = null
  showRuleEditor.value = true
}

/**
 * 打开规则编辑器弹窗（编辑）
 * 需求关联: 使用 RuleEditorModal 编辑规则
 * @param {Object} rule - 要编辑的规则
 */
function openEditRuleEditor(rule) {
  isEditingRule.value = true
  editingRuleData.value = rule
  showRuleEditor.value = true
}

/**
 * 关闭规则编辑器弹窗
 */
function closeRuleEditor() {
  showRuleEditor.value = false
  isEditingRule.value = false
  editingRuleData.value = null
}

/**
 * 保存规则（来自 RuleEditorModal）
 * @param {Object} rule - 规则数据
 */
function handleSaveRule(rule) {
  // 更新或添加规则
  if (isEditingRule.value && editingRuleData.value) {
    const index = rules.value.findIndex(r => r.id === editingRuleData.value.id)
    if (index !== -1) {
      rules.value[index] = rule
    }
  } else {
    rules.value.push(rule)
  }

  // 保存到 localStorage
  const savedConfig = localStorage.getItem(`roomConfig_${gameId.value}`)
  if (savedConfig) {
    try {
      const config = JSON.parse(savedConfig)
      config.dependencies = rules.value
      localStorage.setItem(`roomConfig_${gameId.value}`, JSON.stringify(config))
      ElNotification({
        title: '成功',
        message: isEditingRule.value ? '规则已更新' : '规则已创建',
        type: 'success',
        duration: 3000
      })
    } catch (error) {
      console.error('保存配置失败:', error)
    }
  }
}

/**
 * 确认删除规则
 * 需求关联: 删除规则功能
 * @param {Object} rule - 要删除的规则
 */
function confirmDelete(rule) {
  deleteTarget.value = rule
  showDeleteConfirm.value = true
}

/**
 * 取消删除
 */
function cancelDelete() {
  showDeleteConfirm.value = false
  deleteTarget.value = null
}

/**
 * 执行删除
 * 需求关联: 删除规则功能
 */
function executeDelete() {
  if (deleteTarget.value) {
    const index = rules.value.findIndex(r => r.id === deleteTarget.value.id)
    if (index !== -1) {
      rules.value.splice(index, 1)
      if (saveConfig()) {
        ElNotification({
          title: '成功',
          message: '规则已删除',
          type: 'success',
          duration: 3000
        })
      }
    }
  }
  cancelDelete()
}

/**
 * 切换规则启用/禁用状态
 * 需求关联: 禁用/启用规则功能
 * @param {Object} rule - 要切换状态的规则
 */
function toggleRuleStatus(rule) {
  const index = rules.value.findIndex(r => r.id === rule.id)
  if (index !== -1) {
    rules.value[index].disabled = !rules.value[index].disabled
    if (saveConfig()) {
      ElNotification({
        title: '成功',
        message: rules.value[index].disabled ? '规则已禁用' : '规则已启用',
        type: 'success',
        duration: 3000
      })
    }
  }
}

// 监听 props.formSchema 变化，当外部传入的表单结构变化时更新本地状态
// 需求关联: 支持外部表单结构动态更新
watch(() => props.formSchema, (newSchema) => {
  if (newSchema && newSchema.length > 0) {
    formSchema.value = newSchema
  }
}, { deep: true })

// 组件挂载时加载数据
onMounted(() => {
  loadConfig()
})
</script>

<style scoped>
.simple-dependency-page {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--color-background);
  color: var(--color-text-primary);
  font-family: var(--font-family);
  overflow: hidden;
}

/* 顶部导航栏 */
.page-header {
  padding: 0 var(--spacing-6);
  height: 64px;
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--color-surface);
  box-shadow: var(--shadow-sm);
  z-index: 10;
}

.header-left {
  display: flex;
  align-items: center;
  gap: var(--spacing-4);
}

.back-btn {
  cursor: pointer;
  font-size: var(--font-size-sm);
  background: none;
  border: none;
  color: var(--color-text-secondary);
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-2) var(--spacing-3);
  border-radius: var(--border-radius-md);
  transition: all var(--transition-normal);
}

.back-btn:hover {
  color: var(--color-primary);
  background: rgba(59, 130, 246, 0.1);
}

.page-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.header-right {
  display: flex;
  align-items: center;
}

.add-btn {
  cursor: pointer;
  font-size: var(--font-size-sm);
  background: var(--color-primary);
  color: white;
  border: none;
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-2) var(--spacing-4);
  border-radius: var(--border-radius-md);
  transition: all var(--transition-normal);
  font-weight: var(--font-weight-medium);
}

.add-btn:hover {
  background: var(--color-primary-hover);
  box-shadow: var(--shadow-md);
}

/* 主内容区 */
.main-content {
  flex: 1;
  padding: var(--spacing-6);
  background: var(--color-background);
  overflow-y: auto;
}

/* 表格容器 */
.table-container {
  background: var(--color-surface);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-border);
  overflow: hidden;
}

/* 规则表格 */
.rules-table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--font-size-sm);
}

.rules-table th {
  background: var(--color-surface-hover);
  padding: var(--spacing-3) var(--spacing-4);
  text-align: left;
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-secondary);
  border-bottom: 1px solid var(--color-border);
  white-space: nowrap;
}

.rules-table td {
  padding: var(--spacing-3) var(--spacing-4);
  border-bottom: 1px solid var(--color-border);
  color: var(--color-text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.table-row:hover {
  background: var(--color-surface-hover);
}

.table-row:nth-child(even) {
  background: rgba(0, 0, 0, 0.02);
}

.table-row:nth-child(even):hover {
  background: var(--color-surface-hover);
}

/* 列宽设置 */
.col-id {
  width: 100px;
  white-space: nowrap;
}

.col-desc {
  min-width: 200px;
  max-width: 300px;
}

.col-create-info {
  min-width: 120px;
  width: 150px;
}

.col-edit-info {
  min-width: 120px;
  width: 150px;
}

.col-ops {
  width: 120px;
  text-align: center;
}

/* 禁用状态 */
.table-row.disabled {
  opacity: 0.6;
  background: var(--color-surface-hover);
}

.table-row.disabled td {
  color: var(--color-text-tertiary);
}

/* 动作标签 */
.action-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-1);
}

.action-tag {
  font-size: var(--font-size-xs);
  padding: var(--spacing-1) var(--spacing-2);
  border-radius: var(--border-radius-sm);
  font-weight: var(--font-weight-medium);
}

.action-tag.visible {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.action-tag.disabled {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.action-tag.selected {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

/* 操作按钮 */
.ops-buttons {
  display: flex;
  justify-content: center;
  gap: var(--spacing-2);
}

.op-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  border-radius: var(--border-radius-md);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-normal);
  color: var(--color-text-secondary);
  padding: 0;
  flex-shrink: 0;
}

.op-btn:hover {
  background: var(--color-surface-hover);
}

.op-btn.edit:hover {
  color: var(--color-primary);
  background: rgba(59, 130, 246, 0.1);
}

.op-btn.delete:hover {
  color: var(--color-danger);
  background: rgba(239, 68, 68, 0.1);
}

/* 启用/禁用按钮 - 规则启用状态（点击可禁用） */
.op-btn.toggle:hover {
  color: var(--color-warning);
  background: rgba(245, 158, 11, 0.1);
}

/* 启用/禁用按钮 - 规则禁用状态（点击可启用） */
.op-btn.toggle.is-disabled:hover {
  color: var(--color-success);
  background: rgba(16, 185, 129, 0.1);
}

/* 空状态 */
.empty-row {
  background: transparent !important;
}

.empty-cell {
  padding: var(--spacing-12) var(--spacing-4) !important;
  text-align: center;
  border-bottom: none !important;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--color-text-tertiary);
}

.empty-state :deep(.el-icon) {
  color: var(--color-text-tertiary);
  margin-bottom: var(--spacing-4);
  opacity: 0.5;
}

.empty-state p {
  margin: 0 0 var(--spacing-2) 0;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
}

.empty-desc {
  font-size: var(--font-size-sm);
  color: var(--color-text-tertiary);
}

/* 弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(2px);
}

.modal-container {
  background: var(--color-surface);
  border-radius: var(--border-radius-xl);
  box-shadow: var(--shadow-lg);
  width: 90%;
  max-width: 560px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-container.small {
  max-width: 400px;
}

.modal-header {
  padding: var(--spacing-4) var(--spacing-6);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-header h3 {
  margin: 0;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.close-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  border-radius: var(--border-radius-md);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-tertiary);
  transition: all var(--transition-normal);
}

.close-btn:hover {
  background: var(--color-surface-hover);
  color: var(--color-text-secondary);
}

.modal-body {
  flex: 1;
  padding: var(--spacing-4) var(--spacing-6);
  overflow-y: auto;
}

.modal-footer {
  padding: var(--spacing-4) var(--spacing-6);
  border-top: 1px solid var(--color-border);
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-3);
}

/* 表单样式 */
.form-section {
  margin-bottom: var(--spacing-6);
}

.form-section:last-child {
  margin-bottom: 0;
}

.form-section h4 {
  margin: 0 0 var(--spacing-3) 0;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  padding-bottom: var(--spacing-2);
  border-bottom: 1px solid var(--color-border);
}

.form-row {
  margin-bottom: var(--spacing-4);
}

.form-row:last-child {
  margin-bottom: 0;
}

.form-row label {
  display: block;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-2);
}

.form-row.inline {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  flex-wrap: wrap;
}

.form-row.inline label {
  margin-bottom: 0;
  min-width: 80px;
}

.form-select {
  width: 100%;
  padding: var(--spacing-2) var(--spacing-3);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
  background: var(--color-surface);
  color: var(--color-text-primary);
  transition: all var(--transition-fast);
}

.form-select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

.form-select.small {
  width: auto;
  min-width: 100px;
}

.form-select:disabled {
  background: var(--color-surface-hover);
  color: var(--color-text-tertiary);
  cursor: not-allowed;
}

.config-separator {
  font-size: var(--font-size-sm);
  color: var(--color-text-tertiary);
}

/* 复选框组 */
.action-checkboxes {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-4);
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  cursor: pointer;
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
}

.checkbox-item input[type="checkbox"] {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

/* 动作配置区域 */
.action-config {
  margin-top: var(--spacing-3);
  padding: var(--spacing-3);
  background: var(--color-surface-hover);
  border-radius: var(--border-radius-md);
  border: 1px dashed var(--color-border);
}

/* 按钮样式 */
.btn-primary {
  background: var(--color-primary);
  color: white;
  border: none;
  padding: var(--spacing-2) var(--spacing-4);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--transition-normal);
}

.btn-primary:hover {
  background: var(--color-primary-hover);
}

.btn-secondary {
  background: var(--color-surface);
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border);
  padding: var(--spacing-2) var(--spacing-4);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--transition-normal);
}

.btn-secondary:hover {
  background: var(--color-surface-hover);
  border-color: var(--color-text-tertiary);
}

.btn-danger {
  background: var(--color-danger);
  color: white;
  border: none;
  padding: var(--spacing-2) var(--spacing-4);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--transition-normal);
}

.btn-danger:hover {
  background: #dc2626;
}

/* 确认文本 */
.confirm-text {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
  line-height: 1.6;
}

/* 响应式调整 */
/* 嵌入模式样式 */
.simple-dependency-page.embedded {
  height: 100%;
  width: 100%;
  overflow: hidden;
}

.embedded-header {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: var(--spacing-3) var(--spacing-4);
  border-bottom: 1px solid #e5e7eb;
  background: #ffffff;
  flex-shrink: 0;
}

.simple-dependency-page.embedded .main-content {
  height: calc(100% - 52px);
  padding: var(--spacing-4);
  overflow-y: auto;
}

/* 嵌入模式表格样式优化 */
.simple-dependency-page.embedded .table-container {
  width: 100%;
  max-width: 100%;
  overflow-x: auto;
}

.simple-dependency-page.embedded .rules-table {
  width: 100%;
  table-layout: fixed;
}

/* 嵌入模式下调整列宽 */
.simple-dependency-page.embedded .col-id {
  width: 80px;
}

.simple-dependency-page.embedded .col-desc {
  width: auto;
  min-width: 150px;
}

.simple-dependency-page.embedded .col-create-info,
.simple-dependency-page.embedded .col-edit-info {
  width: 120px;
  min-width: 100px;
}

.simple-dependency-page.embedded .col-ops {
  width: 100px;
}

@media (max-width: 768px) {
  .page-header {
    padding: 0 var(--spacing-4);
    height: 56px;
  }

  .page-title {
    font-size: var(--font-size-base);
  }

  .main-content {
    padding: var(--spacing-4);
  }

  .rules-table {
    font-size: var(--font-size-xs);
  }

  .rules-table th,
  .rules-table td {
    padding: var(--spacing-2) var(--spacing-3);
  }

  .col-trigger {
    min-width: 120px;
  }

  .modal-container {
    width: 95%;
    max-height: 95vh;
  }

  .modal-header,
  .modal-body,
  .modal-footer {
    padding-left: var(--spacing-4);
    padding-right: var(--spacing-4);
  }

  .embedded-header {
    padding: var(--spacing-3) var(--spacing-4);
  }
}
</style>
