<template>
  <el-dialog v-model="show" title="变量编辑" width="1200px" @close="onClose">
    <el-row :gutter="20">
      <el-col :span="8">
        <div class="variable-list">
          <div class="list-header">
            <div class="list-title">已创建变量</div>
            <el-button type="primary" size="small" @click="handleAddVariable">新增变量</el-button>
          </div>
          <div class="list-content">
            <!-- 动态渲染所有类型的变量分组 -->
            <template v-for="(typeValue, typeKey) in groupedVariables" :key="typeKey">
              <div v-if="typeValue && typeValue.length > 0" class="type-group">
                <div class="type-header">
                  <span class="type-label">{{ getVariableTypeLabel(Number(typeKey)) }}</span>
                  <span class="type-count">({{ typeValue.length }})</span>
                </div>
                <div
                  v-for="variable in typeValue"
                  :key="variable.id"
                  class="variable-item"
                  @click="handleEditVariable(variable)"
                >
                  <div class="variable-name">{{ variable.name }}</div>
                  <el-button type="text" size="small" @click.stop="handleDeleteVariable(variable.id)">
                    <el-icon><Delete /></el-icon>
                  </el-button>
                </div>
              </div>
            </template>

            <div v-if="Object.keys(groupedVariables).length === 0" class="empty-list">暂无变量，请点击新增变量</div>
          </div>
        </div>
      </el-col>
      <el-col :span="16">
        <div v-if="isEditing" class="edit-form">
          <div class="form-content">
            <el-form>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item prop="name">
                    <div>变量名称</div>
                    <el-input
                      v-model="formItems.name"
                      placeholder="请输入变量名称"
                      style="width: 100%"
                      @input="isFormModified = true"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item prop="type">
                    <div>变量类型</div>
                    <el-select
                      v-model="formItems.type"
                      placeholder="请选择变量类型"
                      style="width: 100%"
                      @click.stop
                      @change="
                        () => {
                          handleTypeChange()
                          isFormModified = true
                        }
                      "
                    >
                      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item prop="expr">
                <AddMultiplyMaxMin
                  v-if="[1, 2, 3, 4].includes(formItems.type)"
                  v-model="formItems.expr"
                  :type="formItems.type"
                  @input="handleExprChange"
                />
                <Establish
                  v-else
                  v-model="formItems.expr"
                  :type="formItems.type"
                  @input="
                    () => {
                      isFormModified = true
                    }
                  "
                />
              </el-form-item>
            </el-form>
          </div>
          <div class="button-area">
            <el-button type="primary" :loading="loading" :disabled="!isFormModified" @click="handleSave"
              >保存</el-button
            >
          </div>
        </div>
        <div v-else class="empty-edit">
          <div class="empty-tip">
            <el-icon class="empty-icon"><Plus /></el-icon>
            <div class="empty-text">请选择或新增变量进行编辑</div>
          </div>
        </div>
      </el-col>
    </el-row>
    <template #footer>
      <el-button @click="show = false">取消</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { Delete, Plus } from '@element-plus/icons-vue'
import { AddMultiplyMaxMin, Establish } from './common/Index'
import {
  getVariableConfigList,
  updateVariableConfig,
  addVariableConfig,
  deleteVariableConfig,
} from '@/api/gameApi'
import { ElMessageBox, ElMessage } from 'element-plus'
import { convertToGroupItemsFormat, convertBackToApiFormat, toSubmitExprData, toRenderData } from './common/util'

/**
 * 变量编辑弹窗组件
 * 提供变量的增删改查功能，支持多种变量类型
 * 
 * @author 迁移自资料目录
 * @date 2026-03-20
 */

// 弹窗显示状态
const show = ref(false)
// 加载状态
const loading = ref(false)
// 是否处于编辑状态
const isEditing = ref(false)
// 当前编辑的变量ID
const currentVariableId = ref<string | null>(null)
// 表单是否被修改
const isFormModified = ref(false)
// 当前游戏的cfg_id
const currentCfgId = ref<number>(0)

