<!--
  功能：动作限制编辑器 - 基于 ContractEditor.vue 优化实现
  用于配置动作限制规则列表，支持添加、删除、复制规则项
  关联需求：button editorType=actionlimit 时调用
-->
<template>
  <el-dialog
    v-model="dialogVisible"
    width="1600px"
    title="动作限制 "
    :close-on-click-modal="false"
    class="action-limit-editor"
    @close="onClose"
  >
    <!-- 头部统计信息 -->
    <div class="editor-header">
      <span class="rule-count">当前动作 吃牌 ,共 {{ formItems.length }} 条规则</span>
      <el-tag v-if="hasUnsavedChanges" type="warning" effect="plain" size="small">
        <el-icon><Warning /></el-icon>
        有未保存的更改
      </el-tag>
    </div>

    <!-- 空状态提示 -->
    <div v-if="formItems.length === 0" class="empty-state">
      <el-empty description="暂无动作限制规则">
        <template #image>
          <div class="empty-icon">
            <el-icon :size="64" color="#dcdfe6"><DocumentDelete /></el-icon>
          </div>
        </template>
        <template #description>
          <p class="empty-title">暂无动作限制规则</p>
          <p class="empty-desc">点击添加按钮创建第一条规则</p>
        </template>
        <el-button type="primary" @click="addItem(0)">
          <el-icon><Plus /></el-icon>
          添加规则
        </el-button>
      </el-empty>
    </div>

    <!-- 规则列表 -->
    <div v-else class="rules-container">
      <el-scrollbar max-height="450px" always>
        <TransitionGroup name="rule-item" tag="div" class="rules-list">
          <div
            v-for="(item, index) in formItems"
            :key="item.id"
            class="rule-card"
            :class="{ 'is-active': isExpanded(index) }"
          >
            <!-- 规则头部 -->
            <div class="rule-header">
              <div class="rule-info" @click="toggleExpand(index)">
                <span class="rule-number">{{ index + 1 }}</span>
                <div class="rule-title" @dblclick.stop="startEditing(index)">
                  <!-- 编辑模式 -->
                  <el-input
                    v-if="editingIndex === index"
                    v-model="item.mark"
                    size="small"
                    placeholder="输入规则说明"
                    class="title-edit-input"
                    @blur="stopEditing"
                    @keyup.enter="stopEditing"
                    @click.stop
                    ref="titleInputRef"
                  />
                  <!-- 显示模式 -->
                  <template v-else>
                    <span v-if="item.mark" class="rule-title-text">{{ item.mark }}</span>
                    <span v-else class="rule-title-placeholder">双击编辑规则说明</span>
                  </template>
                </div>
              </div>
              <div class="rule-actions">
                <!-- 展开/折叠图标 -->
                <el-icon 
                  class="expand-icon" 
                  :class="{ 'is-expanded': isExpanded(index) }"
                  @click.stop="toggleExpand(index)"
                >
                  <ArrowDown />
                </el-icon>
                
                <!-- 操作按钮组 -->
                <el-dropdown trigger="click" @command="handleCommand($event, index)">
                  <el-button
                    size="small"
                    circle
                    text
                    class="action-btn"
                    @click.stop
                  >
                    <el-icon><MoreFilled /></el-icon>
                  </el-button>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item command="copy">
                        <el-icon><DocumentCopy /></el-icon>
                        复制规则
                      </el-dropdown-item>
                      <el-dropdown-item command="add">
                        <el-icon><Plus /></el-icon>
                        下方添加
                      </el-dropdown-item>
                      <el-dropdown-item divided command="delete" :disabled="formItems.length === 1">
                        <el-icon><Delete /></el-icon>
                        <span style="color: #f56c6c;">删除规则</span>
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
            </div>

            <!-- 规则内容 -->
            <el-collapse-transition>
              <div v-show="isExpanded(index)" class="rule-content">
                

                <!-- 触发条件 -->
                <div class="form-row">
                  <div class="form-label-with-actions">
                    <label class="form-label">
                      <el-icon color="#3b82f6"><CircleCheck /></el-icon>
                      触发条件
                      <el-tooltip content="当满足以下条件时，将限制动作执行" placement="top">
                        <el-icon class="help-icon"><QuestionFilled /></el-icon>
                      </el-tooltip>
                    </label>
                    <div class="input-actions">
                      <el-button
                        size="small"
                        text
                        class="action-btn"
                        @click="copyCondition(item)"
                        title="复制表达式"
                      >
                        复制
                      </el-button>
                      <el-button
                        size="small"
                        text
                        class="action-btn"
                        @click="pasteCondition(item)"
                        title="粘贴表达式"
                      >
                        粘贴
                      </el-button>
                      <el-button
                        size="small"
                        text
                        class="action-btn"
                        @click="pasteCondition(item)"
                        title="粘贴表达式"
                      >
                        校验
                      </el-button>
                    </div>
                  </div>
                  <ExpressionInput
                    v-model="item.condition"
                    placeholder="请输入条件表达式"
                  />
                </div>

                <!-- 限制动作 -->
                <div class="form-row">
                  <label class="form-label">
                    <el-icon color="#f56c6c"><CircleClose /></el-icon>
                    当上述条件满足时，玩家将无法执行此动作
                  </label>
                  <!-- <div class="result-box">
                    <el-tag type="danger" effect="light" size="small">
                      <el-icon><CircleClose /></el-icon>
                
                    </el-tag>
                    <span class="result-desc">当上述条件满足时，玩家将无法执行此动作</span>
                  </div> -->
                </div>
              </div>
            </el-collapse-transition>
          </div>
        </TransitionGroup>
      </el-scrollbar>
    </div>

    <!-- 底部添加按钮 -->
    <div v-if="formItems.length > 0" class="footer-add">
      <el-button type="primary" plain @click="addItem(formItems.length - 1)">
        <el-icon><Plus /></el-icon>
        添加新规则
      </el-button>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="onClose">放弃修改</el-button>
        <el-button  :loading="loading" @click="onSave">
          保存
        </el-button>
        <el-button type="primary" :loading="loading" @click="onSave">
          
          保存并关闭
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import {
  DocumentCopy,
  Plus,
  Delete,
  Document,
  Warning,
  DocumentDelete,
  EditPen,
  ArrowDown,
  MoreFilled,
  CircleCheck,
  CircleClose,
  QuestionFilled,
  Lock,
  Check,
  CopyDocument,
  DocumentChecked,
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import ExpressionInput from './ExpressionInput.vue'

// 生成唯一ID
let idCounter = 0
const generateId = () => `rule_${++idCounter}_${Date.now()}`

// 属性定义
const props = defineProps<{
  visible: boolean
  initData?: {
    limit_list?: Array<{
      mark?: string
      limit?: {
        node_list?: any[]
      }
    }>
  }
}>()

const dialogVisible = ref(false)
const loading = ref(false)
const expandedIndices = ref<Set<number>>(new Set([0]))
const hasUnsavedChanges = ref(false)
const editingIndex = ref<number | null>(null)
const titleInputRef = ref<HTMLInputElement | null>(null)

// 表单数据项
interface RuleItem {
  id: string
  mark: string
  condition: string
}

const formItems = ref<RuleItem[]>([])
const originalData = ref<string>('')

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'confirm', value: { limit_list: Array<{ mark: string; limit: { node_list: any[] } }> }): void
}>()

