<template>
  <div class="action-config-container">
    <div class="panel-title">
      <span>执行动作 (THEN)</span>
      <div class="btn-add-small" @click="addAction" style="color:var(--primary); border-color:var(--primary);">+ 新增动作</div>
    </div>
    <div class="scroll-area">
      <div 
        v-for="(action, idx) in targets" 
        :key="idx"
        class="action-edit-card"
      >
        <div class="action-edit-header">
          <span>目标对象</span>
          <span style="color:#999; cursor:pointer;" @click="removeAction(idx)">✕</span>
        </div>
        
        <!-- 两步式目标选择器 -->
        <div class="target-selector-wrapper">
          <!-- 第一步：选择目标类型 -->
          <div class="selector-step">
            <div class="step-label">
              <span class="step-number">1</span>
              <span>选择目标类型</span>
            </div>
            <div class="type-selector">
              <div 
                :class="['type-option', { active: action.level === 'group' }]"
                @click="selectTargetType(idx, 'group')"
              >
                📦 显示组
              </div>
              <div 
                :class="['type-option', { active: action.level === 'comp' }]"
                @click="selectTargetType(idx, 'comp')"
              >
                🧩 元件
              </div>
              <div 
                :class="['type-option', { active: action.level === 'item' }]"
                @click="selectTargetType(idx, 'item')"
              >
                🔹 选项
              </div>
            </div>
          </div>
          
          <!-- 第二步：选择具体对象 -->
          <div class="selector-step">
            <div class="step-label">
              <span class="step-number">2</span>
              <span>选择具体对象</span>
            </div>
            <div :class="['object-selector', { enabled: action.level }]">
              <template v-if="action.level === 'group'">
                <select 
                  class="edit-select" 
                  style="width:100%;"
                  v-model="action.id"
                  @change="selectObject(idx, action.id)"
                >
                  <option 
                    v-for="group in formSchema" 
                    :key="group.id" 
                    :value="group.id"
                  >
                    {{ group.name }}
                  </option>
                </select>
              </template>
              <template v-else-if="action.level === 'comp'">
                <select 
                  class="edit-select" 
                  style="width:100%;"
                  v-model="action.id"
                  @change="selectObject(idx, action.id)"
                >
                  <option 
                    v-for="component in allComponents" 
                    :key="component.id" 
                    :value="component.id"
                  >
                    {{ component.title }}
                  </option>
                </select>
              </template>
              <template v-else-if="action.level === 'item'">
                <div style="display:flex; gap:8px;">
                  <select 
                    class="edit-select" 
                    style="flex:1;"
                    v-model="action.id"
                    @change="selectItemComponent(idx, action.id)"
                  >
                    <option value="">选择元件</option>
                    <option 
                      v-for="component in allComponentsWithOptions" 
                      :key="component.id" 
                      :value="component.id"
                    >
                      {{ component.title }}
                    </option>
                  </select>
                  <select 
                    class="edit-select" 
                    style="flex:1;"
                    v-model="action.targetVal"
                    @change="selectItemOption(idx, action.targetVal)"
                    :disabled="!action.id"
                  >
                    <option value="">选择选项</option>
                    <option 
                      v-for="option in getComponentOptions(action.id)" 
                      :key="option.value" 
                      :value="option.value"
                    >
                      {{ option.label }}
                    </option>
                  </select>
                </div>
              </template>
              <template v-else>
                <select class="edit-select" style="width:100%;" disabled>
                  <option>请先选择目标类型</option>
                </select>
              </template>
            </div>
          </div>
        </div>
        
        <!-- 多属性配置区域 -->
        <div class="props-config">
          <div class="prop-row">
            <div class="prop-label">
              <input 
                type="checkbox" 
                class="prop-checkbox"
                v-model="action.props.visible.enabled"
                @change="toggleProp(idx, 'visible', action.props.visible.enabled)"
              >
              <span>👁️ 可见性</span>
            </div>
            <div class="prop-controls" :style="{ opacity: action.props.visible.enabled ? 1 : 0.4 }">
              <span class="condition-label when">满足时</span>
              <select 
                class="edit-select" 
                style="width:80px;"
                v-model="action.props.visible.when"
                @change="updatePropValue(idx, 'visible', 'when', action.props.visible.when)"
                :disabled="!action.props.visible.enabled"
              >
                <option value="show">显示</option>
                <option value="hide">隐藏</option>
              </select>
              <span class="condition-label else">否则</span>
              <select 
                class="edit-select" 
                style="width:80px;"
                v-model="action.props.visible.else"
                @change="updatePropValue(idx, 'visible', 'else', action.props.visible.else)"
                :disabled="!action.props.visible.enabled"
              >
                <option value="show">显示</option>
                <option value="hide">隐藏</option>
              </select>
            </div>
          </div>
          <div class="prop-row">
            <div class="prop-label">
              <input 
                type="checkbox" 
                class="prop-checkbox"
                v-model="action.props.disabled.enabled"
                @change="toggleProp(idx, 'disabled', action.props.disabled.enabled)"
              >
              <span>🔒 交互性</span>
            </div>
            <div class="prop-controls" :style="{ opacity: action.props.disabled.enabled ? 1 : 0.4 }">
              <span class="condition-label when">满足时</span>
              <select 
                class="edit-select" 
                style="width:80px;"
                v-model="action.props.disabled.when"
                @change="updatePropValue(idx, 'disabled', 'when', action.props.disabled.when)"
                :disabled="!action.props.disabled.enabled"
              >
                <option value="lock">锁定</option>
                <option value="unlock">解锁</option>
              </select>
              <span class="condition-label else">否则</span>
              <select 
                class="edit-select" 
                style="width:80px;"
                v-model="action.props.disabled.else"
                @change="updatePropValue(idx, 'disabled', 'else', action.props.disabled.else)"
                :disabled="!action.props.disabled.enabled"
              >
                <option value="lock">锁定</option>
                <option value="unlock">解锁</option>
              </select>
            </div>
          </div>
          <div class="prop-row">
            <div class="prop-label">
              <input 
                type="checkbox" 
                class="prop-checkbox"
                v-model="action.props.selected.enabled"
                @change="toggleProp(idx, 'selected', action.props.selected.enabled)"
              >
              <span>✅ 选中性</span>
            </div>
            <div class="prop-controls" :style="{ opacity: action.props.selected.enabled ? 1 : 0.4 }">
              <span class="condition-label when">满足时</span>
              <select 
                class="edit-select" 
                style="width:80px;"
                v-model="action.props.selected.when"
                @change="updatePropValue(idx, 'selected', 'when', action.props.selected.when)"
                :disabled="!action.props.selected.enabled"
              >
                <option value="true">选中</option>
                <option value="false">不选中</option>
              </select>
              <span class="condition-label else">否则</span>
              <select 
                class="edit-select" 
                style="width:80px;"
                v-model="action.props.selected.else"
                @change="updatePropValue(idx, 'selected', 'else', action.props.selected.else)"
                :disabled="!action.props.selected.enabled"
              >
                <option value="true">选中</option>
                <option value="false">不选中</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <div v-if="targets.length === 0" class="empty-state">
        请添加动作
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

