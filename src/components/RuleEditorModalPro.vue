<template>
  <div v-if="show" class="editor-modal-overlay">
    <div class="editor-modal">
      <!-- 弹窗头部 -->
      <div class="modal-header">
        <div class="header-left">
          <button class="btn-back" @click="handleClose">
            <span class="back-arrow">←</span>
            <span>返回</span>
          </button>
        </div>
        <h3 class="modal-title">{{ isEditing ? '编辑规则' : '新建规则' }}</h3>
        <div class="header-right">
          <button class="btn-save" @click="handleSave">保存规则</button>
        </div>
      </div>

      <!-- 规则说明区域 -->
      <div class="rule-description-section">
        <input
          type="text"
          class="rule-description-input"
          v-model="localRule.description"
          placeholder="请输入规则说明，用于描述此联动规则的作用..."
        >
      </div>

      <!-- 弹窗内容 -->
      <div class="modal-content">
        <div class="split-layout">
          <!-- 左：条件树 -->
          <div class="panel-conditions">
            <ConditionTree
              v-model:condition-tree="localRule.conditionTree"
              :all-components="flatComponents"
            />
          </div>

          <!-- 右：动作列表 -->
          <div class="panel-actions">
            <ActionConfig
              v-model:targets="localRule.targets"
              v-model:tooltip="localRule.tooltip"
              :form-schema="formSchema"
              :all-components="flatComponents"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { ElMessageBox } from 'element-plus'
import ConditionTree from './ConditionTree.vue'
import ActionConfig from './ActionConfig.vue'

// Props
const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  isEditing: {
    type: Boolean,
    default: false
  },
  formSchema: {
    type: Array,
    default: () => []
  },
  ruleData: {
    type: Object,
    default: () => null
  }
})

// Emits
const emit = defineEmits(['close', 'save'])

// 本地规则数据
const localRule = ref({
  id: null,
  conditionTree: null,
  targets: [],
  tooltip: '',
  description: ''
})

// 计算所有组件列表
const flatComponents = computed(() => {
  const components = []
  props.formSchema.forEach(group => {
    if (group.components && Array.isArray(group.components)) {
      group.components.forEach(comp => {
        components.push({
          ...comp,
          groupId: group.id,
          groupName: group.name
        })
      })
    }
  })
  return components
})

// 监听 ruleData 变化，更新本地数据
watch(() => props.ruleData, (newVal) => {
  if (newVal) {
    localRule.value = {
      id: newVal.id || Date.now(),
      conditionTree: newVal.conditionTree || createDefaultConditionTree(),
      targets: newVal.targets || [],
      tooltip: newVal.tooltip || '',
      description: newVal.description || ''
    }
  } else {
    // 新建规则时的默认值
    localRule.value = {
      id: Date.now(),
      conditionTree: createDefaultConditionTree(),
      targets: [],
      tooltip: '',
      description: ''
    }
  }
}, { immediate: true, deep: true })

// 创建默认条件树
function createDefaultConditionTree() {
  const firstComponentId = flatComponents.value.length > 0 ? flatComponents.value[0].id : ''
  return {
    id: 'root',
    logic: 'and',
    children: [
      {
        type: 'rule',
        id: `r${Date.now()}`,
        field: firstComponentId,
        op: 'eq',
        val: ''
      }
    ]
  }
}

// 关闭弹窗
function handleClose() {
  emit('close')
}

// 保存规则
async function handleSave() {
  // 验证条件树
  if (!localRule.value.conditionTree || !localRule.value.conditionTree.children || localRule.value.conditionTree.children.length === 0) {
    await ElMessageBox.alert('请至少添加一个条件', '提示', {
      confirmButtonText: '确定',
      type: 'warning'
    })
    return
  }

  // 验证动作
  if (!localRule.value.targets || localRule.value.targets.length === 0) {
    await ElMessageBox.alert('请至少添加一个动作', '提示', {
      confirmButtonText: '确定',
      type: 'warning'
    })
    return
  }

  // 获取当前时间和用户信息
  const now = new Date()
  const currentTime = now.toLocaleString('zh-CN')
  const currentUser = '当前用户' // 可以从登录状态或本地存储中获取实际用户名

  // 构建保存的数据
  const ruleToSave = { ...localRule.value }

  // 如果是新建规则，添加创建信息
  if (!props.isEditing) {
    ruleToSave.createTime = currentTime
    ruleToSave.createUser = currentUser
  }

  // 更新编辑信息
  ruleToSave.editTime = currentTime
  ruleToSave.editUser = currentUser

  // 更新列表显示信息
  ruleToSave.createInfo = `${ruleToSave.createUser || currentUser} ${ruleToSave.createTime || currentTime}`
  ruleToSave.editInfo = `${currentUser} ${currentTime}`

  emit('save', ruleToSave)
}
</script>

<style scoped>
/* 弹窗遮罩 */
.editor-modal-overlay {
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
}

/* 弹窗容器 */
.editor-modal {
  width: 90vw;
  height: 85vh;
  background: white;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

/* 弹窗头部 */
.modal-header {
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  border-bottom: 1px solid #e8e8e8;
  background: #fafafa;
  flex-shrink: 0;
}

.header-left,
.header-right {
  flex: 1;
  display: flex;
  align-items: center;
}

.header-right {
  justify-content: flex-end;
}

.modal-title {
  font-size: 16px;
  font-weight: 600;
  color: #262626;
  margin: 0;
}

/* 返回按钮 */
.btn-back {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border: none;
  background: transparent;
  color: #595959;
  font-size: 14px;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s;
}

.btn-back:hover {
  background: #f0f0f0;
  color: #262626;
}

.back-arrow {
  font-size: 16px;
}

/* 保存按钮 */
.btn-save {
  padding: 8px 20px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-save:hover {
  background: #2563eb;
}

.btn-save:active {
  background: #1d4ed8;
}

/* 规则说明区域 */
.rule-description-section {
  padding: 12px 20px;
  background: #f8f9fa;
  border-bottom: 1px solid #e8e8e8;
  flex-shrink: 0;
}

.rule-description-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d0d0d0;
  border-radius: 6px;
  font-size: 13px;
  background: white;
  color: #262626;
  transition: all 0.2s;
}

.rule-description-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

.rule-description-input::placeholder {
  color: #999;
}

/* 弹窗内容 */
.modal-content {
  flex: 1;
  overflow: hidden;
  padding: 16px;
}

/* 左右分栏布局 */
.split-layout {
  display: flex;
  gap: 16px;
  height: 100%;
}

.panel-conditions {
  flex: 1;
  min-width: 0;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  overflow: hidden;
  background: white;
}

.panel-actions {
  flex: 1;
  min-width: 0;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  overflow: hidden;
  background: white;
}

/* 响应式适配 */
@media (max-width: 1024px) {
  .editor-modal {
    width: 95vw;
    height: 90vh;
  }

  .split-layout {
    flex-direction: column;
  }
}
</style>
