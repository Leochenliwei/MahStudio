<template>
  <div class="advanced-config">
    <!-- 操作栏 -->
    <div class="action-bar">
      <button class="btn-primary" @click="addGroup">
        <Icon name="plus" size="16" />
        添加分组
      </button>
      <button class="btn-secondary" @click="openDependencyEditor">
        <Icon name="link" size="16" />
        选项联动
      </button>
      <button class="btn-secondary" @click="openAdvancedRules">
        <Icon name="sliders" size="16" />
        详细规则
      </button>
    </div>

    <!-- 分组列表 -->
    <div class="groups-list">
      <div 
        v-for="(group, index) in localGroups" 
        :key="group.id"
        class="group-item"
      >
        <!-- 分组头部 -->
        <div class="group-header">
          <div class="group-info">
            <input 
              type="text" 
              v-model="group.name"
              @change="updateGroups"
              class="group-name-input"
              placeholder="分组名称"
            >
            <span class="component-count">{{ group.components.length }}个控件</span>
          </div>
          <div class="group-actions">
            <button class="action-btn" @click="moveGroupUp(index)" :disabled="index === 0">
              <Icon name="arrow-up" size="14" />
            </button>
            <button class="action-btn" @click="moveGroupDown(index)" :disabled="index === localGroups.length - 1">
              <Icon name="arrow-down" size="14" />
            </button>
            <button class="action-btn danger" @click="deleteGroup(index)">
              <Icon name="trash-2" size="14" />
            </button>
          </div>
        </div>

        <!-- 控件列表 -->
        <div class="components-list">
          <div 
            v-for="(component, compIndex) in group.components" 
            :key="component.id"
            class="component-item"
          >
            <div class="component-header">
              <div class="component-info">
                <input 
                  type="text" 
                  v-model="component.title"
                  @change="updateGroups"
                  class="component-title-input"
                  placeholder="控件标题"
                >
                <span class="component-type">{{ getComponentTypeText(component.type) }}</span>
              </div>
              <div class="component-actions">
                <button class="action-btn" @click="editComponent(group.id, component.id)">
                  <Icon name="sliders" size="14" />
                </button>
                <button class="action-btn danger" @click="deleteComponent(group.id, compIndex)">
                  <Icon name="trash-2" size="14" />
                </button>
              </div>
            </div>

            <!-- 控件预览 -->
            <div class="component-preview">
              <div v-if="component.type === 'radio'" class="radio-preview">
                <label 
                  v-for="(option, optIndex) in component.options" 
                  :key="optIndex"
                  class="preview-option"
                >
                  <input 
                    type="radio" 
                    :checked="option.isDefault"
                    disabled
                  >
                  <span>{{ option.label }}</span>
                </label>
              </div>
              <div v-else-if="component.type === 'checkbox'" class="checkbox-preview">
                <label 
                  v-for="(option, optIndex) in component.options" 
                  :key="optIndex"
                  class="preview-option"
                >
                  <input 
                    type="checkbox" 
                    :checked="option.isDefault"
                    disabled
                  >
                  <span>{{ option.label }}</span>
                </label>
              </div>
              <div v-else-if="component.type === 'select'" class="select-preview">
                <select disabled>
                  <option 
                    v-for="(option, optIndex) in component.options" 
                    :key="optIndex"
                    :selected="option.isDefault"
                  >
                    {{ option.label }}
                  </option>
                </select>
              </div>
              <div v-else-if="component.type === 'select并联'" class="select-parallel-preview">
                <select disabled>
                  <option 
                    v-for="(option, optIndex) in component.options" 
                    :key="optIndex"
                    :selected="option.isDefault"
                  >
                    {{ option.label }}
                  </option>
                </select>
                <span class="parallel-label">+ 并联选项</span>
              </div>
            </div>
          </div>

          <!-- 空状态 -->
          <div v-if="group.components.length === 0" class="empty-components">
            <p>暂无控件</p>
          </div>
        </div>

        <!-- 添加控件栏 -->
        <div class="add-component-bar">
          <button class="component-add-btn" @click="addComponent(group.id, 'radio')">
            <Icon name="radio" size="14" />
            单选
          </button>
          <button class="component-add-btn" @click="addComponent(group.id, 'checkbox')">
            <Icon name="check-square" size="14" />
            复选
          </button>
          <button class="component-add-btn" @click="addComponent(group.id, 'select')">
            <Icon name="chevron-down" size="14" />
            下拉列表
          </button>
          <button class="component-add-btn" @click="addComponent(group.id, 'select并联')">
            <Icon name="layers" size="14" />
            下拉并联
          </button>
        </div>
      </div>
    </div>

    <!-- 控件编辑弹窗 -->
    <div v-if="showComponentEditor" class="modal-overlay" @click="closeComponentEditor">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>编辑控件属性</h3>
          <button class="close-btn" @click="closeComponentEditor">
            <Icon name="x" size="18" />
          </button>
        </div>
        <div class="modal-body">
          <div v-if="editingComponent" class="component-editor">
            <!-- 控件标题 -->
            <div class="editor-section">
              <label>控件标题</label>
              <input 
                type="text" 
                v-model="editingComponent.title"
                class="editor-input"
                placeholder="请输入控件标题"
              >
            </div>

            <!-- 选项列表 -->
            <div class="editor-section">
              <div class="section-header">
                <label>选项列表</label>
                <button class="btn-small" @click="addOption">
                  <Icon name="plus" size="12" />
                  添加选项
                </button>
              </div>
              <div class="options-list">
                <div 
                  v-for="(option, index) in editingComponent.options" 
                  :key="index"
                  class="option-item"
                >
                  <input 
                    type="text" 
                    v-model="option.label"
                    class="option-input label"
                    placeholder="选项名称"
                  >
                  <input 
                    type="text" 
                    v-model="option.value"
                    class="option-input value"
                    placeholder="选项值"
                  >
                  <label class="checkbox-option">
                    <input 
                      type="checkbox" 
                      v-model="option.isDefault"
                      @change="handleDefaultChange(index)"
                    >
                    默认
                  </label>
                  <button class="action-btn danger small" @click="removeOption(index)">
                    <Icon name="trash-2" size="12" />
                  </button>
                </div>
              </div>
            </div>

            <!-- 控件属性 -->
            <div class="editor-section">
              <label>控件属性</label>
              <div class="checkbox-option">
                <input 
                  type="checkbox" 
                  v-model="editingComponent.required"
                >
                必填项
              </div>
              <div class="checkbox-option">
                <input 
                  type="checkbox" 
                  v-model="editingComponent.disabled"
                >
                禁用
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" @click="closeComponentEditor">取消</button>
          <button class="btn-primary" @click="saveComponent">保存</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import Icon from './Icon.vue'