// Props
const props = defineProps({
  targets: {
    type: Array,
    default: () => []
  },
  formSchema: {
    type: Array,
    default: () => []
  },
  allComponents: {
    type: Array,
    default: () => []
  }
})

// Emits
const emit = defineEmits(['update:targets'])

// 计算所有带有选项的组件
const allComponentsWithOptions = computed(() => {
  return props.allComponents.filter(component => component.options && component.options.length > 0)
})

// 获取组件的选项列表
function getComponentOptions(componentId) {
  const component = props.allComponents.find(c => c.id === componentId)
  return component?.options || []
}

// 添加动作
function addAction() {
  const newAction = {
    props: {
      visible: { enabled: true, when: 'show', else: 'hide' },
      disabled: { enabled: false, when: 'lock', else: 'unlock' },
      selected: { enabled: false, when: 'true', else: 'false' }
    }
  }
  const updatedTargets = [...props.targets, newAction]
  emit('update:targets', updatedTargets)
}

// 移除动作
function removeAction(index) {
  const updatedTargets = props.targets.filter((_, i) => i !== index)
  emit('update:targets', updatedTargets)
}

// 选择目标类型
function selectTargetType(actionIdx, type) {
  const updatedTargets = [...props.targets]
  const action = { ...updatedTargets[actionIdx] }
  
  // 重置目标对象数据
  action.level = type
  delete action.id
  delete action.name
  delete action.parentName
  delete action.targetVal
  
  // 根据类型设置默认值
  if (type === 'group' && props.formSchema.length > 0) {
    action.id = props.formSchema[0].id
    action.name = props.formSchema[0].name
  } else if (type === 'comp' && props.allComponents.length > 0) {
    action.id = props.allComponents[0].id
    action.name = props.allComponents[0].title
  }
  
  updatedTargets[actionIdx] = action
  emit('update:targets', updatedTargets)
}

