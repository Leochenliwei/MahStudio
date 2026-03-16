<template>
  <div class="condition-tree-container">
    <div v-if="showTitle" class="panel-title">
      <span>条件判断 (IF)</span>
      <span class="panel-hint">点击圆点切换 且/或</span>
    </div>
    <div class="scroll-area">
      <div v-if="conditionTree" class="tree-wrapper">
        <div class="tree-node" :id="`group-${conditionTree.id}`">
          <!-- 垂直连接线 -->
          <div class="tree-line"></div>
          <!-- 逻辑切换按钮 -->
          <div :class="['logic-btn', conditionTree.logic]" @click="toggleLogic(conditionTree.id)">
            {{ conditionTree.logic === 'and' ? '且' : '或' }}
          </div>
          <!-- 子节点容器 -->
          <div class="children-container">
            <div 
              v-for="(child, index) in conditionTree.children" 
              :key="`${child.id || index}`"
              class="child-wrapper"
            >
              <!-- 规则项 -->
              <div v-if="child.type === 'rule'" class="rule-item">
                <select 
                  class="edit-select field-select" 
                  v-model="child.field"
                  @change="updateRule(child, 'field', child.field)"
                  
                >
                  <option 
                    v-for="component in allComponents" 
                    :key="component.id" 
                    :value="component.id"
                  >
                    {{ component.title }}
                  </option>
                </select>
                <select
                  class="edit-select op-select"
                  v-model="child.op"
                  @change="updateRule(child, 'op', child.op)"
                >
                  <option
                    v-for="op in getOperatorsByComponentType(child.field)"
                    :key="op.value"
                    :value="op.value"
                  >
                    {{ op.label }}
                  </option>
                </select>
                <select 
                  v-if="getComponentOptions(child.field).length > 0" 
                  class="edit-select value-select" 
                  v-model="child.val"
                  @change="updateRule(child, 'val', child.val)"
                >
                  <option 
                    v-for="option in getComponentOptions(child.field)" 
                    :key="option.value" 
                    :value="option.value"
                  >
                    {{ option.label }}
                  </option>
                </select>
                <input 
                  v-else 
                  type="text" 
                  class="edit-input value-input"
                  v-model="child.val"
                  @input="updateRule(child, 'val', child.val)"
                  placeholder="输入值"
                >
                <div class="btn-icon delete-btn" @click="removeNode(conditionTree.id, index)">✕</div>
              </div>
              <!-- 子条件组 -->
              <div v-else-if="child.type === 'group'" class="sub-group-wrapper">
                <div class="sub-group">
                  <ConditionTree
                    :condition-tree="child"
                    :all-components="allComponents"
                    :depth="depth + 1"
                    :show-title="false"
                    @update:condition-tree="(updatedTree) => updateSubGroup(child, updatedTree)"
                  />
                  <div class="btn-icon delete-btn sub-group-delete" @click="removeNode(conditionTree.id, index)">✕</div>
                </div>
              </div>
            </div>
          </div>
          <!-- 添加按钮区域 -->
          <div class="add-buttons">
            <div class="btn-add-small" @click="addCondition(conditionTree.id)">+ 条件</div>
            <div v-if="depth < 2" class="btn-add-small" @click="addGroup(conditionTree.id)">+ 条件组</div>
          </div>
        </div>
      </div>
      <div v-else class="empty-state">
        请添加条件
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import ConditionTree from './ConditionTree.vue'

// Props
const props = defineProps({
  conditionTree: {
    type: Object,
    default: null
  },
  allComponents: {
    type: Array,
    default: () => []
  },
  depth: {
    type: Number,
    default: 1
  },
  showTitle: {
    type: Boolean,
    default: true
  }
})

// Emits
const emit = defineEmits(['update:condition-tree'])

// 获取组件的选项列表
function getComponentOptions(componentId) {
  const component = props.allComponents.find(c => c.id === componentId)
  return component?.options || []
}

/**
 * 获取组件类型
 * @param {string} componentId - 组件ID
 * @returns {string} 组件类型
 */
function getComponentType(componentId) {
  const component = props.allComponents.find(c => c.id === componentId)
  return component?.type || 'radio'
}