// Props
const props = defineProps({
  groups: {
    type: Array,
    required: true
  }
})

// Emits
const emit = defineEmits(['update:groups', 'open-advanced-rules'])

// 本地分组数据
const localGroups = ref([...props.groups])

// 弹窗状态
const showComponentEditor = ref(false)
const editingComponent = ref(null)
const editingGroupId = ref(null)

// 监听外部分组变化
watch(() => props.groups, (newGroups) => {
  localGroups.value = [...newGroups]
}, { deep: true })

// 更新分组
function updateGroups() {
  emit('update:groups', [...localGroups.value])
}

// 添加分组
function addGroup() {
  const newGroup = {
    id: `group_${Date.now()}`,
    name: `新分组${localGroups.value.length + 1}`,
    components: []
  }
  localGroups.value.push(newGroup)
  updateGroups()
}

// 删除分组
function deleteGroup(index) {
  if (confirm('确定要删除这个分组吗？')) {
    localGroups.value.splice(index, 1)
    updateGroups()
  }
}

// 上移分组
function moveGroupUp(index) {
  if (index > 0) {
    const temp = localGroups.value[index]
    localGroups.value[index] = localGroups.value[index - 1]
    localGroups.value[index - 1] = temp
    updateGroups()
  }
}

// 下移分组
function moveGroupDown(index) {
  if (index < localGroups.value.length - 1) {
    const temp = localGroups.value[index]
    localGroups.value[index] = localGroups.value[index + 1]
    localGroups.value[index + 1] = temp
    updateGroups()
  }
}

