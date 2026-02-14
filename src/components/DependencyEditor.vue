<template>
  <div v-if="isOpen" class="dependency-editor-container">

    <!-- 主布局 -->
    <div class="main-layout">
      <!-- 左侧侧边栏 -->
      <div class="sidebar">
        <div class="sidebar-header">
          <span>选项列表</span>
          <span class="refresh-btn" @click="refreshComponents">刷新</span>
        </div>
        <div class="search-box">
          <input type="text" class="search-input" placeholder="搜索元件..." v-model="searchQuery">
        </div>
        <div class="comp-list">
          <div class="comp-item" :class="{ active: activeFilter === 'all' }" @click="setFilter('all')">
            <span>全部规则概览</span>
            <span class="rule-count">{{ rules.length }}</span>
          </div>
          <!-- 分组和元件列表 -->
          <div v-for="group in formSchema" :key="group.id" class="group-section">
            <div class="group-header">{{ group.name }}</div>
            <div v-for="comp in group.components" :key="comp.id" class="comp-item" :class="{ active: activeFilter === comp.id }" @click="setFilter(comp.id)">
              <span>{{ comp.name }}</span>
              <span v-if="getRuleCount(comp.id) > 0" class="rule-count">{{ getRuleCount(comp.id) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧内容区 -->
      <div class="content-area">
        <!-- 仪表盘视图 -->
        <div v-if="viewMode === 'dashboard'" class="dashboard-view">
          <div class="main-header">
            <div class="header-title">{{ headerTitle }}</div>
            <button class="btn-primary" @click="createNew">+ 新建联动</button>
          </div>
          <div class="rules-container">
            <!-- 全部规则概览 -->
            <div v-if="activeFilter === 'all'">
              <div v-for="rule in rules" :key="rule.id" class="summary-card normal" @click="handleCardClick(rule)">
                <div class="card-header">
                  <span class="rule-id">Rule #{{ rule.id }}</span>
                  <div class="badges">
                    <span v-if="rule.targets.length > 1" class="shared-badge">🔗 共享规则</span>
                  </div>
                </div>
                <div class="rule-desc">{{ rule.desc }}</div>
                <div class="action-list">
                  <div v-for="(target, index) in rule.targets" :key="index" class="target-chip" :class="getTargetClass(target)">
                    {{ target.name }}
                    <div class="multi-props">
                      <span v-if="target.props.visible.enabled" class="prop-tag visible">显示</span>
                      <span v-if="target.props.disabled.enabled" class="prop-tag disabled">交互</span>
                      <span v-if="target.props.selected.enabled" class="prop-tag selected">选中</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 按元件筛选 -->
            <div v-else>
              <div class="section-title"><span class="dot primary"></span> 主动控制 (Trigger)</div>
              <div v-if="activeRules.length">
                <div v-for="rule in activeRules" :key="rule.id" class="summary-card trigger" @click="handleCardClick(rule)">
                  <div class="card-header">
                    <span class="rule-id">Rule #{{ rule.id }}</span>
                    <div class="badges">
                      <span class="badge trigger">它触发</span>
                      <span v-if="rule.targets.length > 1" class="shared-badge">🔗 共享规则</span>
                    </div>
                  </div>
                  <div class="rule-desc">{{ rule.desc }}</div>
                  <div class="action-list">
                    <div v-for="(target, index) in rule.targets" :key="index" class="target-chip" :class="getTargetClass(target)">
                      {{ target.name }}
                      <div class="multi-props">
                        <span v-if="target.props.visible.enabled" class="prop-tag visible">显示</span>
                        <span v-if="target.props.disabled.enabled" class="prop-tag disabled">交互</span>
                        <span v-if="target.props.selected.enabled" class="prop-tag selected">选中</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="empty-state">未控制其他对象</div>

              <div class="section-title"><span class="dot secondary"></span> 被动受控 (Target)</div>
              <div v-if="passiveRules.length">
                <div v-for="rule in passiveRules" :key="rule.id" class="summary-card target" @click="handleCardClick(rule)">
                  <div class="card-header">
                    <span class="rule-id">Rule #{{ rule.id }}</span>
                    <div class="badges">
                      <span class="badge target">它受控</span>
                      <span v-if="rule.targets.length > 1" class="shared-badge">🔗 共享规则</span>
                    </div>
                  </div>
                  <div class="rule-desc">{{ rule.desc }}</div>
                  <div class="action-list">
                    <div v-for="(target, index) in rule.targets" :key="index" class="target-chip" :class="[getTargetClass(target), { highlight: target.id === activeFilter }]">
                      {{ target.name }}
                      <div class="multi-props">
                        <span v-if="target.props.visible.enabled" class="prop-tag visible">显示</span>
                        <span v-if="target.props.disabled.enabled" class="prop-tag disabled">交互</span>
                        <span v-if="target.props.selected.enabled" class="prop-tag selected">选中</span>
                      </div>
                    </div>
                    <div v-if="rule.targets.length > 1" class="target-chip tag-others">
                      + 同时也影响其他 {{ rule.targets.length - 1 }} 个对象
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="empty-state">不受其他条件控制</div>
            </div>
          </div>
        </div>


      </div>
    </div>

    <!-- 警告弹窗 -->
    <div v-if="showWarning" class="warning-overlay">
      <div class="warning-box">
        <div class="warning-icon">⚠️</div>
        <h3>共享规则提示</h3>
        <p>此规则同时控制了 <b>{{ currentRule.targets.length }}</b> 个对象。<br>修改将影响全局配置。</p>
        <div class="warning-buttons">
          <button class="btn-text" @click="closeWarning">取消</button>
          <button class="btn-primary" @click="confirmEdit">继续编辑</button>
        </div>
      </div>
    </div>

    <!-- 编辑器弹窗 -->
    <div v-if="showEditorModal" class="editor-modal-overlay">
      <div class="editor-modal">
        <div class="editor-header">
          <button class="btn-text" @click="backToDashboard">← 返回</button>
          <span class="editor-title">{{ currentRule.id > 1000 ? '新建规则' : `编辑规则 #${currentRule.id}` }}</span>
          <button class="btn-primary" @click="saveAndClose">保存规则</button>
        </div>
        <div class="editor-body">
          <!-- 左：条件树 -->
          <div class="panel-conditions">
            <ConditionTree 
              :condition-tree="currentRule.conditionTree"
              :all-components="flatComponents"
              :depth="1"
              @update:condition-tree="(updatedTree) => currentRule.conditionTree = updatedTree"
            />
          </div>

          <!-- 右：动作列表 -->
          <div class="panel-actions">
            <ActionConfig 
              :targets="currentRule.targets"
              :form-schema="formSchema"
              :all-components="flatComponents"
              @update:targets="(updatedTargets) => currentRule.targets = updatedTargets"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import Icon from './Icon.vue'
import ConditionTree from './ConditionTree.vue'
import ActionConfig from './ActionConfig.vue'

// Props
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  rules: {
    type: Array,
    default: () => []
  },
  formSchema: {
    type: Array,
    default: () => []
  }
})

