<!--
  功能：编辑器弹窗容器 - 统一管理所有编辑器弹窗
  根据 editorType 动态渲染对应的编辑器组件
-->
<template>
  <div class="editor-dialog-container">
    <!-- 牌堆选择器弹窗 -->
    <MahjongStackDialog
      v-model:visible="dialogState.mahjongstack.visible"
      :init-data="dialogState.mahjongstack.data"
      @confirm="handleConfirm('mahjongstack', $event)"
      @close="handleClose('mahjongstack')"
    />

    <!-- 算分公式编辑器弹窗 -->
    <ScoreCalculationFormulaEditing
      v-model:visible="dialogState.calscore.visible"
      :cfg-id="dialogState.calscore.cfgId"
      :init-data="dialogState.calscore.data"
      :extend-config="dialogState.calscore.extendConfig"
      @confirm="handleConfirm('calscore', $event)"
      @close="handleClose('calscore')"
    />

    <!-- 动作约束编辑器弹窗 -->
    <MotionConstraintEditor
      v-model:visible="dialogState.motionconstraint.visible"
      :init-data="dialogState.motionconstraint.data"
      @confirm="handleConfirm('motionconstraint', $event)"
      @close="handleClose('motionconstraint')"
    />

    <!-- 分数修正编辑器弹窗 -->
    <ScoreCorrectionEditor
      v-model:visible="dialogState.correctscore.visible"
      :init-data="dialogState.correctscore.data"
      @confirm="handleConfirm('correctscore', $event)"
      @close="handleClose('correctscore')"
    />

    <!-- 番型配置编辑器弹窗 -->
    <FanXingDialog
      v-model:visible="dialogState.fanxingselect.visible"
      :init-data="dialogState.fanxingselect.data"
      @confirm="handleConfirm('fanxingselect', $event)"
      @close="handleClose('fanxingselect')"
    />

    <!-- 动作限制编辑器弹窗 -->
    <ActionLimitEditor
      v-model:visible="dialogState.actionlimit.visible"
      :init-data="dialogState.actionlimit.data"
      @confirm="handleConfirm('actionlimit', $event)"
      @close="handleClose('actionlimit')"
    />
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import MahjongStackDialog from './MahjongStackDialog.vue'
import ScoreCalculationFormulaEditing from './ScoreCalculationFormulaEditing.vue'
import MotionConstraintEditor from './MotionConstraintEditor.vue'
import ScoreCorrectionEditor from './ScoreCorrectionEditor.vue'
import FanXingDialog from './FanXingDialog.vue'
import ActionLimitEditor from './ActionLimitEditor.vue'

// 编辑器类型定义
type EditorType = 'mahjongstack' | 'calscore' | 'motionconstraint' | 'correctscore' | 'fanxingselect' | 'actionlimit'

// 弹窗状态接口
interface DialogState {
  [key: string]: {
    visible: boolean
    data?: any
    cfgId?: number
    extendConfig?: any
  }
}

// 弹窗状态管理
const dialogState = reactive<DialogState>({
  mahjongstack: { visible: false, data: null },
  calscore: { visible: false, data: null, cfgId: 0, extendConfig: null },
  motionconstraint: { visible: false, data: null },
  correctscore: { visible: false, data: null },
  fanxingselect: { visible: false, data: null },
  actionlimit: { visible: false, data: null },
})

// 当前打开的编辑器信息
let currentEditor: {
  type: EditorType
  propertyId: string
  callback?: (value: any) => void
} | null = null

/**
 * 打开编辑器弹窗
 * @param type 编辑器类型
 * @param propertyId 属性ID
 * @param initData 初始数据
 * @param callback 确认回调
 */
function openEditor(
  type: EditorType,
  propertyId: string,
  initData?: any,
  callback?: (value: any) => void
) {
  currentEditor = { type, propertyId, callback }

  switch (type) {
    case 'mahjongstack':
      dialogState.mahjongstack.data = initData || { defaultSelect: [] }
      dialogState.mahjongstack.visible = true
      break
    case 'calscore':
      dialogState.calscore.data = initData || { defaultSelect: [] }
      dialogState.calscore.cfgId = initData?.cfgId || 0
      dialogState.calscore.extendConfig = initData?.extendConfig || null
      dialogState.calscore.visible = true
      break
    case 'motionconstraint':
      dialogState.motionconstraint.data = initData || {}
      dialogState.motionconstraint.visible = true
      break
    case 'correctscore':
      dialogState.correctscore.data = initData || {}
      dialogState.correctscore.visible = true
      break
    case 'fanxingselect':
      dialogState.fanxingselect.data = initData || { defaultSelect: [] }
      dialogState.fanxingselect.visible = true
      break
    case 'actionlimit':
      dialogState.actionlimit.data = initData || { limit_list: [] }
      dialogState.actionlimit.visible = true
      break
    default:
      console.warn(`未知的编辑器类型: ${type}`)
  }
}

/**
 * 关闭编辑器弹窗
 * @param type 编辑器类型
 */
function handleClose(type: EditorType) {
  dialogState[type].visible = false
  currentEditor = null
}

/**
 * 确认编辑器弹窗
 * @param type 编辑器类型
 * @param value 编辑值
 */
function handleConfirm(type: EditorType, value: any) {
  dialogState[type].visible = false

  if (currentEditor?.callback) {
    currentEditor.callback(value)
  }

  currentEditor = null
}

// 暴露方法给父组件
defineExpose({
  openEditor,
})
</script>

<style scoped lang="scss">
.editor-dialog-container {
  /* 容器样式 */
}
</style>
