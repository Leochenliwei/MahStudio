<template>
  <div>
    <div style="width: 100%">{{ typeName[props.type] }}</div>
    <!-- 使用简单的文本域替代 ConfigFormulaPure -->
    <el-input
      :model-value="modelValue"
      type="textarea"
      :rows="4"
      width="100%"
      placeholder="请输入条件表达式"
      @input="handleChange"
    />
    <div style="width: 100%; margin-top: 8px">是否成立</div>
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue'

/**
 * 条件表达式编辑器组件
 * 用于配置判断是否成立、依次判断、累加、累乘类型的变量
 * 
 * @author 迁移自资料目录
 * @date 2026-03-20
 */

interface Props {
  modelValue: any
  type: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: any]
  change: [value: any]
  input: []
}>()

// 标志位：区分是 props 更新还是用户操作
let isFromProps = false

/**
 * 类型名称映射
 * 将类型编号映射为对应的中文名称
 */
const typeName: Record<number, string> = {
  5: '判断是否成立',
  6: '依次判断',
  7: '依次判断是否成立(且)',
  8: '任一条件成立(或)',
  9: '累加',
  10: '累乘',
}

/**
 * 处理输入变化
 * 当用户在文本域中输入时触发
 * @param {string} val - 输入的值
 */
const handleChange = (val: string) => {
  // 只有用户操作才触发事件
  if (!isFromProps) {
    emit('update:modelValue', val)
    emit('change', val)
    emit('input')
  }
  // 重置标志位
  isFromProps = false
}

// 监听props变化，设置标志位
watch(
  () => props.modelValue,
  () => {
    isFromProps = true
  },
)
</script>