// Emits
const emit = defineEmits(['update:isOpen', 'update:rules', 'back-to-config'])

// 响应式数据
const viewMode = ref('dashboard') // 'dashboard' or 'editor'
const activeFilter = ref('all')
const searchQuery = ref('')
const currentRule = ref(null)
const showWarning = ref(false)
const showEditorModal = ref(false)

// 使用外部传入的数据
const rules = ref(props.rules)
const formSchema = ref(props.formSchema)

// 扁平化元件列表
const flatComponents = computed(() => {
  return formSchema.value.flatMap(g => g.components.map(c => ({...c, groupId: g.id})))
})

// 监听props变化
watch(
  () => props.rules,
  (newRules) => {
    rules.value = newRules
  },
  { deep: true }
)

watch(
  () => props.formSchema,
  (newSchema) => {
    formSchema.value = newSchema
  },
  { deep: true }
)

// 计算属性
const headerTitle = computed(() => {
  if (activeFilter.value === 'all') return '全部规则概览'
  const comp = flatComponents.value.find(c => c.id === activeFilter.value)
  return `元件：${comp.name || '未知元件'}`
})

const activeRules = computed(() => {
  return rules.value.filter(r => r.triggers.includes(activeFilter.value))
})

const passiveRules = computed(() => {
  const currentComp = flatComponents.value.find(c => c.id === activeFilter.value)
  return rules.value.filter(r => r.targets.some(t => t.id === activeFilter.value || (t.level === 'group' && t.id === currentComp.groupId)))
})

