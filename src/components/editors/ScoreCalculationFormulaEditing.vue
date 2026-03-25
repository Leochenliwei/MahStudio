<!--
  功能：算分公式编辑器弹窗 - 配置多场景算分规则
  移植自 game-settings 下的参考实现，支持 mock 数据
-->
<template>
  <el-dialog
    v-model="dialogVisible"
    title="算分公式配置"
    width="1200px"
    height="90vh"
    :close-on-click-modal="false"
    :before-close="handleClose"
  >
    <div class="score-calc-container">
      <!-- 头部统计信息 -->
    <div class="editor-header">
      <span class="rule-count">当前算分场景为：</span><span class="scenario-name">自摸胡牌</span> <span class="rule-count">- 共 {{ formItems.length }} 个计分公式</span> 
      <el-tag v-if="hasUnsavedChanges" type="warning" effect="plain" size="small">
        <el-icon><Warning /></el-icon>
        有未保存的更改
      </el-tag>
    </div>
      <!-- 赢家配置 - 顶层逻辑放在最前面 -->
      <div class="section-card winner-section">
        <div class="section-header">
          <el-icon><Trophy /></el-icon>
          <span class="section-title">赢家判定</span>
        </div>
        <div class="section-content">
          <el-form label-width="100px">
            <el-form-item label="判断表达式">
              <el-select
                v-model="winnerConfig.expr"
                type="textarea"
                :rows="2"
                placeholder="请选择谁要赢分"
              />
            </el-form-item>
            <el-form-item label="配置说明">
              <el-input
                v-model="winnerConfig.desc"
                placeholder="请输入赢家规则说明（可选）"
              />
            </el-form-item>
          </el-form>
        </div>
      </div>

      <!-- 计分规则配置 - 根据场景数量动态展示 -->
      <div class="section-card scoring-section">
        <div class="section-header">
          <el-icon><Tickets /></el-icon>
          <span class="section-title">计分规则</span>
          
        </div>
        <div class="section-content">
          <!-- 场景列表 卡片式布局 -->
          <div class="scenario-list">
            <div
              v-for="(item, index) in formItems"
              :key="index"
              class="scenario-card"
              :class="{ 'is-expanded': isExpanded(index) }"
            >
              <!-- 场景头部 - 可点击展开/折叠 -->
              <div class="scenario-header" @click="toggleExpand(index)">
                <div class="scenario-info">
                  <div class="scenario-number">{{ index + 1 }}</div>
                  <div class="scenario-title" @dblclick.stop="startEditing(index)">
                    <!-- 编辑模式 -->
                    <el-input
                      v-if="editingIndex === index"
                      v-model="item.mark"
                      size="small"
                      placeholder="输入场景说明"
                      class="title-edit-input"
                      @blur="stopEditing"
                      @keyup.enter="stopEditing"
                      @click.stop
                      ref="titleInputRef"
                    />
                    <!-- 显示模式 -->
                    <template v-else>
                      <span v-if="item.mark" class="scenario-title-text">{{ item.mark }}</span>
                      <span v-else class="scenario-title-placeholder">双击编辑场景说明</span>
                    </template>
                  </div>
                </div>
                <div class="scenario-actions">
                  <!-- 展开/折叠图标 -->
                  <el-icon
                    class="expand-icon"
                    :class="{ 'is-expanded': isExpanded(index) }"
                    @click.stop="toggleExpand(index)"
                  >
                    <ArrowDown />
                  </el-icon>

                  <!-- 操作菜单 -->
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

              <!-- 场景内容 - 折叠/展开动画 -->
              <el-collapse-transition>
                <div v-show="isExpanded(index)" class="scenario-content">
                  <el-form :model="item" label-width="100px">
                    <!-- 条件表达式 - 独占一行，和 ActionLimitEditor 对齐 -->
                    <div class="form-row">
                      <div class="form-label-with-actions">
                        <label class="form-label">
                          <el-icon color="#3b82f6"><CircleCheck /></el-icon>
                          条件表达式
                          <el-tooltip content="当满足此条件时，应用本计分规则" placement="top">
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
                        </div>
                      </div>
                      <el-input
                        v-model="item.judgeExprText"
                        type="textarea"
                        :rows="1"
                        placeholder="请输入条件表达式"
                        class="condition-input"
                        resize="none"
                      />
                    </div>

                    <!-- 出分玩家 - 独占一行，和其他表达式对齐样式 -->
                    <div class="form-row">
                      <div class="form-label-with-actions">
                        <label class="form-label">
                          <el-icon color="#f59e0b"><CircleClose /></el-icon>
                          出分玩家
                          <el-tooltip content="满足条件时，这位玩家需要出分" placement="top">
                            <el-icon class="help-icon"><QuestionFilled /></el-icon>
                          </el-tooltip>
                        </label>
                      </div>
                      <el-select
                        v-model="item.loser"
                        placeholder="请选择谁需要出分"
                        clearable
                        class="player-select"
                      >
                        <el-option
                          v-for="player in playerOptions"
                          :key="player.value"
                          :label="player.label"
                          :value="player.value"
                        />
                      </el-select>
                    </div>

                    <!-- 计分表达式 - 独占一行，和 ActionLimitEditor 对齐 -->
                    <div class="form-row">
                      <div class="form-label-with-actions">
                        <label class="form-label">
                          <el-icon color="#8b5cf6"><CircleClose /></el-icon>
                          计分表达式
                          <el-tooltip content="满足条件时，使用此表达式计算分数" placement="top">
                            <el-icon class="help-icon"><QuestionFilled /></el-icon>
                          </el-tooltip>
                        </label>
                        <div class="input-actions">
                          <el-button
                            size="small"
                            text
                            class="action-btn"
                            @click="copyCalcExpr(item)"
                            title="复制表达式"
                          >
                            复制
                          </el-button>
                          <el-button
                            size="small"
                            text
                            class="action-btn"
                            @click="pasteCalcExpr(item)"
                            title="粘贴表达式"
                          >
                            粘贴
                          </el-button>
                        </div>
                      </div>
                      
                      <el-input
                        v-model="item.calcExprText"
                        type="textarea"
                        :rows="1"
                        placeholder="请输入计分表达式"
                        class="condition-input"
                        resize="none"
                      />
                    </div>
                  </el-form>
                </div>
              </el-collapse-transition>
            </div>
          </div>
        </div>
        <div class="section-foot"><!-- 添加场景按钮 - 始终显示在底部，在滚动区域外面 -->
           <div class="footer-add-button">
             <el-button type="primary" plain @click="addFormItem">
               <el-icon><Plus /></el-icon>
               添加场景
             </el-button>
           </div>
           
        </div>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">放弃修改</el-button>
        <el-button :loading="loading" @click="handleConfirm">
          保存
        </el-button>
        <el-button type="primary" :loading="loading" @click="handleConfirm">
          保存并关闭
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import {
  Plus,
  Trophy,
  Tickets,
  Delete,
  ArrowDown,
  MoreFilled,
  DocumentCopy,
  CircleCheck,
  CircleClose,
  QuestionFilled,
} from '@element-plus/icons-vue'