// 判断规则是否展开
const isExpanded = (index: number) => expandedIndices.value.has(index)

// 切换展开状态
const toggleExpand = (index: number) => {
  // 如果正在编辑，不切换展开状态
  if (editingIndex.value === index) return
  
  if (expandedIndices.value.has(index)) {
    expandedIndices.value.delete(index)
  } else {
    expandedIndices.value.add(index)
  }
}

// 开始编辑标题
const startEditing = (index: number) => {
  editingIndex.value = index
  // 自动聚焦输入框
  nextTick(() => {
    titleInputRef.value?.focus()
  })
}

// 停止编辑
const stopEditing = () => {
  editingIndex.value = null
}

// 复制条件表达式到剪贴板
const copyCondition = async (item: RuleItem) => {
  if (!item.condition) {
    ElMessage.warning('表达式为空，无法复制')
    return
  }
  try {
    await navigator.clipboard.writeText(item.condition)
    ElMessage.success('表达式已复制到剪贴板')
  } catch (err) {
    ElMessage.error('复制失败，请手动复制')
  }
}

// 从剪贴板粘贴条件表达式
const pasteCondition = async (item: RuleItem) => {
  try {
    const text = await navigator.clipboard.readText()
    if (text) {
      item.condition = text
      ElMessage.success('表达式已粘贴')
    } else {
      ElMessage.warning('剪贴板为空')
    }
  } catch (err) {
    ElMessage.error('粘贴失败，请手动粘贴')
  }
}