// 方法
function closeEditor() {
  emit('back-to-config')
}

function setFilter(id) {
  activeFilter.value = id
}

function getRuleCount(compId) {
  return rules.value.filter(r => r.triggers.includes(compId) || r.targets.some(t => t.id === compId)).length
}

function getTargetClass(target) {
  if (target.level === 'group') return 'level-group'
  if (target.level === 'comp') return 'level-comp'
  if (target.level === 'item') return 'level-item'
  return ''
}

function createNew() {
  // 检查是否有组件
  const firstComponentId = flatComponents.value.length > 0 ? flatComponents.value[0].id : ''
  
  currentRule.value = {
    id: Date.now(),
    triggers: [],
    desc: '新规则 (未保存)',
    conditionTree: { id: 'root', logic: 'and', children: [{ type: 'rule', id: Date.now(), field: firstComponentId, op: 'eq', val: '' }] },
    targets: []
  }
  showEditorModal.value = true
}

function handleCardClick(rule) {
  currentRule.value = JSON.parse(JSON.stringify(rule))
  if (rule.targets.length > 1) {
    showWarning.value = true
  } else {
    showEditorModal.value = true
  }
}

function backToDashboard() {
  showEditorModal.value = false
  currentRule.value = null
}

function saveAndClose() {
  // 更新规则描述
  if (currentRule.value.conditionTree && currentRule.value.conditionTree.children.length > 0) {
    const field = getComponent(currentRule.value.conditionTree.children[0].field)
    const val = currentRule.value.conditionTree.children[0].val
    const opt = field.options?.find(o => o.value === val)
    currentRule.value.desc = `当 [${field.title || field.name}] 等于 '${opt?.label || val}'`
  }
  
  // 更新或添加规则
  const index = rules.value.findIndex(r => r.id === currentRule.value.id)
  if (index >= 0) {
    rules.value[index] = currentRule.value
  } else {
    rules.value.push(currentRule.value)
  }
  
  // 发送更新后的规则回父组件
  emit('update:rules', rules.value)
  
  // 关闭编辑器弹窗
  showEditorModal.value = false
  currentRule.value = null
}

function closeWarning() {
  showWarning.value = false
  currentRule.value = null
}

function confirmEdit() {
  showWarning.value = false
  showEditorModal.value = true
}

function toggleLogic(groupId) {
  if (currentRule.value.conditionTree.id === groupId) {
    currentRule.value.conditionTree.logic = currentRule.value.conditionTree.logic === 'and' ? 'or' : 'and'
  }
}

function addCondition() {
  currentRule.value.conditionTree.children.push({
    type: 'rule',
    id: Date.now(),
    field: flatComponents.value[0].id,
    op: 'eq',
    val: ''
  })
}

function addGroup() {
  // 简化版：只支持一级条件组
  console.log('添加条件组功能开发中')
}

function removeCondition(index) {
  currentRule.value.conditionTree.children.splice(index, 1)
}

function updateRule(index, key, value) {
  // 规则更新逻辑
}

function addAction() {
  currentRule.value.targets.push({
    props: {
      visible: { enabled: true, when: 'show', else: 'hide' },
      disabled: { enabled: false, when: 'lock', else: 'unlock' },
      selected: { enabled: false, when: 'true', else: 'false' }
    }
  })
}

function removeAction(index) {
  currentRule.value.targets.splice(index, 1)
}

function selectTargetType(index, type) {
  const action = currentRule.value.targets[index]
  action.level = type
  
  if (type === 'group' && formSchema.value.length > 0) {
    action.id = formSchema.value[0].id
    action.name = formSchema.value[0].name
  } else if (type === 'comp' && flatComponents.value.length > 0) {
    action.id = flatComponents.value[0].id
    action.name = flatComponents.value[0].name
  }
}

function selectObject(index, objectId) {
  const action = currentRule.value.targets[index]
  action.id = objectId
  
  if (action.level === 'group') {
    const group = formSchema.value.find(g => g.id === objectId)
    action.name = group.name
  } else if (action.level === 'comp') {
    const comp = flatComponents.value.find(c => c.id === objectId)
    action.name = comp.name
  }
}

function selectItemComponent(index, compId) {
  const action = currentRule.value.targets[index]
  action.id = compId
  
  if (compId) {
    const comp = flatComponents.value.find(c => c.id === compId)
    action.parentName = comp.name
    delete action.targetVal
    delete action.name
  }
}

