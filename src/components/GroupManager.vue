<template>
  <div class="group-manager">
    <div class="section-header">
      <div class="header-content">
        <h3>分组配置</h3>
        <p class="section-description">配置创房面板的分组与选项</p>
      </div>
      <button class="action-btn" @click="$emit('add-group')">
        <Icon name="plus" size="16" />
        添加分组
      </button>
    </div>
    
    <!-- 动态添加的分组容器 -->
    <div id="groups-container">
      <div 
        v-for="(group, index) in groups" 
        :key="group.id"
        class="group-box"
      >
        <div class="group-header">
          <span class="group-name" @click="$emit('edit-group-name', group)">{{ group.name }}</span>
          <div class="group-actions">
            <Icon name="more" size="16" class="action-icon" />
          </div>
        </div>
        <div class="group-content">
          <div v-if="group.components.length === 0" class="empty-state">
            <Icon name="inbox" size="32" class="empty-icon" />
            <p>暂无选项组，点击下方添加</p>
          </div>
          <div 
            v-for="(component, compIndex) in group.components" 
            :key="component.id"
            class="dynamic-comp"
            @click="$emit('open-drawer', 'drawer-props', group.id, component.id)"
          >
            <div class="comp-preview">
              <div class="comp-title-section">
                <div class="comp-title">{{ component.title }}</div>
              </div>
              <div class="comp-options">
                <label 
                  v-for="(option, optIndex) in component.options" 
                  :key="optIndex"
                  class="radio-option"
                >
                  <input 
                    type="radio" 
                    :name="component.id"
                    :checked="option.isDefault"
                    disabled
                  > 
                  <span class="option-text">{{ option.label }}</span>
                  <span v-if="option.isDefault" class="default-badge">默认</span>
                </label>
              </div>
            </div>
            <button class="comp-action" @click.stop="$emit('open-drawer', 'drawer-props', group.id, component.id)" title="编辑组件">
              <Icon name="setting" size="16" />
            </button>
          </div>
        </div>
        <div class="group-footer">
          <button class="btn add-comp-btn" @click="$emit('add-component', group.id, 'radio')">
            <Icon name="radio" size="14" />
            单选
          </button>
          <button class="btn add-comp-btn" @click="$emit('add-component', group.id, 'checkbox')">
            <Icon name="check-square" size="14" />
            复选
          </button>
          <button class="btn add-comp-btn" @click="$emit('add-component', group.id, 'select')">
            <Icon name="down" size="14" />
            下拉列表
          </button>
          <button class="btn add-comp-btn" @click="$emit('add-component', group.id, 'select-switch')">
            <Icon name="swap" size="14" />
            下拉列表&开关
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Icon from './Icon.vue'

// 定义props
const props = defineProps({
  groups: {
    type: Array,
    required: true
  }
})

// 定义事件
const emit = defineEmits([
  'edit-group-name',
  'add-component',
  'open-drawer',
  'add-group'
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
.group-manager {
  margin-top: var(--spacing-6);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-6);
  gap: var(--spacing-4);
}

.header-content {
  flex: 1;
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

.action-btn {
  cursor: pointer;
  font-size: var(--font-size-sm);
  background: var(--color-primary);
  color: var(--color-text-primary);
  border: 1px solid var(--color-primary);
  display: flex;
  align-items: center;
  gap: var(--spacing-1);
  padding: var(--spacing-2) var(--spacing-4);
  border-radius: var(--border-radius-md);
  transition: all var(--transition-normal);
  font-weight: var(--font-weight-medium);
  white-space: nowrap;
  margin-top: -4px;
}

.action-btn:hover {
  background: var(--color-primary-hover);
  border-color: var(--color-primary-hover);
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

/* 分组样式 */
.group-box {
  background: var(--color-surface);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-sm);
  padding: var(--spacing-4);
  margin-top: var(--spacing-6);
  transition: all var(--transition-normal);
  border: 1px solid var(--color-border);
}

.group-box:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
  border-color: var(--color-primary);
}

.group-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-4);
  padding-bottom: var(--spacing-3);
  border-bottom: 2px solid var(--color-primary);
}

.group-name {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  cursor: pointer;
  transition: all var(--transition-normal);
}

.group-name:hover {
  color: var(--color-primary);
  text-decoration: underline;
}

.group-actions {
  display: flex;
  gap: var(--spacing-1);
}

.action-icon {
  color: var(--color-text-tertiary);
  cursor: pointer;
  transition: all var(--transition-normal);
  padding: var(--spacing-1);
  border-radius: var(--border-radius-md);
}

.action-icon:hover {
  color: var(--color-primary);
  background: rgba(100, 108, 255, 0.1);
}

