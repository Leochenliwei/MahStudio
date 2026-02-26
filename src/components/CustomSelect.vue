<template>
  <div class="custom-select" :class="{ 'is-open': isOpen }">
    <div class="select-trigger" ref="triggerRef" @click="toggleDropdown">
      <span class="trigger-text">{{ displayValue }}</span>
      <span class="trigger-icon">▼</span>
    </div>
    
    <div 
      v-if="isOpen" 
      class="select-dropdown"
      :style="dropdownStyle"
    >
      <div class="dropdown-header">
        <input 
          type="text" 
          v-model="searchKeyword" 
          placeholder="请输入关键词" 
          class="search-input"
          @click.stop
        >
      </div>
      
      <div class="dropdown-body" v-if="tabs && tabs.length > 0">
        <div class="tabs-container">
          <div 
            v-for="(tab, index) in tabs" 
            :key="index"
            v-if="!disabledTabs.includes(index)"
            class="tab-item"
            :class="{ 'is-active': activeTab === index }"
            @click.stop="switchTab(index)"
          >
            {{ tab.label }}
          </div>
        </div>
        
        <div class="options-list">
          <div 
            v-for="(option, index) in filteredOptions" 
            :key="index"
            class="option-item"
            :class="{ 'is-selected': isSelected(option) }"
            @click.stop="selectOption(option)"
          >
            {{ option[labelKey] }}
          </div>
          <div v-if="filteredOptions.length === 0" class="empty-tip">
            暂无匹配选项
          </div>
        </div>
      </div>
      
      <div v-else class="options-list">
        <div 
          v-for="(option, index) in filteredOptions" 
          :key="index"
          class="option-item"
          :class="{ 'is-selected': isSelected(option) }"
          @click.stop="selectOption(option)"
        >
          {{ option[labelKey] }}
        </div>
        <div v-if="filteredOptions.length === 0" class="empty-tip">
          暂无匹配选项
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onUnmounted } from 'vue'

// 全局变量，用于跟踪当前打开的弹窗实例
if (!window.__CustomSelectState) {
  window.__CustomSelectState = {
    currentOpenSelect: null
  }
}

/**
 * 自定义下拉选择框组件
 * 支持搜索、分类标签、多选/单选功能
 * 
 * @param {Array} options - 选项数组
 * @param {Array} tabs - 分类标签数组，格式：[{ label: '标签名', filter: (option) => boolean }]
 * @param {String} modelValue - 选中值
 * @param {String} placeholder - 占位文字
 * @param {String} valueKey - 选项值字段名，默认 'value'
 * @param {String} labelKey - 选项显示字段名，默认 'label'
 * @param {Boolean} multiple - 是否多选，默认 false
 */