/**
 * 根据组件类型获取可用的运算符列表
 * @param {string} componentId - 组件ID
 * @returns {Array} 运算符列表
 */
function getOperatorsByComponentType(componentId) {
  const componentType = getComponentType(componentId)
  
  // 定义不同组件类型对应的运算符
  const operatorMap = {
    // 单选类型：等于、不等于
    'radio': [
      { value: 'eq', label: '等于' },
      { value: 'neq', label: '不等于' }
    ],
    // 复选类型：包含、不包含、选中、未选中
    'checkbox': [
      { value: 'contains', label: '包含' },
      { value: 'not_contains', label: '不包含' },
      { value: 'selected', label: '选中' },
      { value: 'unselected', label: '未选中' }
    ],
    // 下拉列表类型：等于、不等于、包含、不包含
    'select': [
      { value: 'eq', label: '等于' },
      { value: 'neq', label: '不等于' },
      { value: 'contains', label: '包含' },
      { value: 'not_contains', label: '不包含' }
    ],
    // 多选下拉类型：同复选
    'select-multiple': [
      { value: 'contains', label: '包含' },
      { value: 'not_contains', label: '不包含' },
      { value: 'selected', label: '选中' },
      { value: 'unselected', label: '未选中' }
    ],
    // 下拉&开关类型：等于、不等于、开启、未开启
    'select-switch': [
      { value: 'eq', label: '等于' },
      { value: 'neq', label: '不等于' },
      { value: 'enabled', label: '开启' },
      { value: 'disabled', label: '未开启' }
    ]
  }
  
  return operatorMap[componentType] || operatorMap['radio']
}

// 切换逻辑运算符
function toggleLogic(groupId) {
  if (props.conditionTree && props.conditionTree.id === groupId) {
    const updatedTree = {
      ...props.conditionTree,
      logic: props.conditionTree.logic === 'and' ? 'or' : 'and'
    }
    emit('update:condition-tree', updatedTree)
  }
}

// 添加条件
function addCondition(groupId) {
  if (props.conditionTree && props.conditionTree.id === groupId) {
    const updatedTree = {
      ...props.conditionTree,
      children: [
        ...props.conditionTree.children,
        {
          type: 'rule',
          id: `r${Date.now()}`,
          field: props.allComponents[0]?.id || '',
          op: 'eq',
          val: ''
        }
      ]
    }
    emit('update:condition-tree', updatedTree)
  }
}

// 添加条件组
function addGroup(groupId) {
  if (props.conditionTree && props.conditionTree.id === groupId) {
    const updatedTree = {
      ...props.conditionTree,
      children: [
        ...props.conditionTree.children,
        {
          type: 'group',
          id: `g${Date.now()}`,
          logic: 'and',
          children: [
            {
              type: 'rule',
              id: `r${Date.now()}`,
              field: props.allComponents[0]?.id || '',
              op: 'eq',
              val: ''
            }
          ]
        }
      ]
    }
    emit('update:condition-tree', updatedTree)
  }
}

// 移除节点
function removeNode(parentId, index) {
  if (props.conditionTree && props.conditionTree.id === parentId) {
    const updatedTree = {
      ...props.conditionTree,
      children: props.conditionTree.children.filter((_, i) => i !== index)
    }
    emit('update:condition-tree', updatedTree)
  }
}

// 更新规则
function updateRule(rule, key, value) {
  // 当字段改变时，检查运算符是否兼容新字段类型
  if (key === 'field') {
    const availableOps = getOperatorsByComponentType(value)
    const availableOpValues = availableOps.map(op => op.value)
    // 如果当前运算符在新字段类型中不可用，重置为第一个可用运算符
    if (!availableOpValues.includes(rule.op)) {
      rule.op = availableOpValues[0] || 'eq'
    }
  }
  // 规则更新通过v-model双向绑定自动处理
  // 这里可以添加额外的逻辑，如果需要
  emit('update:condition-tree', props.conditionTree)
}