// 按类型分组变量
const groupedVariables = computed(() => {
  const groups: Record<string, any[]> = {}

  variables.value.forEach(variable => {
    const type = variable.type.toString()
    if (!groups[type]) {
      groups[type] = []
    }
    groups[type].push(variable)
  })
  return groups
})

// 变量列表
const variables = ref<any[]>([])

interface FormItems {
  name: string
  type: number
  expr: any[] | string
}

/**
 * 处理表达式变化
 * 标记表单为已修改状态
 */
const handleExprChange = () => {
  isFormModified.value = true
}

// 表单数据
const formItems = ref<FormItems>({
  name: '',
  type: 1,
  expr: [],
})

// 变量类型选项
const options = [
  { value: 1, label: '组内相加' },
  { value: 2, label: '组内相乘' },
  { value: 3, label: '组内取最大' },
  { value: 4, label: '组内取最小' },
  { value: 5, label: '判断是否成立' },
  { value: 7, label: '依次判断是否成立 (且)' },
  { value: 8, label: '任一条件成立 (或)' },
  { value: 9, label: '累加' },
  { value: 10, label: '累乘' },
]

/**
 * 打开弹窗
 * @param {number} cfgId - 游戏配置ID
 */
const openDialog = (cfgId: number) => {
  show.value = true
  isEditing.value = false
  currentCfgId.value = cfgId
  getGameVarConfigData()
  resetForm()
}

/**
 * 关闭弹窗处理
 * 检查是否有未保存的修改，提示用户保存
 */
const onClose = async () => {
  // 检查是否有未保存的修改
  if (isFormModified.value) {
    await ElMessageBox.confirm('当前变量有未保存的修改，是否保存？', '保存确认', {
      confirmButtonText: '保存',
      cancelButtonText: '不保存',
      type: 'warning',
    })
      .then(async () => {
        // 用户选择保存
        await handleSave()
      })
      .catch(() => {
        // 用户选择不保存，继续关闭
        console.log('用户选择不保存')
      })
  }

  show.value = false
  isEditing.value = false
  resetForm()
}

/**
 * 重置表单
 * 清空表单数据并重新加载变量列表
 */
const resetForm = () => {
  formItems.value = {
    name: '',
    type: 1,
    expr: [],
  }
  getGameVarConfigData()
  currentVariableId.value = null
  isFormModified.value = false // 重置修改状态
}

/**
 * 处理类型变化
 * 清空表达式数据
 */
const handleTypeChange = () => {
  formItems.value.expr = []
}

/**
 * 添加新变量
 * 创建默认变量并选中编辑
 */
const handleAddVariable = async () => {
  isEditing.value = true
  const randomSixDigits = Math.floor(100000 + Math.random() * 900000).toString()
  const newVariable = {
    cfg_id: currentCfgId.value,
    name: `新增变量_${randomSixDigits}`, // 在名称后添加随机六位数
    type: 1,
    body: {
      expr: null,
      items: [],
    },
  }
  const res = await addVariableConfig(newVariable)
  if (res && res.errno === 0) {
    currentVariableId.value = res.data.id
    variables.value.push({ ...newVariable, id: res.data.id })
  }
  formItems.value = {
    name: `新增变量_${randomSixDigits}`, // 同步更新表单中的名称
    type: 1,
    expr: [],
  }
  isFormModified.value = false // 新增变量时重置修改状态
}

/**
 * 获取游戏变量配置数据
 * 从API加载变量列表
 */
const getGameVarConfigData = async () => {
  const res = await getVariableConfigList({ cfg_id: currentCfgId.value, page: 1, page_size: 999 })
  if (res && res.errno === 0) {
    const transformedData = res.data.list.map((variable: any) => {
      if ([1, 2, 3, 4].includes(variable.type) && Array.isArray(variable.expr)) {
        return {
          ...variable,
          expr: convertToGroupItemsFormat(variable.expr),
        }
      } else {
        return variable
      }
    })
    variables.value = transformedData || []
  }
}

/**
 * 编辑变量
 * 选中变量并加载其数据到编辑区域
 * @param {any} variable - 要编辑的变量
 */