// 初始化数据
const initFormData = () => {
  if (props.initData?.limit_list && props.initData.limit_list.length > 0) {
    formItems.value = props.initData.limit_list.map((item: any) => ({
      id: generateId(),
      mark: item.mark || '',
      condition: item.limit?.node_list ? JSON.stringify(item.limit.node_list, null, 2) : '',
    }))
  } else {
    // 默认初始化一个空项
    formItems.value = [
      {
        id: generateId(),
        mark: '',
        condition: '',
      },
    ]
  }
  // 默认展开第一项
  expandedIndices.value = new Set([0])
  // 保存原始数据用于比较
  originalData.value = JSON.stringify(formItems.value)
  hasUnsavedChanges.value = false
}

// 监听数据变化
watch(
  formItems,
  () => {
    const currentData = JSON.stringify(formItems.value)
    hasUnsavedChanges.value = currentData !== originalData.value
  },
  { deep: true }
)

// 监听 visible 变化
watch(
  () => props.visible,
  (newVal) => {
    dialogVisible.value = newVal
    if (newVal) {
      nextTick(() => {
        initFormData()
      })
    }
  },
  { immediate: true }
)

// 关闭对话框
const onClose = () => {
  if (hasUnsavedChanges.value) {
    ElMessage.warning('您有未保存的更改')
  }
  emit('close')
}

// 处理下拉菜单命令
const handleCommand = (command: string, index: number) => {
  switch (command) {
    case 'copy':
      copyItem(index)
      break
    case 'add':
      addItem(index)
      break
    case 'delete':
      removeItem(index)
      break
  }
}

// 添加新项
const addItem = (index: number) => {
  const newItem: RuleItem = {
    id: generateId(),
    mark: '',
    condition: '',
  }
  formItems.value.splice(index + 1, 0, newItem)
  // 自动展开新添加的项
  nextTick(() => {
    expandedIndices.value.add(index + 1)
  })
  ElMessage.success('已添加新规则')
}

// 复制项
const copyItem = (index: number) => {
  const sourceItem = formItems.value[index]
  const copiedItem: RuleItem = {
    id: generateId(),
    mark: `${sourceItem.mark} (复制)`,
    condition: sourceItem.condition,
  }
  formItems.value.splice(index + 1, 0, copiedItem)
  // 自动展开复制的项
  nextTick(() => {
    expandedIndices.value.add(index + 1)
  })
  ElMessage.success('已复制规则')
}

// 删除项
const removeItem = (index: number) => {
  if (formItems.value.length > 1) {
    formItems.value.splice(index, 1)
    // 更新展开状态
    const newExpanded = new Set<number>()
    expandedIndices.value.forEach((i) => {
      if (i < index) {
        newExpanded.add(i)
      } else if (i > index) {
        newExpanded.add(i - 1)
      }
    })
    expandedIndices.value = newExpanded
    ElMessage.success('已删除规则')
  } else {
    // 如果只剩一项，清空内容
    formItems.value[0].mark = ''
    formItems.value[0].condition = ''
    ElMessage.info('规则内容已清空')
  }
}

// 保存
const onSave = () => {
  // 验证数据
  const emptyRules = formItems.value.filter((item) => !item.condition.trim())
  if (emptyRules.length > 0) {
    ElMessage.warning(`${emptyRules.length} 条规则的条件为空，请补充完整`)
    return
  }

  loading.value = true
  
  const transformedData = formItems.value.map((item) => ({
    mark: item.mark,
    limit: {
      node_list: item.condition ? JSON.parse(item.condition) : [],
    },
  }))

  const result = {
    limit_list: transformedData,
  }

  console.log('动作限制编辑结果:', result)
  
  setTimeout(() => {
    loading.value = false
    hasUnsavedChanges.value = false
    originalData.value = JSON.stringify(formItems.value)
    emit('confirm', result)
    ElMessage.success('保存成功')
  }, 300)
}
</script>

<style scoped lang="scss">
// 变量定义
$primary-color: #3b82f6;
$danger-color: #f56c6c;
$success-color: #10b981;
$warning-color: #f59e0b;
$bg-color: #f8fafc;
$border-color: #e2e8f0;
$text-primary: #1e293b;
$text-secondary: #64748b;
$text-placeholder: #94a3b8;

// 编辑器头部
.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 8px;
  margin-bottom: 16px;
  border: 1px solid $border-color;

  .rule-count {
    font-size: 14px;
    color: $text-secondary;
    font-weight: 500;
  }

  :deep(.el-tag) {
    display: flex;
    align-items: center;
    gap: 4px;
  }
}

