<template>
  <div class="custom-select" :class="{ 'is-open': isOpen }">
    <div class="select-trigger" @click="toggleDropdown">
      <span class="trigger-text">{{ displayValue }}</span>
      <span class="trigger-icon">▼</span>
    </div>
    
    <div v-if="isOpen" class="select-dropdown">
      <div class="dropdown-header">
        <input 
          type="text" 
          v-model="searchKeyword" 
          placeholder="请输入关键词" 
          class="search-input"
          @click.stop
        >
      </div>
      
      <div class="tabs-container" v-if="tabs && tabs.length > 0">
        <div 
          v-for="(tab, index) in tabs" 
          :key="index"
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
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

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
      { value: 'qidui', label: '七对', category: 'pai_type' },
      { value: 'haohua_qidui', label: '豪华七对', category: 'pai_type' },
      { value: 'ziyise', label: '字一色（假胡）', category: 'pai_type' },
      { value: 'yinghu_deguo', label: '硬胡（德国）', category: 'pai_type' },
      { value: 'haidilaoyue', label: '海底捞月', category: 'pai_type' },
      { value: 'qianduanceshi', label: '前端测试', category: 'pai_type' },
      { value: 'yitiaolong', label: '一条龙', category: 'pai_type' },
      { value: 'zhuangjia', label: '庄家', category: 'shenfen' },
      { value: 'xianjia', label: '闲家', category: 'shenfen' },
      { value: 'zimo', label: '自摸', category: 'paiju' },
      { value: 'fangpao', label: '放炮', category: 'paiju' },
      { value: 'ying', label: '赢', category: 'zhuangtai' },
      { value: 'shu', label: '输', category: 'zhuangtai' }
    ]
  },
  tabs: {
    type: Array,
    default: () => [
      { label: '状态', filter: (opt) => opt.category === 'zhuangtai' },
      { label: '牌局', filter: (opt) => opt.category === 'paiju' },
      { label: '身份', filter: (opt) => opt.category === 'shenfen' },
      { label: '牌型', filter: (opt) => opt.category === 'pai_type' }
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
  }
})

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)
const searchKeyword = ref('')
const activeTab = ref(0)

/**
 * 切换下拉框显示/隐藏
 */
function toggleDropdown() {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    searchKeyword.value = ''
    document.addEventListener('click', handleClickOutside)
  } else {
    document.removeEventListener('click', handleClickOutside)
  }
}

/**
 * 点击外部关闭下拉框
 */
function handleClickOutside(event) {
  isOpen.value = false
  document.removeEventListener('click', handleClickOutside)
}

/**
 * 切换标签
 */
function switchTab(index) {
  activeTab.value = index
}

/**
 * 根据标签和搜索关键词过滤选项
 */
const filteredOptions = computed(() => {
  let result = [...props.options]
  
  if (props.tabs && props.tabs[activeTab.value] && props.tabs[activeTab.value].filter) {
    result = result.filter(props.tabs[activeTab.value].filter)
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
    isOpen.value = false
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
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-lg);
  z-index: 1000;
  max-height: 400px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.dropdown-header {
  padding: var(--spacing-3);
  border-bottom: 1px solid var(--color-border);
}

.search-input {
  width: 100%;
  padding: var(--spacing-3) var(--spacing-4);
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
  display: flex;
  border-bottom: 1px solid var(--color-border);
  background-color: var(--color-surface-hover);
}

.tab-item {
  flex: 1;
  padding: var(--spacing-3) var(--spacing-4);
  text-align: center;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--transition-normal);
  border-bottom: 2px solid transparent;
}

.tab-item:hover {
  color: var(--color-text-primary);
  background-color: var(--color-surface);
}

.tab-item.is-active {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
  font-weight: var(--font-weight-medium);
}

.options-list {
  flex: 1;
  overflow-y: auto;
  max-height: 280px;
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