// 更新子组
function updateSubGroup(oldGroup, newGroup) {
  if (props.conditionTree) {
    const updatedTree = {
      ...props.conditionTree,
      children: props.conditionTree.children.map(child => 
        child.id === oldGroup.id ? newGroup : child
      )
    }
    emit('update:condition-tree', updatedTree)
  }
}
</script>

<style scoped>
/* 容器样式 */
.condition-tree-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #FAFAFA;
}

/* 面板标题 */
.panel-title {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  font-size: 13px;
  font-weight: 600;
  color: #262626;
  border-bottom: 1px solid #E8E8E8;
  background: #FFFFFF;
  flex-shrink: 0;
}

.panel-hint {
  font-size: 10px;
  color: #8C8C8C;
  font-weight: 400;
}

/* 滚动区域 */
.scroll-area {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background: #FAFAFA;
}

/* 树形结构包装器 */
.tree-wrapper {
  position: relative;
}

/* 树节点 */
.tree-node {
  position: relative;
  padding-left: 24px;
}

/* 垂直连接线 */
.tree-line {
  position: absolute;
  left: 0;
  top: 12px;
  bottom: 40px;
  width: 2px;
  background: #D9D9D9;
  border-radius: 1px;
}

/* 逻辑切换按钮 */
.logic-btn {
  position: absolute;
  left: -11px;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: bold;
  color: white;
  cursor: pointer;
  z-index: 10;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
  transition: all 0.2s ease;
  user-select: none;
}

.logic-btn:hover {
  transform: translateY(-50%) scale(1.1);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
}

.logic-btn.and {
  background-color: #2F54EB;
}

.logic-btn.or {
  background-color: #FA8C16;
}

/* 子节点容器 */
.children-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.child-wrapper {
  position: relative;
}

/* 规则项 */
.rule-item {
  background: #FFFFFF;
  border: 1px solid #E8E8E8;
  padding: 8px;
  display: flex;
  gap: 8px;
  border-radius: 6px;
  font-size: 12px;
  align-items: center;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
  transition: all 0.2s ease;
}

.rule-item:hover {
  border-color: #D9D9D9;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
}

/* 子条件组包装器 */
.sub-group-wrapper {
  margin-top: 4px;
}

/* 子条件组 */
.sub-group {
  position: relative;
  background: #FFFFFF;
  border: 1px solid #E8E8E8;
  border-radius: 8px;
  padding: 12px;
  margin-left: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
}

.sub-group-delete {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.sub-group-delete:hover {
  background: #FFF1F0;
}

/* 添加按钮区域 */
.add-buttons {
  margin-top: 12px;
  display: flex;
  gap: 8px;
  padding-left: 4px;
}

.btn-add-small {
  font-size: 11px;
  padding: 4px 12px;
  background: #FFFFFF;
  border: 1px dashed #D9D9D9;
  border-radius: 12px;
  color: #8C8C8C;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
}

.btn-add-small:hover {
  border-color: #2F54EB;
  color: #2F54EB;
  background: #F0F5FF;
}

/* 删除按钮 */
.btn-icon {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #BFBFBF;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s ease;
  font-size: 12px;
}

.btn-icon:hover {
  color: #FF4D4F;
  background: #FFF1F0;
}

.delete-btn {
  flex-shrink: 0;
}

/* 表单控件 */
.edit-select,
.edit-input {
  border: 1px solid #E8E8E8;
  background: #F5F6FA;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 12px;
  height: 28px;
  color: #262626;
  transition: all 0.2s ease;
  outline: none;
}

.edit-select:hover,
.edit-input:hover {
  border-color: #D9D9D9;
}

.edit-select:focus,
.edit-input:focus {
  border-color: #2F54EB;
  box-shadow: 0 0 0 2px rgba(47, 84, 235, 0.15);
  background: #FFFFFF;
}

.field-select {
  width: 110px;
  flex-shrink: 0;
}

.op-select {
  width: 70px;
  flex-shrink: 0;
}

.value-select,
.value-input {
  flex: 1;
  min-width: 80px;
}

/* 空状态 */
.empty-state {
  padding: 40px 24px;
  text-align: center;
  color: #BFBFBF;
  font-size: 12px;
  background: #FFFFFF;
  border-radius: 8px;
  border: 1px dashed #D9D9D9;
}
</style>