// 属性定义
const props = defineProps<{
  visible: boolean
  cfgId?: number
  initData?: {
    exprList?: any[]
    expr_list?: any[]
    winner?: any
    toggleMultipleScenarios?: boolean
  }
  extendConfig?: {
    playerOptions?: { label: string; value: string }[]
  }
}>()

// 事件定义
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'confirm', value: any): void
}>()

const dialogVisible = ref(false)
const loading = ref(false)
const hasUnsavedChanges = ref(false)

// 展开的场景索引集合
const expandedIndices = ref<Set<number>>(new Set([0]))
// 当前正在编辑标题的索引
const editingIndex = ref<number | null>(null)
// 标题输入框引用
const titleInputRef = ref<HTMLInputElement | null>(null)

// 玩家选项（mock 数据）
const defaultPlayerOptions = [
  { label: '庄家', value: 'zhuang' },
  { label: '闲家', value: 'xian' },
  { label: '所有玩家', value: 'all' },
  { label: '点炮者', value: 'dianpao' },
  { label: '自摸者', value: 'zimo' },
]

const playerOptions = ref(defaultPlayerOptions)

// 多场景表单数据
interface FormItem {
  mark: string
  loser: string
  calcExprText: string
  judgeExprText: string
}

const formItems = ref<FormItem[]>([
  {
    mark: '',
    loser: '',
    calcExprText: '',
    judgeExprText: '',
  },
])

