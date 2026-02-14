<template>
  <div class="modal-overlay" @click="handleOverlayClick">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3>设置局数选项</h3>
        <button class="close-btn" @click="handleClose">
          <Icon name="x" size="18" />
        </button>
      </div>
      <div class="modal-body">
        <!-- 模式切换 -->
        <div class="mode-section">
          <h4>模式选择</h4>
          <div class="mode-tabs">
            <button 
              class="mode-tab" 
              :class="{ active: localConfig.mode === 'round' }"
              @click="switchMode('round')"
            >
              打局
            </button>
            <button 
              class="mode-tab" 
              :class="{ active: localConfig.mode === 'circle' }"
              @click="switchMode('circle')"
            >
              打圈
            </button>
          </div>
        </div>

        <!-- 预设模板 -->
        <div class="preset-section">
          <h4>预设模板</h4>
          <div class="preset-options">
            <label 
              v-for="preset in getPresetTemplates()" 
              :key="preset.name"
              class="preset-option"
            >
              <input 
                type="radio" 
                :value="preset"
                @change="selectPreset(preset)"
              >
              <div class="preset-info">
                <div class="preset-name">{{ preset.name }}</div>
                <div class="preset-desc">{{ preset.description }}</div>
              </div>
            </label>
          </div>
        </div>

        <!-- 自定义选项 -->
        <div class="custom-section">
          <h4>自定义选项</h4>
          <div class="round-options">
            <label 
              v-for="num in getAvailableOptions()" 
              :key="num"
              class="round-option"
            >
              <input 
                type="checkbox" 
                :checked="localConfig.options.includes(num)"
                @change="toggleRoundOption(num)"
              >
              <span>{{ num }}{{ localConfig.mode === 'round' ? '局' : '圈' }}</span>
            </label>
          </div>

          <!-- 默认值设置 -->
          <div class="default-section">
            <h5>默认{{ localConfig.mode === 'round' ? '局数' : '圈数' }}</h5>
            <div class="default-options">
              <label 
                v-for="option in localConfig.options" 
                :key="option"
                class="default-option"
              >
                <input 
                  type="radio" 
                  :value="option"
                  :checked="localConfig.default === option"
                  @change="updateDefault(option)"
                >
                <span>{{ option }}{{ localConfig.mode === 'round' ? '局' : '圈' }}</span>
              </label>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn-secondary" @click="handleClose">取消</button>
        <button class="btn-primary" @click="handleSave">保存</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Icon from './Icon.vue'

// Props
const props = defineProps({
  config: {
    type: Object,
    required: true
  }
})

// Emits
const emit = defineEmits(['update:config', 'close'])

// 本地配置
const localConfig = ref({ ...props.config })

// 切换模式
function switchMode(mode) {
  localConfig.value.mode = mode
  // 根据模式更新默认选项
  if (mode === 'round') {
    localConfig.value.options = [4, 8, 16]
    localConfig.value.default = 4
  } else {
    localConfig.value.options = [1, 2, 4]
    localConfig.value.default = 1
  }
}

// 获取预设模板
function getPresetTemplates() {
  if (localConfig.value.mode === 'round') {
    return [
      {
        name: '标准配置',
        description: '4局/8局/16局，默认4局',
        options: [4, 8, 16],
        default: 4
      },
      {
        name: '短局配置',
        description: '2局/4局/6局，默认4局',
        options: [2, 4, 6],
        default: 4
      },
      {
        name: '长局配置',
        description: '16局/32局/64局，默认16局',
        options: [16, 32, 64],
        default: 16
      }
    ]
  } else {
    return [
      {
        name: '标准配置',
        description: '1圈/2圈/4圈，默认1圈',
        options: [1, 2, 4],
        default: 1
      },
      {
        name: '多圈配置',
        description: '2圈/4圈/8圈，默认2圈',
        options: [2, 4, 8],
        default: 2
      }
    ]
  }
}

// 获取可用选项
function getAvailableOptions() {
  if (localConfig.value.mode === 'round') {
    return [2, 4, 6, 8, 16, 32, 64]
  } else {
    return [1, 2, 3, 4, 6, 8]
  }
}

// 选择预设模板
function selectPreset(preset) {
  localConfig.value.options = [...preset.options]
  localConfig.value.default = preset.default
}