.group-content {
  min-height: 80px;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
  margin-bottom: var(--spacing-4);
}

/* 空状态 */
.empty-state {
  height: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-6) var(--spacing-4);
  background: var(--color-surface-hover);
  border-radius: var(--border-radius-md);
  border: 2px dashed var(--color-border);
  transition: all var(--transition-normal);
}

.empty-state:hover {
  border-color: var(--color-primary);
  background: rgba(100, 108, 255, 0.1);
}

.empty-icon {
  color: var(--color-text-tertiary);
  margin-bottom: var(--spacing-3);
  transition: all var(--transition-normal);
}

.empty-state:hover .empty-icon {
  color: var(--color-primary);
  transform: scale(1.1);
}

.empty-state p {
  margin: 0;
  color: var(--color-text-tertiary);
  font-size: var(--font-size-sm);
}

/* 动态组件样式 */
.dynamic-comp {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  padding: var(--spacing-4);
  border-radius: var(--border-radius-md);
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all var(--transition-normal);
  position: relative;
  overflow: hidden;
}

.dynamic-comp:hover {
  background: rgba(100, 108, 255, 0.1);
  border-color: var(--color-primary);
  box-shadow: var(--shadow-sm);
}

.comp-preview {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--spacing-4);
  flex: 1;
  overflow: hidden;
}

.comp-title-section {
  margin-bottom: 0;
}

.comp-title {
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
}

.comp-options {
  display: flex;
  gap: var(--spacing-4);
  flex: 1;
  flex-wrap: wrap;
  align-items: center;
}

/* 单选选项样式 */
.radio-option {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  cursor: default;
  padding: var(--spacing-2) var(--spacing-3);
  border-radius: var(--border-radius-md);
  transition: all var(--transition-normal);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  min-width: 120px;
}

.radio-option input[type="radio"] {
  accent-color: var(--color-primary);
  width: 16px;
  height: 16px;
}

.option-text {
  user-select: none;
}

.default-badge {
  background: #52c41a;
  color: var(--color-text-primary);
  font-size: 9px;
  padding: 1px 4px;
  border-radius: 8px;
  font-weight: var(--font-weight-medium);
  margin-left: var(--spacing-1);
}

.comp-options::-webkit-scrollbar {
  height: 4px;
}

.comp-options::-webkit-scrollbar-track {
  background: var(--color-surface-hover);
  border-radius: var(--border-radius-full);
}

.comp-options::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: var(--border-radius-full);
}

.comp-options::-webkit-scrollbar-thumb:hover {
  background: var(--color-text-tertiary);
}

.comp-action {
  margin-left: var(--spacing-3);
  cursor: pointer;
  color: var(--color-text-tertiary);
  background: none;
  border: none;
  padding: var(--spacing-2);
  border-radius: var(--border-radius-md);
  transition: all var(--transition-normal);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.comp-action:hover {
  color: var(--color-primary);
  background: rgba(100, 108, 255, 0.1);
  transform: rotate(15deg);
}

.group-footer {
  display: flex;
  gap: var(--spacing-2);
  padding-top: var(--spacing-4);
  border-top: 1px solid var(--color-border);
  flex-wrap: wrap;
}

.add-comp-btn {
  flex: 1;
  min-width: 100px;
  font-size: var(--font-size-sm);
  background: var(--color-surface-hover);
  border: 1px dashed var(--color-primary);
  color: var(--color-primary);
  padding: var(--spacing-2) var(--spacing-3);
  border-radius: var(--border-radius-md);
  transition: all var(--transition-normal);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-1);
}

.add-comp-btn:hover {
  background: var(--color-primary);
  color: var(--color-text-primary);
  border-style: solid;
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

/* 按钮样式 */
.btn {
  padding: var(--spacing-2) var(--spacing-4);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  cursor: pointer;
  background: var(--color-surface);
  transition: all var(--transition-normal);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-2);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
}

.btn:hover {
  color: var(--color-primary);
  border-color: var(--color-primary);
  background: rgba(100, 108, 255, 0.1);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .group-box {
    padding: var(--spacing-4);
  }
  
  .group-header {
    margin-bottom: var(--spacing-4);
  }
  
  .group-content {
    margin-bottom: var(--spacing-4);
  }
  
  .group-footer {
    gap: var(--spacing-1);
  }
  
  .add-comp-btn {
    flex: 1;
    min-width: 80px;
    font-size: var(--font-size-xs);
    padding: var(--spacing-2) var(--spacing-2);
  }
  
  .comp-preview {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-2);
  }
  
  .comp-title {
    min-width: unset;
  }
  
  .comp-options {
    width: 100%;
  }
}
</style>