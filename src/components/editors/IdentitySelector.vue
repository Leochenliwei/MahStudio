<!--
  功能：身份选择器组件
  用于表达式输入框中切换游戏元素的身份
  关联需求：表达式输入框嵌套标签块优化 - 身份选择
-->
<template>
  <div
    v-if="visible"
    class="identity-selector-dropdown"
    :style="dropdownStyle"
    ref="dropdownRef"
  >
    <div class="identity-selector-header">
      <span class="title">选择身份</span>
      <el-icon class="close-icon" @click="close"><Close /></el-icon>
    </div>
    <div class="identity-options">
      <div
        v-for="option in identityOptions"
        :key="option.key"
        class="identity-option"
        :class="{
          'is-selected': modelValue === option.key,
          'is-generic': option.isGeneric
        }"
        @click="selectIdentity(option)"
      >
        <span class="identity-name">{{ option.name }}</span>
        <span v-if="option.isGeneric" class="generic-badge">*</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Close } from '@element-plus/icons-vue'

/**
 * 身份选项类型
 */
interface IdentityOption {
  key: string
  name: string
  isGeneric: boolean
  isDefault?: boolean
}

// ==================== Props & Emits ====================
const props = defineProps<{
  modelValue: string  // 当前选中的身份key
  visible: boolean    // 是否显示
  triggerRef?: HTMLElement  // 触发元素引用，用于定位
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'update:visible': [value: boolean]
  'select': [option: IdentityOption]
}>()

// ==================== 状态 ====================
const dropdownRef = ref<HTMLElement>()

/**
 * 身份选项列表
 */
const identityOptions: IdentityOption[] = [
  { key: 'cur_player', name: '当前玩家', isGeneric: false, isDefault: true },
  { key: 'winner', name: '当前赢家', isGeneric: false },
  { key: 'dealer', name: '庄家', isGeneric: false },
  { key: 'all_xian', name: '所有闲家', isGeneric: false },
  { key: 'all_players', name: '所有玩家', isGeneric: false },
  { key: 'other_players', name: '其他玩家', isGeneric: false }
]

// ==================== 计算属性 ====================
/**
 * Dropdown 定位样式
 */
const dropdownStyle = computed(() => {
  if (!props.triggerRef) return {}

  const rect = props.triggerRef.getBoundingClientRect()
  const dropdownWidth = 200
  const dropdownHeight = 280

  // 计算位置，优先显示在触发元素下方
  let top = rect.bottom + 4
  let left = rect.left

  // 如果下方空间不足，显示在上方
  if (top + dropdownHeight > window.innerHeight) {
    top = rect.top - dropdownHeight - 4
  }

  // 确保不超出视口右边界
  if (left + dropdownWidth > window.innerWidth) {
    left = window.innerWidth - dropdownWidth - 8
  }

  return {
    position: 'fixed',
    top: `${top}px`,
    left: `${left}px`,
    width: `${dropdownWidth}px`,
    zIndex: 10001  // 提升层级，确保在元素选择器之上
  }
})

// ==================== 方法 ====================
/**
 * 选择身份
 * @param option 身份选项
 */
const selectIdentity = (option: IdentityOption) => {
  emit('update:modelValue', option.key)
  emit('select', option)
  close()
}

/**
 * 关闭选择器
 */
const close = () => {
  emit('update:visible', false)
}

/**
 * 点击外部关闭
 * @param e 鼠标事件
 */
const handleClickOutside = (e: MouseEvent) => {
  if (!dropdownRef.value?.contains(e.target as Node)) {
    close()
  }
}

// ==================== Lifecycle ====================
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped lang="scss">
@use "sass:color";

// ==================== 变量定义 ====================
$primary-color: #3b82f6;
$primary-light: #eff6ff;
$warning-color: #f59e0b;
$warning-light: #fffbeb;
$border-color: #e5e7eb;
$text-primary: #374151;
$text-secondary: #6b7280;

// ==================== Dropdown 容器 ====================
.identity-selector-dropdown {
  background: #ffffff;
  border: 1px solid $border-color;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

// ==================== 头部 ====================
.identity-selector-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid $border-color;
  background: #fafafa;

  .title {
    font-size: 14px;
    font-weight: 600;
    color: $text-primary;
  }

  .close-icon {
    font-size: 16px;
    color: $text-secondary;
    cursor: pointer;
    transition: color 0.15s ease;

    &:hover {
      color: $primary-color;
    }
  }
}

// ==================== 选项列表 ====================
.identity-options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  padding: 12px;
}

// ==================== 选项项 ====================
.identity-option {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 10px 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s ease;
  border: 1px solid transparent;

  // 普通身份 - 蓝色系
  background: $primary-light;
  color: $primary-color;

  &:hover {
    background: color.adjust($primary-light, $lightness: -5%);
    border-color: color.adjust($primary-color, $lightness: 20%);
  }

  // 选中状态
  &.is-selected {
    background: $primary-color;
    color: #ffffff;
    border-color: $primary-color;

    &:hover {
      background: color.adjust($primary-color, $lightness: -5%);
    }
  }

  // 泛身份 - 橙色系
  &.is-generic {
    background: $warning-light;
    color: $warning-color;

    &:hover {
      background: color.adjust($warning-light, $lightness: -5%);
      border-color: color.adjust($warning-color, $lightness: 20%);
    }

    &.is-selected {
      background: $warning-color;
      color: #ffffff;
      border-color: $warning-color;

      &:hover {
        background: color.adjust($warning-color, $lightness: -5%);
      }
    }
  }
}

.identity-name {
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
}

.generic-badge {
  font-size: 12px;
  font-weight: 600;
  opacity: 0.8;
}
</style>