// 选择具体对象（组或元件）
function selectObject(actionIdx, objectId) {
  const updatedTargets = [...props.targets]
  const action = { ...updatedTargets[actionIdx] }
  action.id = objectId
  
  if (action.level === 'group') {
    const group = props.formSchema.find(g => g.id === objectId)
    action.name = group?.name || ''
  } else if (action.level === 'comp') {
    const component = props.allComponents.find(c => c.id === objectId)
    action.name = component?.title || ''
  }
  
  updatedTargets[actionIdx] = action
  emit('update:targets', updatedTargets)
}

// 选择选项级别的元件
function selectItemComponent(actionIdx, compId) {
  const updatedTargets = [...props.targets]
  const action = { ...updatedTargets[actionIdx] }
  action.id = compId
  
  if (compId) {
    const component = props.allComponents.find(c => c.id === compId)
    action.parentName = component?.title || ''
    // 重置选项值
    delete action.targetVal
    delete action.name
  }
  
  updatedTargets[actionIdx] = action
  emit('update:targets', updatedTargets)
}

// 选择选项级别的具体选项
function selectItemOption(actionIdx, optionValue) {
  const updatedTargets = [...props.targets]
  const action = { ...updatedTargets[actionIdx] }
  action.targetVal = optionValue
  
  if (optionValue && action.id) {
    const component = props.allComponents.find(c => c.id === action.id)
    const option = component?.options?.find(opt => opt.value === optionValue)
    action.name = option?.label || ''
  }
  
  updatedTargets[actionIdx] = action
  emit('update:targets', updatedTargets)
}

// 切换属性启用状态
function toggleProp(actionIdx, propType, enabled) {
  const updatedTargets = [...props.targets]
  const action = { ...updatedTargets[actionIdx] }
  action.props[propType].enabled = enabled
  updatedTargets[actionIdx] = action
  emit('update:targets', updatedTargets)
}

// 更新属性值
function updatePropValue(actionIdx, propType, condition, value) {
  const updatedTargets = [...props.targets]
  const action = { ...updatedTargets[actionIdx] }
  action.props[propType][condition] = value
  updatedTargets[actionIdx] = action
  emit('update:targets', updatedTargets)
}
</script>

<style scoped>
.action-config-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.panel-title {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-main);
  border-bottom: 1px solid #eee;
  background: white;
  flex-shrink: 0;
}

.scroll-area {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background: white;
}

.action-edit-card {
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 12px;
  border-left: 3px solid var(--primary);
  position: relative;
}

.action-edit-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  font-size: 13px;
  font-weight: 600;
}

.target-selector-wrapper {
  margin-bottom: 12px;
}

.selector-step {
  margin-bottom: 8px;
}

.step-label {
  font-size: 11px;
  color: #666;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.step-number {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--primary);
  color: white;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.type-selector {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.type-option {
  flex: 1;
  padding: 6px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  text-align: center;
  cursor: pointer;
  font-size: 11px;
  background: white;
  transition: all 0.2s;
}

.type-option:hover {
  border-color: var(--primary);
}

.type-option.active {
  background: var(--primary-light);
  border-color: var(--primary);
  color: var(--primary);
  font-weight: 500;
}

.object-selector {
  opacity: 0.4;
  transition: opacity 0.2s;
}

.object-selector.enabled {
  opacity: 1;
}

.props-config {
  border: 1px dashed #e0e0e0;
  border-radius: 6px;
  padding: 8px;
  background: #fafafa;
}

.prop-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  padding: 4px 0;
  border-bottom: 1px solid #f0f0f0;
}

.prop-row:last-child {
  margin-bottom: 0;
  border-bottom: none;
}

.prop-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #666;
  min-width: 80px;
}

.prop-checkbox {
  width: 14px;
  height: 14px;
  margin: 0;
}

.prop-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.condition-label {
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 3px;
  min-width: 50px;
  text-align: center;
}

.condition-label.when {
  background: #e6f7ff;
  color: #1890ff;
}

.condition-label.else {
  background: #f5f5f5;
  color: #999;
}

.edit-select, .edit-input {
  border: 1px solid #eee;
  background: #F5F6FA;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 12px;
  height: 28px;
  color: var(--text-main);
}

.btn-add-small {
  font-size: 11px;
  padding: 2px 8px;
  background: white;
  border: 1px dashed #ccc;
  border-radius: 10px;
  color: var(--text-sub);
  cursor: pointer;
  margin-left: 8px;
}

.btn-add-small:hover {
  border-color: var(--primary);
  color: var(--primary);
}

.empty-state {
  padding: 30px;
  text-align: center;
  color: #ccc;
  font-size: 12px;
  background: rgba(255,255,255,0.5);
  border-radius: 8px;
  border: 1px dashed #ddd;
}
</style>