const handleEditVariable = async (variable: any) => {
  // 检查是否有未保存的修改
  if (isFormModified.value) {
    await ElMessageBox.confirm('当前变量有未保存的修改，是否保存？', '保存确认', {
      confirmButtonText: '保存',
      cancelButtonText: '不保存',
      type: 'warning',
    })
      .then(async () => {
        // 用户选择保存
        await handleSave()
      })
      .catch(() => {
        // 用户选择不保存，继续切换变量
        console.log('用户选择不保存')
      })
  }

  // 切换到新变量
  isEditing.value = true
  currentVariableId.value = variable.id
  isFormModified.value = false // 重置修改状态
  let convertedExpr: any[] | string = []
  if ([1, 2, 3, 4].includes(variable.type) && Array.isArray(variable?.body?.items)) {
    // 处理类型 1,2,3,4 的变量
    convertedExpr = convertToGroupItemsFormat(variable.body.items)
  } else {
    // 对于其他类型（如 5,7,8,9,10），应该提取 expr 部分而不是整个变量对象
    const variabled = variables.value.find(v => v.id === variable.id)
    convertedExpr = variabled?.body?.expr || []
    convertedExpr = toRenderData(convertedExpr)
  }
  formItems.value = {
    name: variable.name,
    type: variable.type,
    expr: convertedExpr,
  }
}

/**
 * 删除变量
 * 从列表中删除指定变量
 * @param {string} id - 要删除的变量ID
 */
const handleDeleteVariable = async (id: string) => {
  // 检查是否有未保存的修改
  if (isFormModified.value) {
    await ElMessageBox.confirm('当前变量有未保存的修改，是否保存？', '保存确认', {
      confirmButtonText: '保存',
      cancelButtonText: '不保存',
      type: 'warning',
    })
      .then(async () => {
        // 用户选择保存
        await handleSave()
      })
      .catch(() => {
        // 用户选择不保存，继续删除
        console.log('用户选择不保存')
      })
  }

  await ElMessageBox.confirm('确定要删除这个变量吗？此操作不可恢复！', '删除确认', {
    confirmButtonText: '确定删除',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      const res = await deleteVariableConfig({ id })
      if (res && res.errno === 0) {
        isEditing.value = false
        ElMessage.success('删除成功')
        resetForm()
      }
    })
    .catch(() => {
      // 用户点击取消或关闭对话框
      console.log('删除操作已取消')
    })
}

/**
 * 保存变量
 * 将当前编辑的变量数据保存到服务器
 */
const handleSave = async () => {
  loading.value = true
  isFormModified.value = false
  // 将表单中的数据转换回 API 格式
  let processedExpr: any = formItems.value.expr
  if ([1, 2, 3, 4].includes(formItems.value.type) && Array.isArray(formItems.value.expr)) {
    processedExpr = convertBackToApiFormat(formItems.value.expr)
    if (currentVariableId.value) {
      // 编辑现有变量
      const index = variables.value.findIndex(v => v.id === currentVariableId.value)
      if (index !== -1) {
        variables.value[index] = {
          ...variables.value[index],
          name: formItems.value.name,
          type: formItems.value.type,
          body: { items: processedExpr, expr: null },
        }
      }
    } else {
      // 新增变量
      const newVariable = {
        id: Date.now().toString(),
        name: formItems.value.name,
        type: formItems.value.type,
        body: { items: processedExpr, expr: null },
      }
      variables.value.push(newVariable)
    }
  } else {
    console.log('processedExpr', processedExpr)
    const submitExprData = toSubmitExprData(Array.isArray(processedExpr) ? processedExpr : [processedExpr])
    const index = variables.value.findIndex(v => v.id === currentVariableId.value)
    if (index !== -1) {
      variables.value[index] = {
        ...variables.value[index],
        name: formItems.value.name,
        type: formItems.value.type,
        body: { items: [], expr: { value_type: 1, ...submitExprData } },
      }
    }
  }

  const res = await updateVariableConfig(variables.value.find(v => v.id === currentVariableId.value))
  if (res && res.errno === 0) {
    ElMessage.success('保存成功')
    // 确保保存成功后重置修改状态
    isFormModified.value = false
  }
  loading.value = false
}

