<template>
  <svg
    :width="size"
    :height="size"
    :class="classes"
    :style="{ color: color }"
    aria-hidden="true"
  >
    <use :xlink:href="spriteUrl + '#' + props.name" />
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
  // @vite-ignore
  return new URL('../assets/icons/sprite.svg', import.meta.url).href
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
}
</style>