// 赢家配置
const winnerConfig = reactive({
  expr: '',
  desc: '',
})

// 添加场景
const addFormItem = () => {
  const newIndex = formItems.value.length
  formItems.value.push({
    mark: '',
    loser: '',
    calcExprText: '',
    judgeExprText: '',
  })
  // 自动展开新添加的场景
  nextTick(() => {
    expandedIndices.value.add(newIndex)
  })
}

// 删除场景
const removeFormItem = (index: number) => {
  if (formItems.value.length > 1) {
    formItems.value.splice(index, 1)
    // 更新展开索引（重新映射）
    const newExpanded = new Set<number>()
    expandedIndices.value.forEach((i) => {
      if (i < index) {
        newExpanded.add(i)
      } else if (i > index) {
        newExpanded.add(i - 1)
      }
    })
    expandedIndices.value = newExpanded
  }
}

// 判断场景是否展开
const isExpanded = (index: number) => expandedIndices.value.has(index)

// 切换展开状态
const toggleExpand = (index: number) => {
  // 如果正在编辑标题，不切换展开
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

// 停止编辑标题
const stopEditing = () => {
  editingIndex.value = null
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
      removeFormItem(index)
      break
  }
}

// 复制规则
const copyItem = (index: number) => {
  const sourceItem = formItems.value[index]
  const copiedItem: FormItem = {
    mark: sourceItem.mark ? `${sourceItem.mark} (复制)` : '',
    loser: sourceItem.loser,
    calcExprText: sourceItem.calcExprText,
    judgeExprText: sourceItem.judgeExprText,
  }
  formItems.value.splice(index + 1, 0, copiedItem)
  // 自动展开复制的项
  nextTick(() => {
    expandedIndices.value.add(index + 1)
  })
}

// 在指定位置下方添加新规则
const addItem = (index: number) => {
  const newItem: FormItem = {
    mark: '',
    loser: '',
    calcExprText: '',
    judgeExprText: '',
  }
  formItems.value.splice(index + 1, 0, newItem)
  // 自动展开新添加的项
  nextTick(() => {
    expandedIndices.value.add(index + 1)
  })
}

// 复制条件表达式到剪贴板
const copyCondition = async (item: FormItem) => {
  if (!item.judgeExprText) {
    ElMessage.warning('表达式为空，无法复制')
    return
  }
  try {
    await navigator.clipboard.writeText(item.judgeExprText)
    ElMessage.success('条件表达式已复制到剪贴板')
  } catch (err) {
    ElMessage.error('复制失败，请手动复制')
  }
}

// 从剪贴板粘贴条件表达式
const pasteCondition = async (item: FormItem) => {
  try {
    const text = await navigator.clipboard.readText()
    if (text) {
      item.judgeExprText = text
      ElMessage.success('表达式已粘贴')
    } else {
      ElMessage.warning('剪贴板为空')
    }
  } catch (err) {
    ElMessage.error('粘贴失败，请手动粘贴')
  }
}

// 复制计分表达式到剪贴板
const copyCalcExpr = async (item: FormItem) => {
  if (!item.calcExprText) {
    ElMessage.warning('表达式为空，无法复制')
    return
  }
  try {
    await navigator.clipboard.writeText(item.calcExprText)
    ElMessage.success('计分表达式已复制到剪贴板')
  } catch (err) {
    ElMessage.error('复制失败，请手动复制')
  }
}

// 从剪贴板粘贴计分表达式
const pasteCalcExpr = async (item: FormItem) => {
  try {
    const text = await navigator.clipboard.readText()
    if (text) {
      item.calcExprText = text
      ElMessage.success('表达式已粘贴')
    } else {
      ElMessage.warning('剪贴板为空')
    }
  } catch (err) {
    ElMessage.error('粘贴失败，请手动粘贴')
  }
}

