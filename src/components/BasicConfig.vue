<template>
  <div class="basic-config">
    <!-- 人数配置 -->
    <div class="config-section">
      <div class="section-header">
        <h3>人数配置</h3>
        <button class="btn-edit" @click="openPlayerCountConfig">
          <Icon name="sliders" size="16" />
          设置
        </button>
      </div>
      <div class="config-content">
        <div class="radio-group">
          <label 
            v-for="option in config.playerCount.options" 
            :key="option"
            class="radio-option"
          >
            <input 
              type="radio" 
              :value="option"
              :checked="config.playerCount.default === option"
              @change="updatePlayerCountDefault(option)"
            >
            <span>{{ option }}人</span>
          </label>
        </div>
        <div class="checkbox-option">
          <input 
            type="checkbox" 
            id="allowLess" 
            v-model="localConfig.playerCount.allowLess"
            @change="updateConfig"
          >
          <label for="allowLess">少人开局</label>
        </div>
      </div>
    </div>

    <!-- 局数配置 -->
    <div class="config-section">
      <div class="section-header">
        <h3>局数配置</h3>
        <button class="btn-edit" @click="openRoundCountConfig">
          <Icon name="sliders" size="16" />
          设置
        </button>
      </div>
      <div class="config-content">
        <div class="mode-tabs">
          <button 
            class="mode-tab" 
            :class="{ active: localConfig.roundCount.mode === 'round' }"
            @click="switchRoundMode('round')"
          >
            打局
          </button>
          <button 
            class="mode-tab" 
            :class="{ active: localConfig.roundCount.mode === 'circle' }"
            @click="switchRoundMode('circle')"
          >
            打圈
          </button>
        </div>
        <div class="radio-group">
          <label 
            v-for="option in localConfig.roundCount.options" 
            :key="option"
            class="radio-option"
          >
            <input 
              type="radio" 
              :value="option"
              :checked="localConfig.roundCount.default === option"
              @change="updateRoundCountDefault(option)"
            >
            <span>{{ localConfig.roundCount.mode === 'round' ? option + '局' : option + '圈' }}</span>
          </label>
        </div>
      </div>
    </div>

    <!-- 底分配置 -->
    <div class="config-section">
      <div class="section-header">
        <h3>底分配置</h3>
      </div>
      <div class="config-content">
        <div class="input-group">
          <input 
            type="number" 
            v-model.number="localConfig.baseScore"
            @change="updateConfig"
            min="1"
            max="1000"
            class="number-input"
          >
          <span class="input-suffix">分</span>
        </div>
      </div>
    </div>

    <!-- 时间配置 -->
    <div class="config-section">
      <div class="section-header">
        <h3>时间配置</h3>
      </div>
      <div class="config-content">
        <div class="time-settings">
          <div class="time-setting-item">
            <label>准备时间</label>
            <div class="input-group">
              <input 
                type="number" 
                v-model.number="localConfig.timeLimits.prepare"
                @change="updateConfig"
                min="5"
                max="120"
                class="number-input small"
              >
              <span class="input-suffix">秒</span>
            </div>
          </div>
          <div class="time-setting-item">
            <label>出牌时间</label>
            <div class="input-group">
              <input 
                type="number" 
                v-model.number="localConfig.timeLimits.discard"
                @change="updateConfig"
                min="5"
                max="60"
                class="number-input small"
              >
              <span class="input-suffix">秒</span>
            </div>
          </div>
          <div class="time-setting-item">
            <label>思考时间</label>
            <div class="input-group">
              <input 
                type="number" 
                v-model.number="localConfig.timeLimits.think"
                @change="updateConfig"
                min="5"
                max="60"
                class="number-input small"
              >
              <span class="input-suffix">秒</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 人数配置弹窗 -->
    <PlayerCountConfig 
      v-if="showPlayerCountConfig"
      :config="localConfig.playerCount"
      @update:config="updatePlayerCountConfig"
      @close="showPlayerCountConfig = false"
    />

    <!-- 局数配置弹窗 -->
    <RoundCountConfig 
      v-if="showRoundCountConfig"
      :config="localConfig.roundCount"
      @update:config="updateRoundCountConfig"
      @close="showRoundCountConfig = false"
    />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import Icon from './Icon.vue'