const props = defineProps({
  options: {
    type: Array,
    default: () => [
      { value: 'qidui', label: '七对', category: 'pai_type',type:'bool' },
      { value: 'haohua_qidui', label: '豪华七对', category: 'pai_type',type:'bool' },
      { value: 'ziyise', label: '字一色（假胡）', category: 'pai_type',type:'bool' },
      { value: 'yinghu_deguo', label: '硬胡（德国）', category: 'pai_type',type:'bool' },
      { value: 'haidilaoyue', label: '海底捞月', category: 'pai_type',type:'bool' },
      { value: 'yitiaolong', label: '一条龙', category: 'pai_type',type:'bool' },
      { value: 'zhuangjia', label: '庄家', category: 'shenfen', type: 'bool' },
      { value: 'xianjia', label: '闲家', category: 'shenfen', type: 'bool' },
      { value: 'zimo', label: '自摸', category: 'pai_type',type:'bool' },
      { value: 'fangpao', label: '点炮', category: 'zhuangtai',type:'bool' },
      { value: 'chi_count', label: '吃的次数', category: 'zhuangtai',type:'int' },
      { value: 'gang_count', label: '杠的次数', category: 'zhuangtai',type:'int' },
      { value: 'laizi_gang_count', label: '赖子杠的次数', category: 'zhuangtai',type:'int' },
       { value: 'touzi', label: '本局两颗骰子点数相同', category: 'paiju',type:'bool' },
      { value: 'peng_count', label: '碰的次数', category: 'zhuangtai',type:'int' },
      { value: '1', label: '1', category: 'num',type:'int' },
      { value: '2', label: '2', category: 'num',type:'int' },
      { value: '3', label: '3', category: 'num',type:'int' },
      { value: '4', label: '4', category: 'num',type:'int' },
      { value: '5', label: '5', category: 'num',type:'int' },
      { value: '6', label: '6', category: 'num',type:'int' },
      { value: '7', label: '7', category: 'num',type:'int' },
      { value: '8', label: '8', category: 'num',type:'int' },
      { value: '9', label: '9', category: 'num',type:'int' }
    ]
  },
  tabs: {
    type: Array,
    default: () => [
       { label: '身份', filter: (opt) => opt.category === 'shenfen' },
      { label: '状态', filter: (opt) => opt.category === 'zhuangtai' },
      { label: '牌局', filter: (opt) => opt.category === 'paiju' },
      { label: '番种 ', filter: (opt) => opt.category === 'pai_type' },
      { label: '选项', filter: (opt) => opt.category === 'operation' },
      { label: '数字', filter: (opt) => opt.category === 'num' }
    ]
  },
  
  modelValue: {
    type: [String, Number, Array],
    default: ''
  },
  placeholder: {
    type: String,
    default: '请选择'
  },
  valueKey: {
    type: String,
    default: 'value'
  },
  labelKey: {
    type: String,
    default: 'label'
  },
  multiple: {
    type: Boolean,
    default: false
  },
  disabledTabs: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)
const searchKeyword = ref('')
const activeTab = ref(0)
const triggerRef = ref(null)
const dropdownStyle = ref({})

// 创建组件实例引用
const instance = {
  closeDropdown: () => {}
}

/**
 * 找到第一个未被禁用的标签索引
 * @returns {number} - 第一个未被禁用的标签索引
 */
function findFirstEnabledTab() {
  for (let i = 0; i < props.tabs.length; i++) {
    if (!props.disabledTabs.includes(i)) {
      return i
    }
  }
  return 0
}

// 初始化时设置第一个未被禁用的标签为激活状态
activeTab.value = findFirstEnabledTab()

/**
 * 关闭下拉框
 */
function closeDropdown() {
  isOpen.value = false
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('resize', calculateDropdownPosition)
  window.removeEventListener('scroll', calculateDropdownPosition)
  if (window.__CustomSelectState.currentOpenSelect === instance) {
    window.__CustomSelectState.currentOpenSelect = null
  }
}

// 更新instance的closeDropdown方法
instance.closeDropdown = closeDropdown

/**
 * 计算下拉框位置
 */
function calculateDropdownPosition() {
  if (!triggerRef.value) return
  
  const rect = triggerRef.value.getBoundingClientRect()
  const dropdownHeight = 300 // 下拉框最大高度（包含头部和标签栏）
  const viewportHeight = window.innerHeight
  const viewportWidth = window.innerWidth
  
  // 计算下拉框的位置
  let top = rect.bottom + 4
  let left = rect.left
  
  // 检查是否超出屏幕底部
  if (top + dropdownHeight > viewportHeight) {
    // 如果向上显示的空间足够，则向上显示
    if (rect.top - dropdownHeight > 0) {
      top = rect.top - dropdownHeight - 4
    } else {
      // 否则调整到底部
      top = viewportHeight - dropdownHeight - 10
    }
  }
  
  // 检查是否超出屏幕右侧
  const dropdownWidth = Math.max(rect.width, 350) // 下拉框最小宽度
  if (left + dropdownWidth > viewportWidth) {
    left = viewportWidth - dropdownWidth - 10
  }
  
  // 确保不小于0
  top = Math.max(10, top)
  left = Math.max(10, left)
  
  dropdownStyle.value = {
    position: 'fixed',
    top: `${top + window.scrollY}px`,
    left: `${left + window.scrollX}px`,
    width: `${rect.width}px`
  }
}

/**
 * 切换下拉框显示/隐藏
 */
function toggleDropdown() {
  // 如果当前弹窗已经打开，则关闭
  if (isOpen.value) {
    closeDropdown()
    return
  }
  
  // 关闭其他已打开的弹窗
  if (window.__CustomSelectState.currentOpenSelect && window.__CustomSelectState.currentOpenSelect !== instance) {
    window.__CustomSelectState.currentOpenSelect.closeDropdown()
  }
  
  // 标记当前弹窗为打开状态
  window.__CustomSelectState.currentOpenSelect = instance
  
  isOpen.value = true
  searchKeyword.value = ''
  document.addEventListener('click', handleClickOutside)
  nextTick(() => {
    calculateDropdownPosition()
    // 监听窗口大小变化和滚动，重新计算位置
    window.addEventListener('resize', calculateDropdownPosition)
    window.addEventListener('scroll', calculateDropdownPosition)
  })
}

/**
 * 点击外部关闭下拉框
 */
function handleClickOutside(event) {
  closeDropdown()
}

/**
 * 切换标签
 * @param {number} index - 标签索引
 */
function switchTab(index) {
  // 只有当标签未被禁用时才切换
  if (!props.disabledTabs.includes(index)) {
    activeTab.value = index
  }
}

/**
 * 根据标签和搜索关键词过滤选项
 */
const filteredOptions = computed(() => {
  let result = [...props.options]
  
  // 确保 tabs 存在且当前标签页索引有效
  if (props.tabs && props.tabs.length > 0) {
    // 检查当前激活的标签是否被禁用，如果是则切换到第一个可用标签
    if (props.disabledTabs.includes(activeTab.value)) {
      activeTab.value = findFirstEnabledTab()
    }
    
    const currentTab = props.tabs[activeTab.value]
    if (currentTab && currentTab.filter) {
      result = result.filter(currentTab.filter)
    }
  }
  
  if (searchKeyword.value.trim()) {
    const keyword = searchKeyword.value.trim().toLowerCase()
    result = result.filter(option => 
      String(option[props.labelKey]).toLowerCase().includes(keyword)
    )
  }
  
  return result
})

/**
 * 显示值
 */
const displayValue = computed(() => {
  if (!props.modelValue) {
    return props.placeholder
  }
  
  if (props.multiple && Array.isArray(props.modelValue)) {
    const selectedOptions = props.options.filter(opt => 
      props.modelValue.includes(opt[props.valueKey])
    )
    return selectedOptions.map(opt => opt[props.labelKey]).join(', ') || props.placeholder
  }
  
  const selectedOption = props.options.find(opt => opt[props.valueKey] === props.modelValue)
  return selectedOption ? selectedOption[props.labelKey] : props.placeholder
})

/**
 * 判断选项是否被选中
 */
function isSelected(option) {
  if (props.multiple && Array.isArray(props.modelValue)) {
    return props.modelValue.includes(option[props.valueKey])
  }
  return props.modelValue === option[props.valueKey]
}

/**
 * 选择选项
 */
function selectOption(option) {
  let newValue
  
  if (props.multiple) {
    const currentValues = Array.isArray(props.modelValue) ? [...props.modelValue] : []
    const index = currentValues.indexOf(option[props.valueKey])
    if (index > -1) {
      currentValues.splice(index, 1)
    } else {
      currentValues.push(option[props.valueKey])
    }
    newValue = currentValues
  } else {
    newValue = option[props.valueKey]
    closeDropdown()
  }
  
  emit('update:modelValue', newValue)
}
</script>

<style scoped>
.custom-select {
  position: relative;
  width: 100%;
}

.select-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-3) var(--spacing-4);
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: all var(--transition-normal);
}

