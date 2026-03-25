<template>
  <el-dialog
    v-model="dialogVisible"
    width="90vw"
    :title="isEditing ? '编辑规则' : '新建规则'"
    :close-on-click-modal="false"
    class="rule-editor-modal-pro"
    @close="handleClose"
  >
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

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">放弃修改</el-button>
        <el-button :loading="loading" @click="handleSave">保存</el-button>
        <el-button type="primary" :loading="loading" @click="handleSaveAndClose">保存并关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { ElMessageBox } from 'element-plus'
import ConditionTree from './ConditionTree.vue'
import ActionConfig from './ActionConfig.vue'

const dialogVisible = ref(false)
const loading = ref(false)

const props = defineProps({
  modelValue: {
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

const emit = defineEmits(['update:modelValue', 'save'])

const localRule = ref({
  id: null,
  conditionTree: null,
  targets: [],
  tooltip: '',
  description: ''
})

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

watch(() => props.modelValue, (newVal) => {
  dialogVisible.value = newVal
}, { immediate: true })

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
    localRule.value = {
      id: Date.now(),
      conditionTree: createDefaultConditionTree(),
      targets: [],
      tooltip: '',
      description: ''
    }
  }
}, { immediate: true, deep: true })

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

function handleClose() {
  emit('update:modelValue', false)
}

async function handleSave() {
  if (!localRule.value.conditionTree || !localRule.value.conditionTree.children || localRule.value.conditionTree.children.length === 0) {
    await ElMessageBox.alert('请至少添加一个条件', '提示', {
      confirmButtonText: '确定',
      type: 'warning'
    })
    return
  }

  if (!localRule.value.targets || localRule.value.targets.length === 0) {
    await ElMessageBox.alert('请至少添加一个动作', '提示', {
      confirmButtonText: '确定',
      type: 'warning'
    })
    return
  }

  const now = new Date()
  const currentTime = now.toLocaleString('zh-CN')
  const currentUser = '当前用户'

  const ruleToSave = { ...localRule.value }

  if (!props.isEditing) {
    ruleToSave.createTime = currentTime
    ruleToSave.createUser = currentUser
  }

  ruleToSave.editTime = currentTime
  ruleToSave.editUser = currentUser

  ruleToSave.createInfo = `${ruleToSave.createUser || currentUser} ${ruleToSave.createTime || currentTime}`
  ruleToSave.editInfo = `${currentUser} ${currentTime}`

  emit('save', ruleToSave)
}

async function handleSaveAndClose() {
  await handleSave()
  handleClose()
}
</script>

<style scoped>
/* 规则说明区域 */
.rule-description-section {
  padding: 12px 0;
  margin-bottom: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  padding: 12px 16px;
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
}

/* 左右分栏布局 */
.split-layout {
  display: flex;
  gap: 16px;
  height: 65vh;
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

/* 底部按钮 */
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* 对话框样式覆盖 */
:deep(.rule-editor-modal-pro) {
  .el-dialog__header {
    padding: 20px 24px;
    border-bottom: 1px solid #e8e8e8;
    margin-right: 0;
  }

  .el-dialog__title {
    font-size: 18px;
    font-weight: 600;
    color: #1e293b;
  }

  .el-dialog__body {
    padding: 20px 24px;
  }

  .el-dialog__footer {
    padding: 16px 24px;
    border-top: 1px solid #e8e8e8;
  }
}

/* 响应式适配 */
@media (max-width: 1024px) {
  .split-layout {
    flex-direction: column;
    height: auto;
  }
}
</style>
