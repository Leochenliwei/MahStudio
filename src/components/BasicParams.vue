<template>
  <div class="basic-params">
    <div class="section-header">
      <h3>基础选项配置</h3>
      <p class="section-description">设置游戏的必备的创房面板选项</p>
    </div>
    
    <div class="params-card">
      <!-- 人数配置 -->
      <div class="rule-row">
        <div class="rule-label">
          <span class="label-text">人数</span>
        </div>
        <div class="rule-options">
          <label v-for="option in basicConfig.playerCount.options" :key="option" class="radio-option">
            <input 
              type="radio" 
              name="playerCount" 
              :checked="basicConfig.playerCount.default === option"
              @change="$emit('update-player-count-default', option)"
            > 
            <span class="option-text">{{ option }}人</span>
          </label>
          <label class="checkbox-option">
            <input 
              type="checkbox" 
              v-model="basicConfig.playerCount.allowLess"
              @change="$emit('update-basic-config')"
            > 
            <span class="option-text">少人开局</span>
          </label>
        </div>
        <button class="rule-action" @click="$emit('open-drawer', 'drawer-people')" title="配置人数选项">
          ⚙️
        </button>
      </div>

      <!-- 局数配置 -->
      <div class="rule-row">
        <div class="rule-label">
          <span class="label-text">局数</span>
        </div>
        <div class="rule-options">
          <label v-for="option in basicConfig.roundCount.options" :key="option" class="radio-option">
            <input 
              type="radio" 
              name="roundCount" 
              :checked="basicConfig.roundCount.default === option"
              @change="$emit('update-round-count-default', option)"
            > 
            <span class="option-text">{{ option }}局</span>
          </label>
        </div>
        <button class="rule-action" @click="$emit('open-drawer', 'drawer-rounds')" title="配置局数选项">
          ⚙️
        </button>
      </div>

      <!-- 底分配置 -->
      <div class="rule-row">
        <div class="rule-label">
          <span class="label-text">底分</span>
        </div>
        <div class="rule-options">
          <select 
            v-model="basicConfig.baseScore"
            @change="$emit('update-basic-config')"
            class="select-input"
          >
            <option v-for="score in [1, 2, 3, 4, 5]" :key="score" :value="score">
              {{ score }}
            </option>
          </select>
        </div>
        <button class="rule-action" @click="$emit('open-drawer', 'drawer-base-score')" title="配置底分选项">
          ⚙️
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
// 定义props
const props = defineProps({
  basicConfig: {
    type: Object,
    required: true
  }
})

// 定义事件
const emit = defineEmits([
  'update-player-count-default',
  'update-round-count-default',
  'update-basic-config',
  'open-drawer'
])
</script>

<style scoped>
.basic-params {
  margin-bottom: var(--spacing-6);
}

.section-header {
  margin-bottom: var(--spacing-4);
}

.section-header h3 {
  margin: 0 0 var(--spacing-1) 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.section-description {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--color-text-tertiary);
}

.params-card {
  background: var(--color-surface);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-sm);
  padding: var(--spacing-6);
  transition: all var(--transition-normal);
  border: 1px solid var(--color-border);
}

.params-card:hover {
  box-shadow: var(--shadow-md);
  border-color: var(--color-primary);
}

/* 规则行样式 */
.rule-row {
  display: flex;
  align-items: center;
  padding: var(--spacing-4) 0;
  border-bottom: 1px solid var(--color-border);
  transition: all var(--transition-normal);
}

.rule-row:last-child {
  border-bottom: none;
}

.rule-row:hover {
  background: rgba(100, 108, 255, 0.1);
  padding-left: var(--spacing-2);
  border-radius: var(--border-radius-md);
}

.rule-label {
  width: 120px;
  flex-shrink: 0;
}

.label-text {
  display: block;
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-1);
}

.label-desc {
  display: block;
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
}

.rule-options {
  flex: 1;
  display: flex;
  gap: var(--spacing-4);
  flex-wrap: wrap;
  align-items: center;
}

/* 单选和复选框选项 */
.radio-option,
.checkbox-option {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  cursor: pointer;
  padding: var(--spacing-2) var(--spacing-3);
  border-radius: var(--border-radius-md);
  transition: all var(--transition-normal);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  min-width: 240px;
}

.radio-option:hover,
.checkbox-option:hover {
  background: rgba(100, 108, 255, 0.1);
  color: var(--color-primary);
}

.radio-option input[type="radio"],
.checkbox-option input[type="checkbox"] {
  accent-color: var(--color-primary);
  width: 16px;
  height: 16px;
}

.option-text {
  user-select: none;
}

/* 下拉选择框 */
.select-input {
  padding: var(--spacing-2) var(--spacing-4);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  background: var(--color-surface);
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: all var(--transition-normal);
  min-width: 240px;
}

.select-input:hover {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(100, 108, 255, 0.1);
}

.select-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(100, 108, 255, 0.2);
}

/* 操作按钮 */
.rule-action {
  margin-left: var(--spacing-4);
  cursor: pointer;
  color: var(--color-text-tertiary);
  font-size: var(--font-size-base);
  background: none;
  border: none;
  padding: var(--spacing-2);
  border-radius: var(--border-radius-md);
  transition: all var(--transition-normal);
  display: flex;
  align-items: center;
  justify-content: center;
}

.rule-action:hover {
  color: var(--color-primary);
  background: rgba(100, 108, 255, 0.1);
  transform: rotate(15deg);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .params-card {
    padding: var(--spacing-4);
  }
  
  .rule-row {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-3);
    padding: var(--spacing-4) 0;
  }
  
  .rule-label {
    width: 100%;
  }
  
  .rule-options {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-3);
    width: 100%;
  }
  
  .radio-option,
  .checkbox-option {
    width: 100%;
    padding: var(--spacing-2) var(--spacing-4);
  }
  
  .select-input {
    width: 100%;
  }
  
  .rule-action {
    align-self: flex-end;
    margin-left: 0;
  }
}
</style>