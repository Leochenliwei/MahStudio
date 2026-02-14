<template>
  <div class="condition-tree-container">
    <div class="panel-title">
      <span>条件判断 (IF)</span>
      <span style="font-size:var(--font-size-xs); color:var(--color-text-tertiary); font-weight:var(--font-weight-normal);">点击圆点切换 且/或</span>
    </div>
    <div class="scroll-area">
      <div v-if="conditionTree" class="tree-node" :id="`group-${conditionTree.id}`">
        <div class="tree-line"></div>
        <div :class="['logic-btn', conditionTree.logic]" @click="toggleLogic(conditionTree.id)">
          {{ conditionTree.logic === 'and' ? '且' : '或' }}
        </div>
        <div>
          <div 
            v-for="(child, index) in conditionTree.children" 
            :key="`${child.id || index}`"
          >
            <div v-if="child.type === 'rule'" class="rule-item">
              <select 
                class="edit-select" 
                style="width:100px;"
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
                class="edit-select" 
                style="width:60px;"
                v-model="child.op"
                @change="updateRule(child, 'op', child.op)"
              >
                <option value="eq">等于</option>
                <option value="neq">不等于</option>
              </select>
              <select 
                v-if="getComponentOptions(child.field).length > 0" 
                class="edit-select" 
                style="flex:1;"
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
                class="edit-input"
                v-model="child.val"
                @input="updateRule(child, 'val', child.val)"
              >
              <div class="btn-icon" @click="removeNode(conditionTree.id, index)">✕</div>
            </div>
            <div v-else-if="child.type === 'group'" class="sub-group">
              <ConditionTree 
                :condition-tree="child" 
                :all-components="allComponents"
                :depth="depth + 1"
                @update:condition-tree="(updatedTree) => updateSubGroup(child, updatedTree)"
              />
              <div class="btn-icon" style="position:absolute;top:4px;right:4px;" @click="removeNode(conditionTree.id, index)">✕</div>
            </div>
          </div>
        </div>
        <div style="margin-top:8px; display:flex;">
          <div class="btn-add-small" @click="addCondition(conditionTree.id)">+ 条件</div>
          <div v-if="depth < 2" class="btn-add-small" style="margin-left:8px;" @click="addGroup(conditionTree.id)">+ 条件组</div>
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
  }
})

// Emits
const emit = defineEmits(['update:condition-tree'])

// 获取组件的选项列表
function getComponentOptions(componentId) {
  const component = props.allComponents.find(c => c.id === componentId)
  return component?.options || []
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
.condition-tree-container {
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
  padding: 0 var(--spacing-4);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  border-bottom: 1px solid var(--color-border);
  background: var(--color-surface);
  flex-shrink: 0;
}

.scroll-area {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background: #FAFAFA;
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
  background-color: var(--primary);
}

.logic-btn.or {
  background-color: var(--secondary);
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

.sub-group {
  margin-left: 16px;
  margin-top: 8px;
  position: relative;
}

.btn-add-small {
  font-size: var(--font-size-xs);
  padding: 2px var(--spacing-2);
  background: var(--color-surface);
  border: 1px dashed var(--color-border);
  border-radius: var(--border-radius-full);
  color: var(--color-text-tertiary);
  cursor: pointer;
  margin-left: var(--spacing-2);
  transition: all var(--transition-fast);
}

.btn-add-small:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background: var(--color-primary-light);
}

.btn-icon {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-tertiary);
  cursor: pointer;
  transition: color var(--transition-fast);
}

.btn-icon:hover {
  color: var(--color-danger);
}

.edit-select,
.edit-input {
  border: 1px solid var(--color-border);
  background: var(--color-surface-hover);
  border-radius: var(--border-radius-sm);
  padding: var(--spacing-1) var(--spacing-2);
  font-size: var(--font-size-xs);
  height: 28px;
  color: var(--color-text-primary);
  transition: all var(--transition-fast);
}

.edit-select:focus,
.edit-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(100, 108, 255, 0.2);
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
</style>