function selectItemOption(index, optionValue) {
  const action = currentRule.value.targets[index]
  action.targetVal = optionValue
  
  if (optionValue && action.id) {
    const comp = flatComponents.value.find(c => c.id === action.id)
    const option = comp.options.find(opt => opt.v === optionValue)
    action.name = option.l
  }
}

function getComponent(compId) {
  const component = flatComponents.value.find(c => c.id === compId)
  if (component) return component
  // 如果找不到组件，返回一个默认值
  return {
    id: '',
    name: '未知元件',
    title: '未知元件',
    options: []
  }
}

function refreshComponents() {
  // 刷新元件列表
}
</script>

<style scoped>
/* 主容器 */
.dependency-editor-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--color-surface);
  color: var(--color-text-primary);
  font-family: var(--font-family);
  overflow: hidden;
  --primary: var(--color-primary);
  --primary-light: rgba(100, 108, 255, 0.1);
  --secondary: var(--color-warning);
  --bg-body: var(--color-background);
  --bg-white: var(--color-surface);
  --text-main: var(--color-text-primary);
  --text-sub: var(--color-text-tertiary);
  --border: var(--color-border);
  --line-color: var(--color-border-light);
  --sidebar-width: 280px;
  
  --level-group-bg: rgba(114, 46, 209, 0.1);
  --level-group-text: #d3adf7;
  --level-group-border: rgba(114, 46, 209, 0.3);
  --level-comp-bg: rgba(24, 144, 255, 0.1);
  --level-comp-text: #91caff;
  --level-comp-border: rgba(24, 144, 255, 0.3);
  --level-item-bg: rgba(19, 194, 194, 0.1);
  --level-item-text: #87e8de;
  --level-item-border: rgba(19, 194, 194, 0.3);
}

/* 顶部导航栏 */
.header {
  padding: 0 24px;
  height: 64px;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  background: var(--bg-white);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
}

.back-btn {
  cursor: pointer;
  margin-right: 24px;
  font-size: 16px;
  background: none;
  border: none;
  color: var(--text-main);
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.back-btn:hover {
  color: var(--primary);
  background: var(--primary-light);
}

.header h2 {
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

/* 主布局 */
.main-layout {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* 左侧侧边栏 */
.sidebar {
  width: var(--sidebar-width);
  background: var(--bg-white);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.sidebar-header {
  height: 50px;
  padding: 0 var(--spacing-4);
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--color-border);
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
}

.refresh-btn {
  font-size: var(--font-size-xs);
  color: var(--color-primary);
  cursor: pointer;
}

.search-box {
  padding: var(--spacing-3);
  border-bottom: 1px solid var(--color-border);
}

.search-input {
  width: 100%;
  padding: var(--spacing-2) var(--spacing-3);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-xs);
  background: var(--color-surface-hover);
  color: var(--color-text-primary);
  transition: all var(--transition-fast);
}

.search-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(100, 108, 255, 0.2);
}

.comp-list {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 20px;
}

/* 分组标题 */
.group-header {
  padding: var(--spacing-3) var(--spacing-4) var(--spacing-1) var(--spacing-4);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  background: var(--color-surface);
  position: sticky;
  top: 0;
  z-index: 5;
}

.group-header::before {
  content:'';
  display:block;
  width:4px;
  height:4px;
  background:#ccc;
  border-radius:50%;
}

/* 元件项 */
.comp-item {
  padding: var(--spacing-2) var(--spacing-4) var(--spacing-2) var(--spacing-7);
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: all var(--transition-fast);
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
  border-left: 3px solid transparent;
}

.comp-item:hover {
  background: var(--color-surface-hover);
}

.comp-item.active {
  background: var(--primary-light);
  border-left-color: var(--color-primary);
  color: var(--color-primary);
  font-weight: var(--font-weight-medium);
}

.rule-count {
  background: var(--color-surface-hover);
  color: var(--color-text-tertiary);
  font-size: var(--font-size-xs);
  padding: 1px var(--spacing-2);
  border-radius: var(--border-radius-full);
  min-width: 20px;
  text-align: center;
  border: 1px solid var(--color-border);
}

.comp-item.active .rule-count {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

/* 右侧内容区 */
.content-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: var(--bg-body);
  overflow: hidden;
}

/* 仪表盘视图 */
.dashboard-view {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.main-header {
  height: 50px;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--bg-white);
  border-bottom: 1px solid var(--border);
  z-index: 5;
}

.header-title {
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-base);
  color: var(--color-text-primary);
}