// 切换局数选项
function toggleRoundOption(num) {
  const currentOptions = localConfig.value.options
  if (currentOptions.includes(num)) {
    // 如果是默认值，不允许取消
    if (localConfig.value.default === num && currentOptions.length > 1) {
      // 选择第一个其他选项作为默认值
      const newDefault = currentOptions.find(opt => opt !== num)
      localConfig.value.default = newDefault
    }
    localConfig.value.options = currentOptions.filter(opt => opt !== num)
  } else {
    localConfig.value.options.push(num)
    // 按数字排序
    localConfig.value.options.sort((a, b) => a - b)
  }
}

// 更新默认值
function updateDefault(value) {
  localConfig.value.default = value
}

// 处理保存
function handleSave() {
  if (localConfig.value.options.length === 0) {
    alert('至少选择一个局数选项')
    return
  }
  emit('update:config', { ...localConfig.value })
  emit('close')
}

// 处理关闭
function handleClose() {
  emit('close')
}

// 处理遮罩层点击
function handleOverlayClick() {
  emit('close')
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1100;
}

.modal-content {
  background-color: var(--color-surface);
  border-radius: var(--border-radius-lg);
  width: 90vw;
  max-width: 500px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: modalFadeIn 0.3s ease;
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-4) var(--spacing-6);
  border-bottom: 1px solid var(--color-border);
  background-color: var(--color-surface-hover);
}

.modal-header h3 {
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

.close-btn {
  background: none;
  border: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  padding: var(--spacing-2);
  border-radius: var(--border-radius-md);
  transition: all var(--transition-normal);
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background-color: var(--color-surface);
  color: var(--color-text-primary);
}

.modal-body {
  padding: var(--spacing-6);
  overflow-y: auto;
  flex: 1;
}

.mode-section,
.preset-section,
.custom-section {
  margin-bottom: var(--spacing-6);
}

.mode-section h4,
.preset-section h4,
.custom-section h4 {
  margin: 0 0 var(--spacing-4) 0;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.mode-tabs {
  display: flex;
  gap: var(--spacing-2);
  margin-bottom: var(--spacing-4);
  border-bottom: 1px solid var(--color-border);
}

.mode-tab {
  padding: var(--spacing-3) var(--spacing-6);
  background: none;
  border: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  transition: all var(--transition-normal);
  border-bottom: 2px solid transparent;
}

.mode-tab:hover {
  color: var(--color-primary);
}

.mode-tab.active {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
}

.preset-options {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
}

.preset-option {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-3);
  padding: var(--spacing-3);
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  cursor: pointer;
  transition: all var(--transition-normal);
}

.preset-option:hover {
  border-color: var(--color-primary);
  background-color: var(--color-surface-hover);
}

.preset-option input[type="radio"] {
  margin-top: 4px;
}

.preset-info {
  flex: 1;
}

.preset-name {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  margin-bottom: 2px;
}

.preset-desc {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
}

.round-options {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-3);
  margin-bottom: var(--spacing-4);
}

.round-option {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  cursor: pointer;
}

.default-section {
  margin-top: var(--spacing-4);
}

.default-section h5 {
  margin: 0 0 var(--spacing-3) 0;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

.default-options {
  display: flex;
  gap: var(--spacing-3);
  flex-wrap: wrap;
}

.default-option {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  cursor: pointer;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-4);
  padding: var(--spacing-4) var(--spacing-6);
  border-top: 1px solid var(--color-border);
  background-color: var(--color-surface-hover);
}

.btn-secondary {
  padding: var(--spacing-3) var(--spacing-6);
  background-color: var(--color-surface);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  cursor: pointer;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  transition: all var(--transition-normal);
}

.btn-secondary:hover {
  background-color: var(--color-surface-hover);
  border-color: var(--color-primary);
}

.btn-primary {
  padding: var(--spacing-3) var(--spacing-6);
  background-color: var(--color-primary);
  color: white;
  border: 1px solid var(--color-primary);
  border-radius: var(--border-radius-md);
  cursor: pointer;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  transition: all var(--transition-normal);
}

.btn-primary:hover {
  background-color: var(--color-primary-hover);
  border-color: var(--color-primary-hover);
}
</style>