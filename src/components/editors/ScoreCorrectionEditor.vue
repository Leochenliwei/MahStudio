<!--
  功能：分数修正编辑器弹窗 - 配置分数修正规则
  简化实现，支持 mock 数据
-->
<template>
  <el-dialog
    v-model="dialogVisible"
    title="分数修正"
    width="700px"
    :close-on-click-modal="false"
    :before-close="handleClose"
  >
    <div class="score-correction-container">
      <el-form label-width="120px">
        <el-form-item label="修正名称">
          <el-input
            v-model="formData.name"
            placeholder="请输入修正名称"
          />
        </el-form-item>

        <el-form-item label="修正类型">
          <el-select v-model="formData.type" placeholder="请选择修正类型">
            <el-option label="固定加分" value="fixed_add" />
            <el-option label="固定减分" value="fixed_sub" />
            <el-option label="倍数加成" value="multiplier" />
            <el-option label="百分比加成" value="percentage" />
          </el-select>
        </el-form-item>

        <el-form-item label="修正值">
          <el-input-number
            v-model="formData.value"
            :min="-9999"
            :max="9999"
            :step="1"
            placeholder="请输入修正值"
          />
        </el-form-item>

        <el-form-item label="目标玩家">
          <el-select v-model="formData.target" placeholder="请选择目标玩家">
            <el-option label="赢家" value="winner" />
            <el-option label="输家" value="loser" />
            <el-option label="所有玩家" value="all" />
            <el-option label="庄家" value="zhuang" />
            <el-option label="闲家" value="xian" />
          </el-select>
        </el-form-item>

        <el-form-item label="触发条件">
          <el-input
            v-model="formData.condition"
            type="textarea"
            :rows="3"
            placeholder="请输入触发条件表达式，如：胡牌类型 == '自摸'"
          />
        </el-form-item>

        <el-form-item label="优先级">
          <el-slider
            v-model="formData.priority"
            :min="1"
            :max="10"
            show-stops
          />
        </el-form-item>

        <el-form-item label="是否启用">
          <el-switch v-model="formData.enabled" />
        </el-form-item>

        <el-form-item label="说明">
          <el-input
            v-model="formData.description"
            type="textarea"
            :rows="2"
            placeholder="请输入修正规则的说明"
          />
        </el-form-item>
      </el-form>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'

// 属性定义
const props = defineProps<{
  visible: boolean
  initData?: {
    name?: string
    type?: string
    value?: number
    target?: string
    condition?: string
    priority?: number
    enabled?: boolean
    description?: string
  }
}>()

// 事件定义
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'confirm', value: any): void
}>()

const dialogVisible = ref(false)

// 表单数据
const formData = reactive({
  name: '',
  type: 'fixed_add',
  value: 0,
  target: 'winner',
  condition: '',
  priority: 5,
  enabled: true,
  description: '',
})

// 初始化数据
const initData = () => {
  if (props.initData) {
    formData.name = props.initData.name || ''
    formData.type = props.initData.type || 'fixed_add'
    formData.value = props.initData.value || 0
    formData.target = props.initData.target || 'winner'
    formData.condition = props.initData.condition || ''
    formData.priority = props.initData.priority || 5
    formData.enabled = props.initData.enabled !== false
    formData.description = props.initData.description || ''
  } else {
    // 重置默认值
    formData.name = ''
    formData.type = 'fixed_add'
    formData.value = 0
    formData.target = 'winner'
    formData.condition = ''
    formData.priority = 5
    formData.enabled = true
    formData.description = ''
  }
}

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
  const result = {
    name: formData.name,
    type: formData.type,
    value: formData.value,
    target: formData.target,
    condition: formData.condition,
    priority: formData.priority,
    enabled: formData.enabled,
    description: formData.description,
  }

  console.log('分数修正编辑结果', result)
  emit('confirm', result)
}
</script>

<style scoped lang="scss">
.score-correction-container {
  max-height: 500px;
  overflow-y: auto;
  padding: 0 10px;
}

.dialog-footer {
  display: flex;
  justify-content: center;
  gap: 15px;
}
</style>