.btn-primary {
  background: var(--color-primary);
  color: white;
  border: none;
  padding: var(--spacing-2) var(--spacing-4);
  border-radius: var(--border-radius-full);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--transition-normal);
}

.btn-primary:hover {
  background: var(--color-primary-hover);
}

.rules-container {
  flex: 1;
  padding: var(--spacing-5) var(--spacing-6);
  overflow-y: auto;
}

.section-title {
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
  margin: var(--spacing-5) 0 var(--spacing-3) 0;
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  font-weight: var(--font-weight-semibold);
}

.dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
}

.dot.primary {
  background: var(--primary);
}

.dot.secondary {
  background: var(--secondary);
}

/* 规则卡片 */
.summary-card {
  background: var(--bg-white);
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.2);
  border: 1px solid var(--border);
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 12px;
}

.summary-card:hover {
  border-color: var(--primary);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(100,108,255,0.2);
}

.summary-card.trigger {
  border-left: 3px solid var(--primary);
}

.summary-card.target {
  border-left: 3px solid var(--secondary);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.rule-id {
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
}

.badges {
  display: flex;
  align-items: center;
  gap: 8px;
}

.badge {
  font-size: var(--font-size-xs);
  padding: var(--spacing-1) var(--spacing-2);
  border-radius: var(--border-radius-sm);
  font-weight: var(--font-weight-medium);
}

.badge.trigger {
  background: var(--primary-light);
  color: var(--color-primary);
}

.badge.target {
  background: rgba(255, 189, 46, 0.1);
  color: var(--color-warning);
}

.shared-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-1);
  font-size: var(--font-size-xs);
  color: #d46b08;
  background: rgba(255, 189, 46, 0.1);
  padding: var(--spacing-1) var(--spacing-2);
  border-radius: var(--border-radius-sm);
  border: 1px solid rgba(255, 189, 46, 0.3);
}

.rule-desc {
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
  line-height: var(--line-height-normal);
  font-weight: var(--font-weight-medium);
  margin-bottom: var(--spacing-3);
}

/* 动作列表 */
.action-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding-top: 8px;
  border-top: 1px dashed var(--border);
}

.target-chip {
  display: inline-flex;
  align-items: center;
  border-radius: var(--border-radius-sm);
  padding: var(--spacing-1) var(--spacing-2);
  font-size: var(--font-size-xs);
  border: 1px solid transparent;
}

.target-chip.level-group {
  background: var(--level-group-bg);
  color: var(--level-group-text);
  border-color: var(--level-group-border);
}

.target-chip.level-group::before {
  content: '📦';
  margin-right: 4px;
  font-size: 10px;
}

.target-chip.level-comp {
  background: var(--level-comp-bg);
  color: var(--level-comp-text);
  border-color: var(--level-comp-border);
}

.target-chip.level-comp::before {
  content: '🧩';
  margin-right: 4px;
  font-size: 10px;
}

.target-chip.level-item {
  background: var(--level-item-bg);
  color: var(--level-item-text);
  border-color: var(--level-item-border);
}

.target-chip.level-item::before {
  content: '🔹';
  margin-right: 4px;
  font-size: 10px;
}

.target-chip.highlight {
  border-color: var(--primary) !important;
  background: var(--bg-white) !important;
  box-shadow: 0 0 0 1px var(--primary) inset;
}

.target-chip.tag-others {
  background: var(--color-surface-hover);
  color: var(--text-sub);
  border: 1px dashed var(--border);
  cursor: help;
}

.multi-props {
  display: flex;
  gap: 2px;
  margin-left: 4px;
}

.prop-tag {
  font-size: var(--font-size-xs);
  padding: var(--spacing-1) var(--spacing-1);
  border-radius: var(--border-radius-sm);
  font-weight: var(--font-weight-medium);
}

.prop-tag.visible {
  background: rgba(24, 144, 255, 0.2);
  color: #91caff;
}

.prop-tag.disabled {
  background: rgba(250, 140, 22, 0.2);
  color: #ffd591;
}

