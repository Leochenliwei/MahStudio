<template>
  <div v-if="isBasicDrawerActive" class="drawer-container">
    <!-- 遮罩层 -->
    <div class="overlay" @click="$emit('close')"></div>

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

        <!-- 允许少人开局开关 -->
        <div class="allow-less-section">
          <label class="toggle-label">
            <span>允许少人开局</span>
            <label class="toggle-switch">
              <input 
                type="checkbox" 
                :checked="allowLess"
                @change="$emit('toggle-allow-less', $event.target.checked)"
              >
              <span class="toggle-slider"></span>
            </label>
          </label>
          <p class="help-text">开启后，创房面板将显示"少人开局"选项</p>
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
        
        <div class="section-title">{{ roundMode === 'round' ? '局数选择' : '圈数选择' }}</div>
        <div 
          v-for="(template, index) in currentRoundTemplates" 
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
  </div>
</template>

<script setup>
import { computed } from 'vue'

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
  circleCountTemplates: {
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
  allowLess: {
    type: Boolean,
    default: false
  },
})

// 定义事件
const emit = defineEmits([
  'close',
  'select-player-count-template',
  'save-player-count-config',
  'switch-round-mode',
  'select-round-count-template',
  'save-round-count-config',
  'select-base-score-template',
  'save-base-score-config',
  'toggle-allow-less',
])

// 计算属性：是否显示基础抽屉
const isBasicDrawerActive = computed(() => {
  return ['drawer-people', 'drawer-rounds', 'drawer-base-score'].includes(props.activeDrawer)
})

// 计算属性：根据模式返回对应的模板数据
const currentRoundTemplates = computed(() => {
  return props.roundMode === 'round' ? props.roundCountTemplates : props.circleCountTemplates
})
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
  width: 400px;
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

/* 通用样式 */
.section-title {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-4);
}

/* 选项配置样式 */
.option-select-item {
  display: flex;
  align-items: center;
  margin-bottom: var(--spacing-3);
  padding: var(--spacing-3);
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
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid var(--color-border);
  margin-right: var(--spacing-3);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast) ease;
  flex-shrink: 0;
}

.option-select-item.selected .circle-check {
  background: var(--color-primary);
  border-color: var(--color-primary);
}

.option-select-item.selected .circle-check::after {
  content: '';
  width: 6px;
  height: 6px;
  background: white;
  border-radius: 50%;
}

.option-content {
  flex: 1;
}

.option-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
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

.btn-block {
  width: 100%;
}

/* 允许少人开局开关样式 */
.allow-less-section {
  margin-top: var(--spacing-6);
  padding: var(--spacing-4);
  background: var(--color-surface);
  border-radius: var(--border-radius-md);
  border: 1px solid var(--color-border);
}

.toggle-label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

.help-text {
  margin: var(--spacing-2) 0 0 0;
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
}

/* 切换开关样式 */
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--color-border);
  transition: 0.3s;
  border-radius: 24px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.3s;
  border-radius: 50%;
}

.toggle-switch input:checked + .toggle-slider {
  background-color: var(--color-primary);
}

.toggle-switch input:checked + .toggle-slider:before {
  transform: translateX(20px);
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
}
</style>
