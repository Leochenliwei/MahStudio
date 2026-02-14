<template>
  <div v-if="activeDrawer" class="drawer-container">
    <!-- 遮罩层 -->
    <div class="overlay" @click="$emit('close-all-drawers')"></div>

    <!-- 左侧抽屉 - 人数设置 -->
    <div class="drawer" :class="{ active: activeDrawer === 'drawer-people' }">
      <div class="drawer-header">
        <h3>设置人数选项</h3>
      </div>
      <div class="drawer-body">
        <div class="section-title">选项选择</div>
        <div 
          v-for="(template, index) in playerCountTemplates" 
          :key="index"
          class="option-select-item"
          :class="{ selected: selectedPlayerCountTemplate === index }"
          @click="$emit('select-player-count-template', index)"
        >
          <div class="circle-check"></div>
          <div class="option-content">
            <div class="option-label">{{ template.label }}</div>
          </div>
        </div>
      </div>
      <div class="drawer-footer">
        <button class="btn btn-primary btn-block" @click="$emit('save-player-count-config')">
          保存
        </button>
      </div>
    </div>

    <!-- 左侧抽屉 - 局数设置 -->
    <div class="drawer" :class="{ active: activeDrawer === 'drawer-rounds' }">
      <div class="drawer-header">
        <h3>设置局数选项</h3>
      </div>
      <div class="drawer-body">
        <div class="mode-tabs">
          <button 
            class="mode-tab" 
            :class="{ active: roundMode === 'round' }"
            @click="$emit('switch-round-mode', 'round')"
          >
            打局
          </button>
          <button 
            class="mode-tab" 
            :class="{ active: roundMode === 'circle' }"
            @click="$emit('switch-round-mode', 'circle')"
          >
            打圈
          </button>
        </div>
        
        <div class="section-title">局数选择</div>
        <div 
          v-for="(template, index) in roundCountTemplates" 
          :key="index"
          class="option-select-item"
          :class="{ selected: selectedRoundCountTemplate === index }"
          @click="$emit('select-round-count-template', index)"
        >
          <div class="circle-check"></div>
          <div class="option-content">
            <div class="option-label">{{ template.label }}</div>
          </div>
        </div>
      </div>
      <div class="drawer-footer">
        <button class="btn btn-primary btn-block" @click="$emit('save-round-count-config')">
          保存
        </button>
      </div>
    </div>

    <!-- 左侧抽屉 - 底分设置 -->
    <div class="drawer" :class="{ active: activeDrawer === 'drawer-base-score' }">
      <div class="drawer-header">
        <h3>设置底分选项</h3>
      </div>
      <div class="drawer-body">
        <div class="section-title">底分选择</div>
        <div 
          v-for="(template, index) in baseScoreTemplates" 
          :key="index"
          class="option-select-item"
          :class="{ selected: selectedBaseScoreTemplate === index }"
          @click="$emit('select-base-score-template', index)"
        >
          <div class="circle-check"></div>
          <div class="option-content">
            <div class="option-label">{{ template.label }}</div>
          </div>
        </div>
      </div>
      <div class="drawer-footer">
        <button class="btn btn-primary btn-block" @click="$emit('save-base-score-config')">
          保存
        </button>
      </div>
    </div>

    <!-- 右侧抽屉 - 元件属性配置 -->
    <div class="drawer right" :class="{ active: activeDrawer === 'drawer-props' }">
      <div class="drawer-header">
        <h3>选项配置</h3>
      </div>
      <div class="drawer-body">
        <div v-if="editingComponent" class="component-title-section">
          <label class="form-label">{{ getComponentTypeText(editingComponent.type) }}组名称</label>
          <input 
            type="text" 
            class="form-input" 
            v-model="editingComponent.title"
            placeholder="请输入组件名称"
          >
        </div>

        <div class="options-section">
          <div class="options-table-header">
            <div class="col-index">#</div>
            <div class="col-label">选项名</div>
            <div class="col-value">赋值</div>
            <div class="col-action">操作</div>
          </div>

          <div 
            v-for="(option, index) in editingComponent.options" 
            :key="index"
            class="option-wrapper"
          >
            <!-- 选项行 -->
            <div class="option-item">
              <div class="col-index">{{ index + 1 }}</div>
              <div class="col-label">
                <input 
                  type="text" 
                  class="form-input" 
                  v-model="option.label"
                  placeholder="请输入选项名称"
                >
              </div>
              <div class="col-value">
                <input 
                  type="text" 
                  class="form-input" 
                  v-model="option.value"
                  placeholder="值"
                  style="width: 40px; flex:none;"
                >
              </div>
              <div class="col-action">
                <button class="rule-tag" @click="$emit('open-component-selector', index)">
                  <!-- <Icon name="setting" size="12" /> -->
                  规则 {{ index }}
                </button>
                <button class="rule-tag delete-tag" @click="$emit('remove-option', index)">
                  <!-- <Icon name="x" size="12" /> -->
                  删除
                </button>
              </div>
            </div>
            
            <!-- 选项行下方的默认选中 -->
            <div class="option-default-row">
              <div class="col-index"></div>
              <div class="col-label">
                <label class="default-checkbox">
                  <input 
                    type="checkbox" 
                    v-model="option.isDefault"
                  > 
                  <span>默认选中</span>
                </label>
              </div>
              <div class="col-value"></div>
              <div class="col-action"></div>
            </div>
          </div>
          
         
          <button class="btn btn-outline btn-block add-option-btn" @click="$emit('add-option')">
            <Icon name="plus" size="14" />
            添加选项
          </button>
        </div>
      </div>
      <div class="drawer-footer">
        <div class="footer-buttons">
          <button class="btn btn-outline" @click="$emit('close-all-drawers')">
            <Icon name="close" size="16" />
            放弃
          </button>
          <button class="btn btn-primary" @click="$emit('save-component-config')">
            <Icon name="check" size="16" />
            保存
          </button>
        </div>
      </div>
    </div>


  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Icon from './Icon.vue'