// 初始数据副本，用于检测未保存更改
const initialData = ref<any>(null)

// 保存初始数据
const saveInitialData = () => {
  initialData.value = {
    formItems: JSON.parse(JSON.stringify(formItems.value)),
    winnerConfig: JSON.parse(JSON.stringify(winnerConfig))
  }
  hasUnsavedChanges.value = false
}

// 检测是否有未保存的更改
const checkUnsavedChanges = () => {
  if (!initialData.value) {
    hasUnsavedChanges.value = false
    return
  }
  
  // 比较表单数据
  const currentFormItems = JSON.stringify(formItems.value)
  const initialFormItems = JSON.stringify(initialData.value.formItems)
  
  // 比较赢家配置
  const currentWinnerConfig = JSON.stringify(winnerConfig)
  const initialWinnerConfig = JSON.stringify(initialData.value.winnerConfig)
  
  hasUnsavedChanges.value = currentFormItems !== initialFormItems || currentWinnerConfig !== initialWinnerConfig
}

// 初始化数据
const initData = () => {
  if (props.initData) {
    // 设置玩家选项
    if (props.extendConfig?.playerOptions) {
      playerOptions.value = props.extendConfig.playerOptions
    }

    // 设置表单数据 - 兼容新旧两种键名
    const exprList = props.initData.expr_list || props.initData.exprList || []
    if (exprList.length > 0) {
      // 清空并重新填充
      formItems.value.splice(0, formItems.value.length)

      exprList.forEach((item: any) => {
        if (item.mark !== undefined) {
          // 多场景数据
          formItems.value.push({
            mark: item.mark || '',
            loser: item.loser || '',
            calcExprText: Array.isArray(item.calc_expr)
              ? item.calc_expr.join(' ')
              : item.calc_expr || '',
            judgeExprText: Array.isArray(item.judge_expr)
              ? item.judge_expr.join(' ')
              : item.judge_expr || '',
          })
        } else if (item.expr !== undefined) {
          // 旧版单场景数据 - 转换到新格式
          formItems.value.push({
            mark: '',
            loser: item.loser || '',
            calcExprText: Array.isArray(item.expr)
              ? item.expr.join(' ')
              : item.expr || '',
            judgeExprText: '',
          })
        }
      })
    }

    // 默认展开第一个
    expandedIndices.value = new Set([0])

    // 设置赢家配置
    if (props.initData.winner) {
      winnerConfig.expr = props.initData.winner.body?.expr || ''
      winnerConfig.desc = props.initData.winner.desc || ''
    }
  } else {
    // 空数据默认初始化 - 保证至少一项
    if (formItems.value.length === 0) {
      formItems.value.push({
        mark: '',
        loser: '',
        calcExprText: '',
        judgeExprText: '',
      })
    }
    // 默认展开第一个
    expandedIndices.value = new Set([0])
  }
  
  // 保存初始数据
  saveInitialData()
}

// 监听数据变化，检测未保存的更改
watch(
  formItems,
  () => {
    checkUnsavedChanges()
  },
  { deep: true }
)

// 监听赢家配置变化
watch(
  winnerConfig,
  () => {
    checkUnsavedChanges()
  },
  { deep: true }
)

// 监听visible变化
watch(
  () => props.visible,
  (newVal) => {
    dialogVisible.value = newVal
    if (newVal) {
      initData()
    }
  },
  { immediate: true }
)

// 关闭弹窗
const handleClose = () => {
  emit('close')
}