.prop-tag.selected {
  background: rgba(82, 196, 26, 0.2);
  color: #b7eb8f;
}

.empty-state {
  padding: var(--spacing-8);
  text-align: center;
  color: var(--color-text-tertiary);
  font-size: var(--font-size-xs);
  background: var(--color-surface-hover);
  border-radius: var(--border-radius-lg);
  border: 1px dashed var(--color-border);
}

/* 动画效果 */
.dashboard-view {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* 卡片悬停效果增强 */
.summary-card {
  transition: all 0.3s cubic-bezier(0.2, 0, 0, 1);
}

/* 按钮悬停效果 */
.btn-primary,
.btn-text {
  transition: all 0.3s cubic-bezier(0.2, 0, 0, 1);
}

/* 侧边栏选项悬停效果 */
.comp-item {
  transition: all 0.3s cubic-bezier(0.2, 0, 0, 1);
}

.editor-header {
  height: 50px;
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--spacing-4);
  z-index: 10;
}

.btn-text {
  background: transparent;
  border: none;
  color: var(--color-text-tertiary);
  cursor: pointer;
  font-size: var(--font-size-sm);
  display: flex;
  align-items: center;
  gap: var(--spacing-1);
  padding: var(--spacing-2) var(--spacing-3);
  border-radius: var(--border-radius-sm);
  transition: all var(--transition-normal);
}

.btn-text:hover {
  color: var(--color-primary);
  background: var(--primary-light);
}

.editor-title {
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-sm);
}

.editor-body {
  flex: 1;
  display: flex;
  overflow: hidden;
}

/* 条件面板 */
.panel-conditions {
  flex: 5;
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  background: var(--bg-body);
}

.panel-title {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--spacing-4);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  border-bottom: 1px solid var(--color-border);
  background: var(--color-surface);
}

.hint {
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
  font-weight: var(--font-weight-normal);
}

.scroll-area {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-4);
}

/* 条件树 */
.condition-tree {
  background: var(--color-surface);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-4);
  box-shadow: var(--shadow-sm);
}

.tree-node {
  position: relative;
  padding-left: 24px;
  margin-bottom: 8px;
}

.tree-line {
  position: absolute;
  left: 0;
  top: 12px;
  bottom: 12px;
  width: 2px;
  background: var(--line-color);
}

.logic-btn {
  position: absolute;
  left: -12px;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  color: white;
  cursor: pointer;
  z-index: 10;
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-fast);
}

.logic-btn.and {
  background-color: var(--color-primary);
}

.logic-btn.or {
  background-color: var(--color-warning);
}

.rule-item {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  padding: var(--spacing-2);
  display: flex;
  gap: var(--spacing-2);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-xs);
  align-items: center;
  margin-bottom: var(--spacing-2);
}

.edit-select, .edit-input {
  border: 1px solid var(--color-border);
  background: var(--color-surface-hover);
  border-radius: var(--border-radius-sm);
  padding: var(--spacing-1) var(--spacing-2);
  font-size: var(--font-size-xs);
  height: 28px;
  color: var(--color-text-primary);
  flex: 1;
  transition: all var(--transition-fast);
}

.edit-select:focus, .edit-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(100, 108, 255, 0.2);
}

.btn-icon {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-tertiary);
  cursor: pointer;
  border-radius: var(--border-radius-sm);
  transition: all var(--transition-normal);
}

.btn-icon:hover {
  color: var(--color-danger);
  background: rgba(220, 53, 69, 0.1);
}

.add-buttons {
  margin-top: 8px;
  display: flex;
  gap: 8px;
}

.btn-add-small {
  font-size: var(--font-size-xs);
  padding: var(--spacing-1) var(--spacing-2);
  background: var(--color-surface);
  border: 1px dashed var(--color-border);
  border-radius: var(--border-radius-full);
  color: var(--color-text-tertiary);
  cursor: pointer;
  transition: all var(--transition-normal);
}

.btn-add-small:hover {
  color: var(--color-primary);
  border-color: var(--color-primary);
  background: var(--primary-light);
}

/* 动作编辑卡片 */
.action-edit-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-3);
  margin-bottom: var(--spacing-3);
  border-left: 3px solid var(--color-primary);
  position: relative;
}

.action-edit-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-3);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
}