// 定义props
const props = defineProps({
  activeDrawer: {
    type: String,
    default: ''
  },
  playerCountTemplates: {
    type: Array,
    default: () => []
  },
  selectedPlayerCountTemplate: {
    type: Number,
    default: 0
  },
  roundCountTemplates: {
    type: Array,
    default: () => []
  },
  selectedRoundCountTemplate: {
    type: Number,
    default: 0
  },
  baseScoreTemplates: {
    type: Array,
    default: () => []
  },
  selectedBaseScoreTemplate: {
    type: Number,
    default: 0
  },
  roundMode: {
    type: String,
    default: 'round'
  },
  editingComponent: {
    type: Object,
    default: null
  },

})

// 定义事件
const emit = defineEmits([
  'close-all-drawers',
  'select-player-count-template',
  'save-player-count-config',
  'switch-round-mode',
  'select-round-count-template',
  'save-round-count-config',
  'select-base-score-template',
  'save-base-score-config',
  'add-option',
  'remove-option',
  'save-component-config',
  'open-advanced-rules',

])



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
/* 侧边抽屉容器 */
.drawer-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
}

/* 遮罩层 */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  z-index: 1000;
  backdrop-filter: blur(2px);
  animation: fadeIn var(--transition-normal) ease;
}

/* 淡入动画 */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* 侧边抽屉 */
.drawer {
  position: fixed;
  top: 0;
  left: 0;
  width: 900px;
  height: 100vh;
  background: var(--color-surface);
  z-index: 1001;
  transform: translateX(-100%);
  transition: transform var(--transition-normal) cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: var(--shadow-md);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-right: 1px solid var(--color-border);
  opacity: 0;
  pointer-events: none;
}

.drawer.right {
  left: auto;
  right: 0;
  transform: translateX(100%);
  border-right: none;
  border-left: 1px solid var(--color-border);
}

.drawer.active {
  transform: translateX(0);
  opacity: 1;
  pointer-events: auto;
}

.drawer-header {
  padding: var(--spacing-4) var(--spacing-6);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-surface);
  box-shadow: var(--shadow-sm);
  position: sticky;
  top: 0;
  z-index: 10;
}