// 空状态
.empty-state {
  padding: 60px 20px;
  text-align: center;

  .empty-icon {
    margin-bottom: 16px;
  }

  .empty-title {
    font-size: 16px;
    font-weight: 600;
    color: $text-primary;
    margin-bottom: 8px;
  }

  .empty-desc {
    font-size: 14px;
    color: $text-secondary;
    margin-bottom: 24px;
  }
}

// 规则容器
.rules-container {
  border-radius: 8px;
  overflow: hidden;
}

.rules-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 4px;
}

// 规则卡片
.rule-card {
  background: #ffffff;
  border: 1px solid $border-color;
  border-radius: 10px;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

  &:hover {
    border-color: $primary-color;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
  }

  &.is-active {
    border-color: $primary-color;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
  }
}

// 规则头部
.rule-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  cursor: pointer;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  transition: background-color 0.2s;

  &:hover {
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  }
}

.rule-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
}

.rule-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: linear-gradient(135deg, $primary-color 0%, #2563eb 100%);
  color: white;
  font-size: 13px;
  font-weight: 600;
  border-radius: 6px;
  flex-shrink: 0;
}

.rule-title {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: text;

  &:hover {
    .rule-title-text,
    .rule-title-placeholder {
      background: rgba(59, 130, 246, 0.1);
      border-radius: 4px;
      padding: 2px 8px;
    }
  }

  .rule-title-text {
    font-size: 14px;
    font-weight: 500;
    color: $text-primary;
    padding: 2px 0;
    transition: all 0.2s;
  }

  .rule-title-placeholder {
    font-size: 14px;
    color: $text-placeholder;
    font-style: italic;
    padding: 2px 0;
    transition: all 0.2s;
  }

  .title-edit-input {
    width: 100%;

    :deep(.el-input__wrapper) {
      padding: 0 8px;
    }

    :deep(.el-input__inner) {
      font-size: 14px;
      font-weight: 500;
      color: $text-primary;
    }
  }
}

.rule-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;

  .expand-icon {
    font-size: 16px;
    color: $text-secondary;
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    &.is-expanded {
      transform: rotate(180deg);
    }
  }

  .action-btn {
    color: $text-secondary;

    &:hover {
      color: $primary-color;
      background: rgba(59, 130, 246, 0.1);
    }
  }
}

// 规则内容
.rule-content {
  padding: 16px;
  border-top: 1px solid $border-color;
  background: #fafbfc;
}

.form-row {
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
}

.form-label-with-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: $text-primary;

  .help-icon {
    font-size: 14px;
    color: $text-placeholder;
    cursor: help;

    &:hover {
      color: $primary-color;
    }
  }
}

.input-actions {
  display: flex;
  gap: 4px;

  .action-btn {
    color: $text-secondary;
    padding: 4px 8px;

    &:hover {
      color: $primary-color;
      background: rgba(59, 130, 246, 0.1);
    }

    .el-icon {
      font-size: 16px;
    }
  }
}

.condition-input {
  :deep(.el-textarea__inner) {
    font-family: 'Menlo', 'Monaco', 'Courier New', monospace;
    font-size: 13px;
    line-height: 1.6;
    background: #ffffff;
    border-color: $border-color;
    padding: 12px;

    &:focus {
      border-color: $primary-color;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    &::placeholder {
      color: $text-placeholder;
      font-family: system-ui, -apple-system, sans-serif;
    }
  }
}

.result-box {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #ffffff;
  border-radius: 6px;
  border: 1px solid #fee2e2;

  .result-desc {
    font-size: 13px;
    color: $text-secondary;
  }
}

// 底部添加按钮
.footer-add {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px dashed $border-color;
  text-align: center;
}

// 对话框底部
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

// 动画效果
.rule-item-enter-active,
.rule-item-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.rule-item-enter-from,
.rule-item-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.rule-item-move {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

// 下拉菜单样式
:deep(.el-dropdown-menu__item) {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;

  .el-icon {
    font-size: 16px;
  }
}

// 对话框样式覆盖
:deep(.action-limit-editor) {
  .el-dialog__header {
    padding: 20px 24px;
    border-bottom: 1px solid $border-color;
    margin-right: 0;

    .el-dialog__title {
      font-size: 18px;
      font-weight: 600;
      color: $text-primary;
    }
  }

  .el-dialog__body {
    padding: 20px 24px;
  }

  .el-dialog__footer {
    padding: 16px 24px;
    border-top: 1px solid $border-color;
  }
}
</style>