/**
 * 获取变量类型标签
 * @param {number} type - 变量类型编号
 * @returns {string} 变量类型名称
 */
const getVariableTypeLabel = (type: number) => {
  const option = options.find(item => item.value === type)
  return option ? option.label : ''
}

// 暴露方法供父组件调用
defineExpose({
  openDialog,
  variables,
})

onMounted(() => {})
</script>

<style scoped>
.d-flex {
  display: flex;
}

.collapse-item {
  margin-bottom: 10px;
}

.w-full {
  width: 100%;
}
.justify-between {
  justify-content: space-between;
}

.align-center {
  align-items: center;
}

.items-center {
  align-items: center;
}

.gap-2 {
  gap: 8px;
}

.title-number {
  background-color: #0066cc;
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
  margin-right: 8px;
  min-width: 18px;
  text-align: center;
}

.title-text {
  color: #666;
  font-size: 14px;
  margin-right: 8px;
}

.condition-container {
  background-color: #e6f7ff;
  border: 1px solid #b3d8ff;
  border-radius: 4px;
  padding: 12px;
  margin: 12px 0;
  font-size: 14px;
}

.condition-container .condition-prefix {
  color: #333;
  margin-right: 8px;
}

.config-formula-tag {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  margin: 0 4px;
  display: inline-block;
}

.config-formula-tag.type-current-winner {
  background-color: #a0d3ff;
  color: #000;
}

.config-formula-tag.type-hand-type {
  background-color: #f0d9b5;
  color: #000;
}

.buttons {
  margin-right: 18px;
}

.config-formula-tag.operator {
  background-color: #e6f7ff;
  color: #000;
  font-weight: bold;
}

.el-button--small .el-icon {
  font-size: 14px;
}

.btn-no-border {
  border: none !important;
  box-shadow: none !important;
  background: transparent !important;
}

.btn-no-border:hover {
  background: rgba(0, 0, 0, 0.05) !important;
}

.btn-no-border.el-button--danger:hover {
  background: rgba(239, 68, 68, 0.1) !important;
}

/* 变量列表样式 */
.variable-list {
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  height: 400px;
  display: flex;
  flex-direction: column;
}

.list-header {
  padding: 12px;
  border-bottom: 1px solid #e4e7ed;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f5f7fa;
}

.list-title {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
}

.list-content {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

/* 类型分组样式 */
.type-group {
  margin-bottom: 16px;
}

.type-header {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  padding: 8px 0;
  border-bottom: 1px solid #e4e7ed;
}

.type-label {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
  margin-right: 8px;
}

.type-count {
  font-size: 12px;
  color: #909399;
  background-color: #f5f7fa;
  padding: 2px 8px;
  border-radius: 10px;
}

.variable-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.variable-item:hover {
  border-color: #409eff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.variable-name {
  font-size: 14px;
  color: #303133;
  font-weight: 500;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.empty-list {
  text-align: center;
  padding: 40px 0;
  color: #909399;
  font-size: 14px;
}

/* 编辑区域样式 */
.edit-form {
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  height: 400px;
  display: flex;
  flex-direction: column;
}

.form-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.empty-edit {
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f7fa;
}

.empty-tip {
  text-align: center;
  color: #909399;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
  color: #c0c4cc;
}

.empty-text {
  font-size: 14px;
}

/* 按钮区域样式 */
.button-area {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 10px 20px;
  border-top: 1px solid #e4e7ed;
  background-color: #fff;
  flex-shrink: 0;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .el-dialog {
    width: 90% !important;
  }

  .el-col {
    width: 100% !important;
  }

  .variable-list,
  .edit-form,
  .empty-edit {
    height: 300px;
  }

  .button-area {
    flex-direction: column;
    align-items: stretch;
  }

  .button-area .el-button {
    width: 100%;
  }
}
</style>