.select-trigger:hover {
  border-color: var(--color-primary);
}

.trigger-text {
  color: var(--color-text-primary);
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.trigger-icon {
  color: var(--color-text-tertiary);
  font-size: 10px;
  transition: transform var(--transition-normal);
}

.custom-select.is-open .trigger-icon {
  transform: rotate(180deg);
}

.select-dropdown {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-lg);
  z-index: 1100;
  min-width: 350px;
  max-height: 400px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.dropdown-header {
  padding: var(--spacing-2);
  border-bottom: 1px solid var(--color-border);
}

.dropdown-body {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.search-input {
  width: 100%;
  padding: var(--spacing-2) var(--spacing-2);
  background-color: var(--color-surface-hover);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
  transition: all var(--transition-normal);
}

.search-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(100, 108, 255, 0.2);
}

.tabs-container {
  width: 100px;
  border-right: 1px solid var(--color-border);
  background-color: var(--color-surface-hover);
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: var(--color-border) var(--color-surface-hover);
}

.tabs-container::-webkit-scrollbar {
  width: 4px;
}

.tabs-container::-webkit-scrollbar-track {
  background: var(--color-surface-hover);
}

.tabs-container::-webkit-scrollbar-thumb {
  background-color: var(--color-border);
  border-radius: 2px;
}

.tab-item {
  padding: var(--spacing-3) var(--spacing-4);
  text-align: center;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--transition-normal);
  border-right: 2px solid transparent;
  min-width: 100px;
}

.tab-item:hover {
  color: var(--color-text-primary);
  background-color: var(--color-surface);
}

.tab-item.is-active {
  color: var(--color-primary);
  border-right-color: var(--color-primary);
  font-weight: var(--font-weight-medium);
}

.options-list {
  flex: 1;
  overflow-y: auto;
  max-height: 220px;
}

.option-item {
  padding: var(--spacing-3) var(--spacing-4);
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
  cursor: pointer;
  transition: background-color var(--transition-normal);
}

.option-item:hover {
  background-color: var(--color-surface-hover);
}

.option-item.is-selected {
  background-color: rgba(100, 108, 255, 0.1);
  color: var(--color-primary);
}

.empty-tip {
  padding: var(--spacing-6);
  text-align: center;
  color: var(--color-text-tertiary);
  font-size: var(--font-size-sm);
}
</style>
