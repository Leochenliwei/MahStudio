<!--
  功能：动作约束编辑器弹窗 - 配置动作限制规则
  简化实现，支持 mock 数据
-->
<template>
  <el-dialog
    v-model="dialogVisible"
    title="动作约束"
    width="700px"
    :close-on-click-modal="false"
    :before-close="handleClose"
  >
    <div class="motion-constraint-container">
      <el-form label-width="120px">
        <el-form-item label="约束名称">
          <el-input
            v-model="formData.name"
            placeholder="请输入约束名称"
          />
        </el-form-item>

        <el-form-item label="约束类型">
          <el-select v-model="formData.type" placeholder="请选择约束类型">
            <el-option label="禁止动作" value="forbid" />
            <el-option label="强制动作" value="force" />
            <el-option label="条件动作" value="condition" />
          </el-select>
        </el-form-item>

        <el-form-item label="动作列表">
          <el-checkbox-group v-model="formData.actions">
            <el-checkbox label="chupai">出牌</el-checkbox>
            <el-checkbox label="peng">碰</el-checkbox>
            <el-checkbox label="gang">杠</el-checkbox>
            <el-checkbox label="hu">胡</el-checkbox>
            <el-checkbox label="chi">吃</el-checkbox>
            <el-checkbox label="guo">过</el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="条件表达式">
          <el-input
            v-model="formData.condition"
            type="textarea"
            :rows="3"
            placeholder="请输入条件表达式，如：手牌数 > 13"
          />
        </el-form-item>

        <el-form-item label="生效时机">
          <el-select v-model="formData.timing" placeholder="请选择生效时机">
            <el-option label="游戏开始时" value="game_start" />
            <el-option label="回合开始时" value="round_start" />
            <el-option label="摸牌后" value="after_draw" />
            <el-option label="出牌后" value="after_play" />
            <el-option label="任何时候" value="always" />
          </el-select>
        </el-form-item>

        <el-form-item label="提示信息">
          <el-input
            v-model="formData.message"
            placeholder="请输入违反约束时的提示信息"
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
    actions?: string[]
    condition?: string
    timing?: string
    message?: string
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
  type: 'forbid',
  actions: [] as string[],
  condition: '',
  timing: 'always',
  message: '',
})

// 初始化数据
const initData = () => {
  if (props.initData) {
    formData.name = props.initData.name || ''
    formData.type = props.initData.type || 'forbid'
    formData.actions = props.initData.actions || []
    formData.condition = props.initData.condition || ''
    formData.timing = props.initData.timing || 'always'
    formData.message = props.initData.message || ''
  } else {
    // 重置默认值
    formData.name = ''
    formData.type = 'forbid'
    formData.actions = []
    formData.condition = ''
    formData.timing = 'always'
    formData.message = ''
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
    actions: formData.actions,
    condition: formData.condition,
    timing: formData.timing,
    message: formData.message,
  }

  console.log('动作约束编辑结果', result)
  emit('confirm', result)
}
</script>

<style scoped lang="scss">
.motion-constraint-container {
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