<template>
  <el-transfer
    filterable
    :filter-placeholder="'搜索...'"
    v-model="transferValue"
    :data="formattedData"
    :titles="[leftTitle, rightTitle]"
    :disabled="isReadOnly"
    @change="handleChange"
  />
</template>

<script setup>
/**
 * Transfer.vue - 穿梭框组件
 * 
 * 需求关联：
 * 1. 实现游戏属性编辑界面中的APK选择功能
 * 2. 支持左右两侧数据的展示和选择
 * 3. 支持数据的搜索和筛选
 * 4. 支持自定义标题和数据结构
 * 5. 支持直接使用id数组作为modelValue
 * 
 * @author Frontend Architect
 * @since 2026-03-02
 */

import { ref, computed, watch } from 'vue'

// ==================== Props ====================

const props = defineProps({
  /**
   * 左侧数据源
   * @type {Array}
   */
  data: {
    type: Array,
    default: () => []
  },
  /**
   * 已选择的id数组
   * @type {Array}
   */
  modelValue: {
    type: Array,
    default: () => []
  },
  /**
   * 左侧标题
   * @type {string}
   */
  leftTitle: {
    type: String,
    default: '可用选项'
  },
  /**
   * 右侧标题
   * @type {string}
   */
  rightTitle: {
    type: String,
    default: '已选择'
  },
  /**
   * 数据项的键字段
   * @type {string}
   */
  keyProp: {
    type: String,
    default: 'id'
  },
  /**
   * 数据项的标签字段
   * @type {string}
   */
  labelProp: {
    type: String,
    default: 'name'
  },
  /**
   * 是否为只读模式
   * @type {boolean}
   */
  isReadOnly: {
    type: Boolean,
    default: false
  }
})

// ==================== Emits ====================

const emit = defineEmits([
  /**
   * 数据变化事件
   * @param {Array} value - 新的已选择id数组
   */
  'update:modelValue'
])

// ==================== 状态管理 ====================

/**
 * 穿梭框绑定值（存储选中项的key）
 * @type {Array}
 */
const transferValue = ref([])

// ==================== 计算属性 ====================

/**
 * 格式化后的数据，符合Element Plus Transfer组件要求
 * @returns {Array}
 */
const formattedData = computed(() => {
  return props.data.map((item, index) => {
    const key = getItemKey(item)
    const label = getItemLabel(item)
    return {
      label: label,
      key: key,
      // 添加原始数据，便于后续处理
      raw: item
    }
  })
})

// ==================== 方法函数 ====================

/**
 * 获取数据项的键值
 * @param {Object} item - 数据项
 * @returns {any} 键值
 */
function getItemKey(item) {
  // 优先使用props.keyProp指定的字段
  if (item[props.keyProp] !== undefined && item[props.keyProp] !== null) {
    return item[props.keyProp]
  }
  // 其次使用id字段
  if (item.id !== undefined && item.id !== null) {
    return item.id
  }
  // 再次使用apk_id字段
  if (item.apk_id !== undefined && item.apk_id !== null) {
    return item.apk_id
  }
  // 最后使用apkname字段或索引
  if (item.apkname !== undefined && item.apkname !== null) {
    return item.apkname
  }
  // 如果以上都不存在，使用name字段
  if (item.name !== undefined && item.name !== null) {
    return item.name
  }
  // 作为最后的 fallback，使用对象的字符串表示
  return JSON.stringify(item)
}

/**
 * 获取数据项的标签
 * @param {Object} item - 数据项
 * @returns {string} 标签
 */
function getItemLabel(item) {
  return item[props.labelProp] || '未知'
}

// ==================== 监听 ====================

// 监听props.modelValue变化，更新transferValue
watch(() => props.modelValue, (newValue) => {
  console.log('Transfer modelValue changed:', newValue)
  if (Array.isArray(newValue)) {
    // 直接使用传入的id数组作为transferValue
    transferValue.value = [...newValue]
    console.log('Transfer value updated:', transferValue.value)
  } else {
    transferValue.value = []
    console.log('Transfer value cleared')
  }
}, { deep: true, immediate: true })

/**
 * 处理穿梭框值变化
 * @param {Array} value - 新的选中值
 */
function handleChange(value) {
  console.log('Transfer change event:', value)
  emit('update:modelValue', value)
  console.log('Transfer update emitted:', value)
}
</script>

<style scoped>
/* 可以根据需要添加自定义样式 */
</style>