// 确认提交
const handleConfirm = () => {
  loading.value = true

  // 统一使用 formItems 数组输出，保持数据结构一致
  const exprList = formItems.value.map((item) => {
    return {
      mark: item.mark,
      loser: item.loser,
      calc_expr: item.calcExprText.split(/\s+/).filter(Boolean),
      judge_expr: item.judgeExprText.split(/\s+/).filter(Boolean),
    }
  })

  const result = {
    expr_list: exprList,
    winner: {
      id: 'winner',
      body: {
        expr: winnerConfig.expr,
      },
      desc: winnerConfig.desc,
    },
  }

  console.log('算分公式编辑结果', result)
  
  setTimeout(() => {
    loading.value = false
    // 保存成功后重置未保存更改状态
    saveInitialData()
    emit('confirm', result)
  }, 300)
}
</script>

<style scoped lang="scss">
// 编辑器头部
$primary-color: #3b82f6;
$danger-color: #f56c6c;
$success-color: #10b981;
$warning-color: #f59e0b;
$bg-color: #f8fafc;
$border-color: #e2e8f0;
$text-primary: #1e293b;
$text-secondary: #64748b;
$text-placeholder: #94a3b8;

.editor-header {
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 8px;
  border: 1px solid $border-color;

  .rule-count {
    font-size: 14px;
    color: $text-secondary;
    font-weight: 500;
  }
  
  .scenario-name {
    font-size: 14px;
    color: $text-primary;
    font-weight: 600;
  }
  
  :deep(.el-tag) {
    display: flex;
    align-items: center;
    gap: 4px;
  }
}



.score-calc-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 0 4px;
  height: calc(90vh - 120px);
  // 头部固定，中间和底部区域布局
}


.section-card {
  background-color: #fafafa;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    border-color: #3b82f6;
    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.08);
  }

  .section-header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 8px;
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    color: white;

    .el-icon {
      font-size: 18px;
    }

    .section-title {
      font-size: 12px;
      font-weight: 600;
    }
  }

  .section-content {
    padding: 16px;
    display: flex;
    flex-direction: column;
    height: 100%;
  }
}

.winner-section {
  .section-header {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  }
}

.scoring-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  
  .section-header {
    background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  }
  
  .section-content {
    flex: 1;
    min-height: 0;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  
  .section-foot {
    padding: 16px;
    border-top: 1px dashed #e2e8f0;
  }
}

// 样式变量
$primary-color: #3b82f6;
$danger-color: #f56c6c;
$bg-color: #f8fafc;
$border-color: #e2e8f0;
$text-primary: #1e293b;
$text-secondary: #64748b;
$text-placeholder: #94a3b8;

.scenario-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
  overflow-y: auto;
  padding: 0 4px 16px 4px;
  min-height: 0;
  /* 确保卡片高度由内容决定，不均分视窗高度 */
  align-items: stretch;
  
  // 自定义滚动条样式
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }
}

.scenario-card {
  background: #ffffff;
  border: 1px solid $border-color;
  border-radius: 10px;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  /* 固定卡片高度，不随视窗高度均分 */
  flex-shrink: 0;
  width: 100%;

  &:hover {
    border-color: $primary-color;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
  }

  &.is-expanded {
    border-color: $primary-color;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
  }

  .scenario-header {
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

  .scenario-info {
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1;
    min-width: 0;
  }

  .scenario-number {
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

  .scenario-title {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: text;

    &:hover {
      .scenario-title-text,
      .scenario-title-placeholder {
        background: rgba(59, 130, 246, 0.1);
        border-radius: 4px;
        padding: 2px 8px;
      }
    }

    .scenario-title-text {
      font-size: 14px;
      font-weight: 500;
      color: $text-primary;
      padding: 2px 0;
      transition: all 0.2s;
    }

    .scenario-title-placeholder {
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

  .scenario-actions {
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

  .scenario-content {
    padding: 16px;
    border-top: 1px solid $border-color;
    background: #fafbfc;
  }

// 表达式行样式 - 对齐 ActionLimitEditor
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

// 出分玩家选择器样式
.player-select {
  :deep(.el-input__wrapper) {
    background: #ffffff;
  }
}

// 底部添加按钮
.footer-add-button {
  text-align: center;
}

// 模式切换过渡动画
.mode-transition-enter-active,
.mode-transition-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.mode-transition-enter-from,
.mode-transition-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

// 折叠展开过渡动画
.scenario-item-move {
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

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
}
</style>