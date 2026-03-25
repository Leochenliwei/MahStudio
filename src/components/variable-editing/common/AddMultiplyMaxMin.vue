<template>
  <div>
    <div style="width: 100%; margin-bottom: 12px">
      组内元素
      <el-button type="primary" size="small" style="margin-left: 8px" @click="handleAdd">添加元素</el-button>
    </div>
    <div v-for="(item, index) in groupItems" :key="index" class="group-item">
      <div style="width: 250px; margin-right: 8px">
        <!-- 使用简单的输入框替代 ConfigFormulaNum -->
        <el-input 
          v-model="item.var" 
          :placeholder="'可直接选择对象'" 
        />
      </div>
      <span style="margin-right: 8px">{{ props.type === 2 ? '*' : '的值为' }}</span>
      <div style="width: 250px; margin-right: 8px">
        <el-input v-model="item.value" placeholder="请输入数值" />
      </div>
      <el-button type="text" size="small" class="btn-no-border" @click="handleEdit(item)">
        <el-icon><DocumentCopy /></el-icon>
      </el-button>
      <el-button type="text" size="small" class="btn-no-border el-button--danger" @click="handleDelete(index)">
        <el-icon><Delete /></el-icon>
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Delete, DocumentCopy } from '@element-plus/icons-vue'

/**
 * 组内计算编辑器组件
 * 用于配置组内相加、相乘、取最大、取最小类型的变量
 * 
 * @author 迁移自资料目录
 * @date 2026-03-20
 */

// 定义 emit
const emit = defineEmits(['update:modelValue', 'input'])

const props = defineProps<{
  type: number
  modelValue: any[]
}>()

// 标志位：区分是 props 更新还是用户操作
let isFromProps = false

// 使用 props 的 modelValue 初始化 groupItems
const groupItems = ref(
  props.modelValue && props.modelValue.length > 0 ? [...props.modelValue] : [{ var: '', value: '' }],
)

// 监听内部数据变化并同步给父组件
watch(
  groupItems,
  newVal => {
    // 只有用户操作才触发 update:modelValue 和 input 事件
    if (!isFromProps) {
      emit('update:modelValue', newVal)
      emit('input')
    }
    // 重置标志位
    isFromProps = false
  },
  { deep: true, flush: 'post' }, // 添加 flush: 'post' 确保在 DOM 更新后触发
)

// 如果父组件传入新的 modelValue，则更新本地数据
watch(
  () => props.modelValue,
  newVal => {
    if (JSON.stringify(newVal) !== JSON.stringify(groupItems.value)) {
      // 设置标志位，表示这是 props 更新
      isFromProps = true
      groupItems.value = newVal && newVal.length > 0 ? [...newVal] : [{ var: '', value: '' }]
    }
  },
)

/**
 * 添加新元素
 * 在组内元素列表末尾添加一个新的空元素
 */
const handleAdd = () => {
  groupItems.value.push({ var: '', value: '' })
}

/**
 * 复制元素
 * 复制当前项并添加到列表末尾
 * @param {any} item - 要复制的元素
 */
const handleEdit = (item: any) => {
  // 复制当前项
  const newItem = { ...item }
  groupItems.value.push(newItem)
}

/**
 * 删除元素
 * 从组内元素列表中删除指定索引的元素
 * @param {number} index - 要删除的元素索引
 */
const handleDelete = (index: number) => {
  groupItems.value.splice(index, 1)
}
</script>

<style scoped>
.group-item {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
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

.el-button--small .el-icon {
  font-size: 14px;
}
</style>