.drawer-header h3 {
  margin: 0;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  flex: 1;
  text-align: center;
}

.action-btn {
  background: none;
  border: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  padding: var(--spacing-2);
  border-radius: var(--border-radius-md);
  transition: all var(--transition-normal);
  display: flex;
  align-items: center;
  gap: var(--spacing-1);
  font-size: var(--font-size-sm);
}

.action-btn:hover {
  color: var(--color-primary);
  background: rgba(100, 108, 255, 0.1);
}

.header-placeholder {
  width: 80px;
}

.drawer-body {
  flex: 1;
  padding: var(--spacing-6);
  overflow-y: auto;
  background: var(--color-surface-hover);
}

.drawer-body::-webkit-scrollbar {
  width: 6px;
}

.drawer-body::-webkit-scrollbar-track {
  background: var(--color-surface-hover);
}

.drawer-body::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: var(--border-radius-full);
}

.drawer-body::-webkit-scrollbar-thumb:hover {
  background: var(--color-text-tertiary);
}

.drawer-footer {
  padding: var(--spacing-4) var(--spacing-6);
  border-top: 1px solid var(--color-border);
  background: var(--color-surface);
  box-shadow: 0 -1px 4px rgba(0, 0, 0, 0.3);
  position: sticky;
  bottom: 0;
  z-index: 10;
}

.footer-buttons {
  display: flex;
  gap: var(--spacing-3);
  justify-content: flex-end;
}

.footer-buttons .btn {
  flex: 1;
  max-width: 120px;
}

/* 选项包装器 */
.option-wrapper {
  margin-bottom: var(--spacing-3);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  overflow: hidden;
}

/* 选项默认行 */
.option-default-row {
  display: flex;
  align-items: center;
  padding: var(--spacing-2) var(--spacing-6);
  border-top: 1px solid var(--color-border);
  background: rgba(100, 108, 255, 0.1);
}

.option-default-row .col-label {
  margin-left: var(--spacing-3);
}

/* 通用样式 */
.section-title {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-4);
}

.section-subtitle {
  font-size: var(--font-size-sm);
  color: var(--color-text-tertiary);
  margin-bottom: var(--spacing-6);
}

/* 选项配置样式 */
.option-select-item {
  display: flex;
  align-items: center;
  margin-bottom: var(--spacing-3);
  padding: var(--spacing-2);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  cursor: pointer;
  background: var(--color-surface);
  transition: all var(--transition-fast) ease;
}

.option-select-item:hover {
  border-color: var(--color-primary);
}

.option-select-item.selected {
  border-color: var(--color-primary);
  background: rgba(100, 108, 255, 0.1);
}

.circle-check {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 1px solid var(--color-border);
  margin-right: var(--spacing-2);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast) ease;
  flex-shrink: 0;
}

.option-select-item.selected .circle-check {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: var(--color-text-primary);
}

.option-content {
  flex: 1;
}

.option-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-1);
}

.option-desc {
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
}

/* 模式标签 */
.mode-tabs {
  display: flex;
  margin-bottom: var(--spacing-6);
  background: var(--color-surface-hover);
  padding: var(--spacing-1);
  border-radius: var(--border-radius-md);
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.3);
}

.mode-tab {
  flex: 1;
  text-align: center;
  padding: var(--spacing-2) var(--spacing-4);
  background: var(--color-surface);
  border-radius: var(--border-radius-md);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  border: none;
  color: var(--color-text-secondary);
  transition: all var(--transition-normal) ease;
  box-shadow: var(--shadow-sm);
}

.mode-tab:hover {
  color: var(--color-primary);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.mode-tab.active {
  background: var(--color-primary);
  color: var(--color-text-primary);
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

/* 表单样式 */
.component-title-section {
  margin-bottom: var(--spacing-6);
  padding: var(--spacing-4);
  background: var(--color-surface);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-border);
}

.form-label {
  display: block;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-2);
}

.form-input {
  width: 100%;
  padding: var(--spacing-2) var(--spacing-3);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
  transition: all var(--transition-normal) ease;
  background: var(--color-surface-hover);
}