// 添加控件
function addComponent(groupId, type) {
  const group = localGroups.value.find(g => g.id === groupId)
  if (group) {
    const newComponent = {
      id: `comp_${Date.now()}`,
      type,
      title: `${getComponentTypeText(type)}控件`,
      options: [
        {
          label: '选项1',
          value: '1',
          isDefault: true
        },
        {
          label: '选项2',
          value: '2',
          isDefault: false
        }
      ],
      required: false,
      disabled: false
    }
    group.components.push(newComponent)
    updateGroups()
  }
}

// 删除控件
function deleteComponent(groupId, compIndex) {
  const group = localGroups.value.find(g => g.id === groupId)
  if (group) {
    group.components.splice(compIndex, 1)
    updateGroups()
  }
}

// 编辑控件
function editComponent(groupId, componentId) {
  const group = localGroups.value.find(g => g.id === groupId)
  if (group) {
    const component = group.components.find(c => c.id === componentId)
    if (component) {
      editingComponent.value = JSON.parse(JSON.stringify(component))
      editingGroupId.value = groupId
      showComponentEditor.value = true
    }
  }
}

// 关闭控件编辑器
function closeComponentEditor() {
  showComponentEditor.value = false
  editingComponent.value = null
  editingGroupId.value = null
}

// 保存控件
function saveComponent() {
  if (editingGroupId.value && editingComponent.value) {
    const group = localGroups.value.find(g => g.id === editingGroupId.value)
    if (group) {
      const componentIndex = group.components.findIndex(c => c.id === editingComponent.value.id)
      if (componentIndex !== -1) {
        group.components[componentIndex] = { ...editingComponent.value }
        updateGroups()
      }
    }
    closeComponentEditor()
  }
}

// 添加选项
function addOption() {
  if (editingComponent.value) {
    editingComponent.value.options.push({
      label: `选项${editingComponent.value.options.length + 1}`,
      value: `${editingComponent.value.options.length + 1}`,
      isDefault: false
    })
  }
}

// 删除选项
function removeOption(index) {
  if (editingComponent.value && editingComponent.value.options.length > 1) {
    editingComponent.value.options.splice(index, 1)
  }
}

// 处理默认值变化
function handleDefaultChange(index) {
  if (editingComponent.value && editingComponent.value.type === 'radio') {
    // 单选只能有一个默认值
    editingComponent.value.options.forEach((option, i) => {
      if (i !== index) {
        option.isDefault = false
      }
    })
  }
}

// 获取控件类型文本
function getComponentTypeText(type) {
  const typeMap = {
    'radio': '单选',
    'checkbox': '复选',
    'select': '下拉列表',
    'select并联': '下拉并联'
  }
  return typeMap[type] || type
}

// 打开选项联动编辑器
function openDependencyEditor() {
  alert('选项联动功能开发中')
}

// 打开详细规则页面
function openAdvancedRules() {
  emit('open-advanced-rules')
}
</script>

<style scoped>
.advanced-config {
  padding: var(--spacing-6);
  overflow-y: auto;
  max-height: 60vh;
}

/* 操作栏 */
.action-bar {
  display: flex;
  gap: var(--spacing-4);
  margin-bottom: var(--spacing-6);
  padding-bottom: var(--spacing-4);
  border-bottom: 1px solid var(--color-border);
}

.btn-primary {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
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
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
}

.btn-secondary {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
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

/* 分组列表 */
.groups-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-6);
}

.group-item {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

/* 分组头部 */
.group-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-4) var(--spacing-6);
  background-color: var(--color-surface-hover);
  border-bottom: 1px solid var(--color-border);
}

.group-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-4);
  flex: 1;
}

.group-name-input {
  flex: 1;
  padding: var(--spacing-2) var(--spacing-3);
  background-color: var(--color-surface);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

.group-name-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(100, 108, 255, 0.2);
}

.component-count {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  background-color: var(--color-surface);
  padding: 2px 8px;
  border-radius: var(--border-radius-full);
  border: 1px solid var(--color-border);
}

.group-actions {
  display: flex;
  gap: var(--spacing-2);
}

/* 控件列表 */
.components-list {
  padding: var(--spacing-4);
  min-height: 100px;
}

.empty-components {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80px;
  color: var(--color-text-tertiary);
  font-size: var(--font-size-sm);
}

/* 控件项 */
.component-item {
  margin-bottom: var(--spacing-4);
  padding: var(--spacing-4);
  background-color: var(--color-surface-hover);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  transition: all var(--transition-normal);
}

