<template>
  <svg
    :width="size"
    :height="size"
    :class="classes"
    :style="{ color: color }"
    aria-hidden="true"
  >
    <use :href="spriteUrl + '#' + props.name" />
  </svg>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  size: {
    type: [Number, String],
    default: 20
  },
  color: {
    type: String,
    default: 'currentColor'
  },
  class: {
    type: String,
    default: ''
  }
})

const spriteUrl = computed(() => {
  // 使用基于public目录的相对路径，包含base路径
  return '/MahStudio/icons/sprite.svg'
})

const classes = computed(() => {
  return props.class
})
</script>

<style scoped>
/* 图标组件样式 */
svg {
  display: inline-block;
  vertical-align: middle;
  fill: currentColor;
  stroke: currentColor;
  width: v-bind(size);
  height: v-bind(size);
}

/* 确保use元素能正确显示 */
svg use {
  fill: currentColor;
  stroke: currentColor;
}
</style>