.form-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(100, 108, 255, 0.2);
}

/* 选项配置部分 */
.options-section {
  background: var(--color-surface);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  border: 1px solid var(--color-border);
}

.section-header {
  padding: var(--spacing-4) var(--spacing-6);
  border-bottom: 1px solid var(--color-border);
  background: var(--color-surface);
}

.section-header .section-title {
  margin-bottom: var(--spacing-1);
}

.options-table-header {
  display: flex;
  padding: var(--spacing-3) var(--spacing-6);
  background: var(--color-surface-hover);
  border-bottom: 1px solid var(--color-border);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-tertiary);
}

.col-index {
  width: 40px;
  flex-shrink: 0;
}

.col-label {
  flex: 1;
  margin-left: var(--spacing-3);
}

.col-value {
  width: 100px;
  flex-shrink: 0;
  margin-left: var(--spacing-3);
}

.col-action {
  width: 120px;
  flex-shrink: 0;
  margin-left: var(--spacing-3);
  display: flex;
  gap: var(--spacing-2);
  align-items: center;
  justify-content: flex-end;
}

.option-item {
  display: flex;
  padding: var(--spacing-4) var(--spacing-6);
  transition: all var(--transition-normal) ease;
}

.option-item:hover {
  background: rgba(100, 108, 255, 0.1);
}

.option-item .col-index {
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-secondary);
  display: flex;
  align-items: center;
}

.option-item .col-label .form-input,
.option-item .col-value .form-input {
  width: 100%;
}

.default-option-section {
  padding: var(--spacing-2) var(--spacing-6) var(--spacing-3);
  border-bottom: 1px solid var(--color-border);
  margin-left: 25px;
  font-size: 10px;
}

.default-checkbox {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  cursor: pointer;
}

.default-checkbox input[type="checkbox"] {
  accent-color: var(--color-primary);
  width: 14px;
  height: 14px;
}

.rule-tag {
  background: var(--color-primary);
  color: var(--color-text-primary);
  border: none;
  padding: var(--spacing-1) var(--spacing-2);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-xs);
  cursor: pointer;
  transition: all var(--transition-normal) ease;
  display: flex;
  align-items: center;
  gap: var(--spacing-1);
}

.rule-tag:hover {
  background: var(--color-primary-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.delete-tag {
  background: var(--color-danger);
  margin-left: var(--spacing-2);
}

.delete-tag:hover {
  background: #f87171;
}

.add-option-btn {
  margin: var(--spacing-6);
  border: 2px dashed var(--color-border);
  background: var(--color-surface-hover);
  color: var(--color-text-secondary);
  transition: all var(--transition-normal) ease;
}

.add-option-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background: rgba(100, 108, 255, 0.1);
  transform: translateY(-1px);
}

/* 按钮样式 */
.btn {
  padding: var(--spacing-2) var(--spacing-4);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  cursor: pointer;
  background: var(--color-surface);
  transition: all var(--transition-normal) ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-2);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
  box-shadow: var(--shadow-sm);
}

.btn:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.btn-primary {
  background: var(--color-primary);
  color: var(--color-text-primary);
  border-color: var(--color-primary);
}

.btn-primary:hover {
  background: var(--color-primary-hover);
  border-color: var(--color-primary-hover);
  box-shadow: var(--shadow-md);
}

.btn-outline {
  background: var(--color-surface);
  color: var(--color-text-secondary);
  border-color: var(--color-border);
}

.btn-outline:hover {
  color: var(--color-primary);
  border-color: var(--color-primary);
  background: rgba(100, 108, 255, 0.1);
}

.btn-block {
  width: 100%;
}



/* 响应式调整 */
@media (max-width: 768px) {
  .drawer {
    width: 100%;
  }
  
  .drawer-header,
  .drawer-body,
  .drawer-footer {
    padding: var(--spacing-4);
  }
  
  .option-item {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-3);
  }
  
  .option-item .col-label,
  .option-item .col-value,
  .option-item .col-action {
    width: 100%;
    margin-left: 0;
  }
  
  .options-table-header {
    display: none;
  }
}
</style>