.remove-btn {
  color: var(--color-text-tertiary);
  cursor: pointer;
  font-size: var(--font-size-sm);
  transition: color var(--transition-normal);
}

.remove-btn:hover {
  color: var(--color-danger);
}

/* 目标选择器 */
.target-selector-wrapper {
  margin-bottom: var(--spacing-3);
}

.selector-step {
  margin-bottom: var(--spacing-2);
}

.step-label {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-1);
  display: flex;
  align-items: center;
  gap: var(--spacing-1);
}

.step-number {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--color-primary);
  color: white;
  font-size: var(--font-size-xs);
  display: flex;
  align-items: center;
  justify-content: center;
}

.type-selector {
  display: flex;
  gap: var(--spacing-2);
  margin-bottom: var(--spacing-2);
}

.type-option {
  flex: 1;
  padding: var(--spacing-2) var(--spacing-2);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-sm);
  text-align: center;
  cursor: pointer;
  font-size: var(--font-size-xs);
  background: var(--color-surface);
  transition: all var(--transition-fast);
}

.type-option:hover {
  border-color: var(--color-primary);
}

.type-option.active {
  background: var(--primary-light);
  border-color: var(--color-primary);
  color: var(--color-primary);
  font-weight: var(--font-weight-medium);
}

.object-selector {
  opacity: 0.4;
  transition: opacity 0.2s;
}

.object-selector.enabled {
  opacity: 1;
}

.item-selector {
  display: flex;
  gap: 8px;
}

/* 属性配置 */
.props-config {
  border: 1px dashed var(--border);
  border-radius: 6px;
  padding: 8px;
  background: var(--color-surface-hover);
}

.prop-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-2);
  padding: var(--spacing-1) 0;
  border-bottom: 1px solid var(--color-border);
}

.prop-row:last-child {
  margin-bottom: 0;
  border-bottom: none;
}

.prop-label {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  min-width: 80px;
}

.prop-checkbox {
  width: 14px;
  height: 14px;
  margin: 0;
  cursor: pointer;
}

.prop-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.condition-label {
  font-size: var(--font-size-xs);
  padding: var(--spacing-1) var(--spacing-2);
  border-radius: var(--border-radius-sm);
  min-width: 50px;
  text-align: center;
}

.condition-label.when {
  background: rgba(24, 144, 255, 0.1);
  color: #91caff;
}

.condition-label.else {
  background: var(--color-surface-hover);
  color: var(--color-text-tertiary);
}

/* 警告弹窗 */
.warning-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(2px);
}

.warning-box {
  background: var(--color-surface);
  width: 320px;
  padding: var(--spacing-6);
  border-radius: var(--border-radius-xl);
  text-align: center;
  box-shadow: var(--shadow-md);
}

/* 编辑器弹窗 */
.editor-modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(2px);
}

.editor-modal {
  background: var(--color-surface);
  width: 90%;
  max-width: 1000px;
  height: 90%;
  max-height: 700px;
  border-radius: var(--border-radius-xl);
  box-shadow: var(--shadow-md);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: modalSlideIn var(--transition-normal) ease-out;
}

@keyframes modalSlideIn {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.warning-icon {
  font-size: 32px;
  margin-bottom: 12px;
}

.warning-box h3 {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
}

.warning-box p {
  font-size: 13px;
  color: #666;
  line-height: 1.5;
  margin-bottom: 24px;
}

.warning-buttons {
  display: flex;
  gap: 10px;
}

.warning-buttons button {
  flex: 1;
  padding: 6px 16px;
  border-radius: 18px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.warning-buttons .btn-text {
  border: 1px solid #eee;
  background: var(--bg-white);
}

.warning-buttons .btn-primary {
  background: var(--primary);
  color: white;
  border: none;
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #f0f2f5;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #e8e8e8;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #999;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .main-layout {
    flex-direction: column;
  }
  
  .sidebar {
    width: 100%;
    height: 200px;
    border-right: none;
    border-bottom: 1px solid var(--border);
  }
  
  .editor-body {
    flex-direction: column;
  }
  
  .panel-conditions {
    border-right: none;
    border-bottom: 1px solid var(--border);
  }
  
  .header {
    padding: 0 16px;
    height: 56px;
  }
  
  .main-header {
    padding: 0 16px;
  }
  
  .rules-container {
    padding: 16px;
  }
}
</style>