.component-item:hover {
  border-color: var(--color-primary);
  box-shadow: 0 2px 8px rgba(100, 108, 255, 0.1);
}

.component-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-3);
}

.component-title-input {
  flex: 1;
  padding: var(--spacing-2) var(--spacing-3);
  background-color: var(--color-surface);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
}

.component-title-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(100, 108, 255, 0.2);
}

.component-type {
  font-size: var(--font-size-xs);
  color: var(--color-primary);
  background-color: rgba(100, 108, 255, 0.1);
  padding: 2px 8px;
  border-radius: var(--border-radius-full);
  border: 1px solid var(--color-primary);
  margin-left: var(--spacing-3);
}

.component-actions {
  display: flex;
  gap: var(--spacing-2);
}

/* 控件预览 */
.component-preview {
  padding: var(--spacing-3);
  background-color: var(--color-surface);
  border-radius: var(--border-radius-md);
  border: 1px solid var(--color-border);
}

.radio-preview,
.checkbox-preview {
  display: flex;
  gap: var(--spacing-4);
  flex-wrap: wrap;
}

.preview-option {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.select-preview select,
.select-parallel-preview select {
  width: 100%;
  padding: var(--spacing-2) var(--spacing-3);
  background-color: var(--color-surface-hover);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
}

.select-parallel-preview {
  position: relative;
}

.parallel-label {
  position: absolute;
  right: var(--spacing-3);
  top: 50%;
  transform: translateY(-50%);
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
  background-color: rgba(100, 108, 255, 0.1);
  padding: 1px 6px;
  border-radius: var(--border-radius-sm);
}

/* 添加控件栏 */
.add-component-bar {
  display: flex;
  gap: var(--spacing-2);
  padding: var(--spacing-4);
  background-color: var(--color-surface-hover);
  border-top: 1px solid var(--color-border);
}

.component-add-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-2) var(--spacing-4);
  background-color: var(--color-surface);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  cursor: pointer;
  font-size: var(--font-size-xs);
  transition: all var(--transition-normal);
}

.component-add-btn:hover {
  background-color: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

/* 操作按钮 */
.action-btn {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-surface);
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  cursor: pointer;
  transition: all var(--transition-normal);
}

.action-btn:hover:not(:disabled) {
  background-color: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

.action-btn.danger:hover:not(:disabled) {
  background-color: var(--color-danger);
  border-color: var(--color-danger);
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.action-btn.small {
  width: 24px;
  height: 24px;
}

/* 模态框 */
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
  max-width: 600px;
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

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-4);
  padding: var(--spacing-4) var(--spacing-6);
  border-top: 1px solid var(--color-border);
  background-color: var(--color-surface-hover);
}

/* 编辑器样式 */
.editor-section {
  margin-bottom: var(--spacing-4);
}

.editor-section label {
  display: block;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-2);
}

.editor-input {
  width: 100%;
  padding: var(--spacing-3) var(--spacing-4);
  background-color: var(--color-surface);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
}

.editor-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(100, 108, 255, 0.2);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-3);
}

.btn-small {
  display: flex;
  align-items: center;
  gap: var(--spacing-1);
  padding: var(--spacing-1) var(--spacing-3);
  background-color: var(--color-primary);
  color: white;
  border: 1px solid var(--color-primary);
  border-radius: var(--border-radius-md);
  cursor: pointer;
  font-size: var(--font-size-xs);
  transition: all var(--transition-normal);
}

.btn-small:hover {
  background-color: var(--color-primary-hover);
  border-color: var(--color-primary-hover);
}

.options-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.option-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-2);
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
}

.option-input {
  padding: var(--spacing-2) var(--spacing-3);
  background-color: var(--color-surface-hover);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
}

.option-input.label {
  flex: 2;
}

.option-input.value {
  flex: 1;
}

.option-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(100, 108, 255, 0.2);
}

.checkbox-option {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

/* 小屏幕适配 */
@media (max-width: 768px) {
  .action-bar {
    flex-wrap: wrap;
  }
  
  .group-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-3);
  }
  
  .group-info {
    width: 100%;
  }
  
  .group-actions {
    width: 100%;
    justify-content: flex-end;
  }
  
  .add-component-bar {
    flex-wrap: wrap;
  }
  
  .component-add-btn {
    flex: 1;
    min-width: 80px;
  }
}
</style>