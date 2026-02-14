<template>
  <div class="component-preview">
    <div class="comp-tag">{{ getComponentTypeText(component.type) }}</div>
    <div class="comp-options">
      <div 
        v-for="(option, optIndex) in component.options" 
        :key="optIndex"
        class="comp-tag"
      >
        {{ option.label }}
      </div>
    </div>
  </div>
</template>

<script setup>
// 定义props
const props = defineProps({
  component: {
    type: Object,
    required: true
  }
})

/**
 * 获取组件类型文本
 * @param {string} type - 组件类型
 * @returns {string} 组件类型的中文描述
 */
function getComponentTypeText(type) {
  const typeMap = {
    'radio': '单选',
    'checkbox': '复选',
    'select': '下拉列表',
    'select-switch': '下拉&开关'
  }
  return typeMap[type] || type
}
</script>

<style scoped>
.component-preview {
  display: flex;
  gap: 10px;
  align-items: center;
}

.comp-tag {
  font-size: 12px;
  background: #fff;
  padding: 2px 5px;
  border-radius: 2px;
  border: 1px solid #ddd;
}

.comp-options {
  display: flex;
  gap: 5px;
}
</style>