import PlayerCountConfig from './PlayerCountConfig.vue'
import RoundCountConfig from './RoundCountConfig.vue'

// Props
const props = defineProps({
  config: {
    type: Object,
    required: true
  }
})

// Emits
const emit = defineEmits(['update:config'])

// 本地配置副本
const localConfig = ref({ ...props.config })

// 弹窗状态
const showPlayerCountConfig = ref(false)
const showRoundCountConfig = ref(false)

// 监听外部配置变化
watch(() => props.config, (newConfig) => {
  localConfig.value = { ...newConfig }
}, { deep: true })

// 更新配置
function updateConfig() {
  emit('update:config', { ...localConfig.value })
}

// 打开人数配置弹窗
function openPlayerCountConfig() {
  showPlayerCountConfig.value = true
}

// 打开局数配置弹窗
function openRoundCountConfig() {
  showRoundCountConfig.value = true
}

// 更新人数默认值
function updatePlayerCountDefault(value) {
  localConfig.value.playerCount.default = value
  updateConfig()
}

// 更新人数配置
function updatePlayerCountConfig(newConfig) {
  localConfig.value.playerCount = { ...newConfig }
  updateConfig()
  showPlayerCountConfig.value = false
}

// 切换局数模式
function switchRoundMode(mode) {
  localConfig.value.roundCount.mode = mode
  // 根据模式更新默认选项
  if (mode === 'round') {
    localConfig.value.roundCount.options = [4, 8, 16]
  } else {
    localConfig.value.roundCount.options = [1, 2, 4]
  }
  updateConfig()
}

// 更新局数默认值
function updateRoundCountDefault(value) {
  localConfig.value.roundCount.default = value
  updateConfig()
}

// 更新局数配置
function updateRoundCountConfig(newConfig) {
  localConfig.value.roundCount = { ...newConfig }
  updateConfig()
  showRoundCountConfig.value = false
}
</script>

<style scoped>
.basic-config {
  padding: var(--spacing-6);
  overflow-y: auto;
  max-height: 60vh;
}

/* 配置区块 */
.config-section {
  margin-bottom: var(--spacing-8);
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

/* 区块头部 */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-4) var(--spacing-6);
  background-color: var(--color-surface-hover);
  border-bottom: 1px solid var(--color-border);
}

.section-header h3 {
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

.btn-edit {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-2) var(--spacing-4);
  background-color: var(--color-surface);
  color: var(--color-primary);
  border: 1px solid var(--color-primary);
  border-radius: var(--border-radius-md);
  cursor: pointer;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  transition: all var(--transition-normal);
}

.btn-edit:hover {
  background-color: var(--color-primary);
  color: white;
}

/* 区块内容 */
.config-content {
  padding: var(--spacing-6);
}

/* 单选按钮组 */
.radio-group {
  display: flex;
  gap: var(--spacing-6);
  margin-bottom: var(--spacing-4);
}

.radio-option {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  cursor: pointer;
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
}

.radio-option input[type="radio"] {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

/* 复选框选项 */
.checkbox-option {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  cursor: pointer;
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
}

.checkbox-option input[type="checkbox"] {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

/* 模式标签 */
.mode-tabs {
  display: flex;
  gap: var(--spacing-2);
  margin-bottom: var(--spacing-4);
  border-bottom: 1px solid var(--color-border);
}

.mode-tab {
  padding: var(--spacing-2) var(--spacing-4);
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

/* 输入组 */
.input-group {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
}

.number-input {
  padding: var(--spacing-3) var(--spacing-4);
  background-color: var(--color-surface-hover);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
  transition: all var(--transition-normal);
  width: 100px;
}

.number-input.small {
  width: 80px;
}

.number-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(100, 108, 255, 0.2);
}

.input-suffix {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

/* 时间设置 */
.time-settings {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
}

.time-setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.time-setting-item label {
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
  font-weight: var(--font-weight-medium);
}
</style>