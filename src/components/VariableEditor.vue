<template>
  <div v-if="visible" class="modal-overlay" @click="closeModal">
    <div class="modal-container" @click.stop>
      <!-- 弹窗头部 -->
      <div class="modal-header">
        <h2>{{ editingVariable ? '编辑变量' : '新增变量' }}</h2>
        <button class="close-btn" @click="closeModal">
          <Icon name="x" size="20" />
        </button>
      </div>
      
      <!-- 弹窗内容 -->
      <div class="modal-content">
        <form class="variable-form" @submit.prevent="saveVariable">
          <!-- 基本信息 -->
          <div class="form-section">
            <div class="form-grid">
              <div class="form-group">
                <label>变量名称*</label>
                <input 
                  type="text" 
                  v-model="formData.name" 
                  placeholder="请输入变量名称" 
                  class="form-input"
                >
              </div>
              <div class="form-group">
                <label>变量类型*</label>
                <select v-model="formData.type" class="form-select">
                  <option value="">请选择变量类型</option>
                  <!-- 分组计算类 -->
                  <optgroup label="计算类">
                    <option value="group_sum">组内相加</option>
                    <option value="group_product">组内相乘</option>
                    <option value="group_max">组内取最大</option>
                    <option value="group_min">组内取最小</option>
                  </optgroup>
                  <!-- 条件判断类 -->
                  <optgroup label="条件判断类">
                    <option value="condition_holds">判断是否成立</option>
                  </optgroup>
                  <!-- 循环/聚合类 -->
                  <optgroup label="循环/聚合类">
                    <option value="all_condition_holds">依次判断是否[同时]成立</option>
                    <option value="any_condition_holds">依次判断是否[任意]成立</option>
                    <option value="loop_sum">累加</option>
                    <option value="loop_product">累乘</option>
                  </optgroup>
                </select>
              </div>
            </div>
            <div class="form-group">
              <label>变量说明（可选）</label>
              <textarea 
                v-model="formData.description" 
                placeholder="请输入变量说明" 
                class="form-textarea"
                rows="3"
              ></textarea>
            </div>
          </div>
          
          <!-- 变量配置 - 根据类型显示不同的编辑视图 -->
          <div v-if="formData.type" class="form-section">
            <h3 class="section-title">变量配置</h3>
            
            <!-- 分组计算类配置 -->
            <div v-if="isGroupCalculationType" class="variable-config">
              <!-- 虚拟表格配置 -->
              <div class="config-section">
                <h4 class="config-subtitle">规则配置</h4>
                <div class="virtual-table">
                  <div class="table-header">
                    <div class="table-cell">元素</div>
                   
                    <div class="table-cell">数值</div>
                    <div class="table-cell">操作</div>
                  </div>
                  <div class="table-body">
                    <div 
                      v-for="(rule, index) in formData.rules" 
                      :key="index"
                      class="table-row"
                    >
                      <div class="table-cell">
                        <CustomSelect 
                          v-model="rule.group" 
                          placeholder="请选择元素"
                          label-key="label"
                          value-key="value"
                        />
                      </div>
                    
                      <div class="table-cell">
                        <input 
                          type="number" 
                          v-model.number="rule.value" 
                          placeholder="请输入数值" 
                          class="form-input small"
                        >
                      </div>
                      <div class="table-cell">
                        <button 
                          class="remove-btn" 
                          @click="removeRule(index)"
                        >
                          删除
                        </button>
                      </div>
                    </div>
                  </div>
                  <div class="table-footer">
                    <button 
                      class="add-rule-btn" 
                      @click="addRule"
                    >
                      添加规则
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 条件判断类配置 -->
            <div v-else-if="formData.type === 'condition_holds'" class="variable-config">
              <div class="config-section">
                <h4 class="config-subtitle">条件配置</h4>
                <div class="condition-editor">
                  <div class="condition-builder">
                    <h5>条件表达式</h5>
                    <div class="expression-builder">
                      <button 
                        class="add-condition-btn" 
                        @click="openConditionEditor"
                      >
                        编辑条件
                      </button>
                      <div v-if="formData.condition" class="condition-preview">
                        {{ formData.condition }}
                      </div>
                    </div>
                  </div>
                  <div class="result-config">
                    <h5>结果配置</h5>
                    <div class="form-group">
                      <label>满足条件返回值</label>
                      <input 
                        type="number" 
                        v-model.number="formData.trueValue" 
                        placeholder="请输入数值" 
                        class="form-input"
                      >
                    </div>
                    <div class="form-group">
                      <label>不满足条件返回值</label>
                      <input 
                        type="number" 
                        v-model.number="formData.falseValue" 
                        placeholder="请输入数值" 
                        class="form-input"
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 循环/聚合类配置 -->
            <div v-else-if="['all_condition_holds', 'any_condition_holds', 'loop_sum', 'loop_product'].includes(formData.type)" class="variable-config">
              <div class="config-section">
                <h4 class="config-subtitle">循环配置</h4>
                <div class="loop-config">
                  <div class="form-group">
                    <label>循环对象</label>
                    <select v-model="formData.loopObject" class="form-select">
                      <option value="cards">牌</option>
                      <option value="actions">行为</option>
                      <option value="states">状态</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label>循环条件</label>
                    <button 
                      class="condition-btn" 
                      @click="openConditionEditor"
                    >
                      编辑条件
                    </button>
                  </div>
                  <div class="form-group">
                    <label>累加字段</label>
                    <input 
                      type="text" 
                      v-model="formData.accumulateField" 
                      placeholder="请输入累加字段" 
                      class="form-input"
                    >
                  </div>
                  <div class="form-group">
                    <label>初始值</label>
                    <input 
                      type="number" 
                      v-model.number="formData.initialValue" 
                      placeholder="请输入初始值" 
                      class="form-input"
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 表单操作 -->
          <div class="form-actions">
            <button type="button" class="cancel-btn" @click="closeModal">取消</button>
            <button type="submit" class="submit-btn">保存</button>
          </div>
        </form>
      </div>
    </div>
  </div>
  
  <!-- 条件编辑器 -->
  <div v-if="showConditionEditor" class="modal-overlay" @click="closeConditionEditor">
    <div class="modal-container small" @click.stop>
      <div class="modal-header">
        <h2>编辑条件</h2>
        <button class="close-btn" @click="closeConditionEditor">
          <Icon name="x" size="20" />
        </button>
      </div>
      <div class="modal-content">
        <div class="condition-editor-content">
          <p>条件编辑器功能开发中...</p>
          <div class="form-group">
            <label>条件表达式</label>
            <input 
              type="text" 
              v-model="tempCondition" 
              placeholder="请输入条件表达式" 
              class="form-input"
            >
          </div>
        </div>
        <div class="form-actions">
          <button type="button" class="cancel-btn" @click="closeConditionEditor">取消</button>
          <button type="button" class="submit-btn" @click="saveCondition">保存</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import Icon from './Icon.vue'
import CustomSelect from './CustomSelect.vue'

/**
 * 变量编辑器组件
 * 用于编辑和创建不同类型的变量
 */

// Props
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  variable: {
    type: Object,
    default: null
  }
})

// Emits
const emit = defineEmits(['close', 'save'])

// 表单数据
const formData = ref({
  name: '',
  type: '',
  description: '',
  rules: [],
  condition: '',
  trueValue: 1,
  falseValue: 0,
  loopObject: 'cards',
  accumulateField: '',
  initialValue: 0
})

// 编辑状态
const editingVariable = ref(null)

/**
 * 分组选项数据
 */
const groupOptions = ref([
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
])

/**
 * 分组标签页配置
 */
const groupTabs = ref([
  { label: '状态', filter: (opt) => opt.category === 'zhuangtai' },
  { label: '牌局', filter: (opt) => opt.category === 'paiju' },
  { label: '身份', filter: (opt) => opt.category === 'shenfen' },
  { label: '牌型', filter: (opt) => opt.category === 'pai_type' }
])

// 条件编辑器状态
const showConditionEditor = ref(false)
const tempCondition = ref('')
const currentRuleIndex = ref(-1)

/**
 * 计算是否为分组计算类型
 */
const isGroupCalculationType = computed(() => {
  return [
    'group_sum', 'group_product', 
    'group_max', 'group_min'
  ].includes(formData.value.type)
})

/**
 * 监听变量变化，初始化表单数据
 */
watch(() => props.variable, (newVariable) => {
  if (newVariable) {
    editingVariable.value = newVariable
    formData.value = {
      name: newVariable.name || '',
      type: newVariable.type || '',
      description: newVariable.description || '',
      rules: newVariable.rules || [],
      condition: newVariable.condition || '',
      trueValue: newVariable.trueValue || 1,
      falseValue: newVariable.falseValue || 0,
      loopObject: newVariable.loopObject || 'cards',
      accumulateField: newVariable.accumulateField || '',
      initialValue: newVariable.initialValue || 0
    }
  } else {
    editingVariable.value = null
    resetForm()
  }
}, { immediate: true })

/**
 * 重置表单
 */
function resetForm() {
  formData.value = {
    name: '',
    type: '',
    description: '',
    rules: [],
    condition: '',
    trueValue: 1,
    falseValue: 0,
    loopObject: 'cards',
    accumulateField: '',
    initialValue: 0
  }
}

/**
 * 关闭弹窗
 */
function closeModal() {
  emit('close')
}

/**
 * 保存变量
 */
function saveVariable() {
  // 表单验证
  if (!formData.value.name.trim()) {
    alert('请输入变量名称')
    return
  }
  
  if (!formData.value.type) {
    alert('请选择变量类型')
    return
  }
  
  emit('save', formData.value)
  closeModal()
}

/**
 * 添加规则
 */
function addRule() {
  formData.value.rules.push({
    group: '',
    condition: '',
    value: 0
  })
}

/**
 * 删除规则
 * @param {number} index - 规则索引
 */
function removeRule(index) {
  formData.value.rules.splice(index, 1)
}

/**
 * 打开条件编辑器
 * @param {number} index - 规则索引
 */
function openConditionEditor(index = -1) {
  currentRuleIndex.value = index
  if (index >= 0 && formData.value.rules[index]) {
    tempCondition.value = formData.value.rules[index].condition || ''
  } else {
    tempCondition.value = formData.value.condition || ''
  }
  showConditionEditor.value = true
}

/**
 * 关闭条件编辑器
 */
function closeConditionEditor() {
  showConditionEditor.value = false
  tempCondition.value = ''
  currentRuleIndex.value = -1
}

/**
 * 保存条件
 */
function saveCondition() {
  if (currentRuleIndex.value >= 0 && formData.value.rules[currentRuleIndex.value]) {
    formData.value.rules[currentRuleIndex.value].condition = tempCondition.value
  } else {
    formData.value.condition = tempCondition.value
  }
  closeConditionEditor()
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
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-container {
  width: 90%;
  max-width: 1000px;
  max-height: 80vh;
  background-color: var(--color-surface);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-lg);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-container.small {
  width: 600px;
  max-width: 90%;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-6);
  border-bottom: 1px solid var(--color-border);
  background-color: var(--color-surface-hover);
}

.modal-header h2 {
  margin: 0;
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

.close-btn {
  background: none;
  border: none;
  color: var(--color-text-primary);
  cursor: pointer;
  padding: var(--spacing-2);
  border-radius: var(--border-radius-md);
  transition: all var(--transition-normal);
}

.close-btn:hover {
  background-color: var(--color-surface-hover);
  color: var(--color-primary);
}

.modal-content {
  flex: 1;
  padding: var(--spacing-6);
  overflow-y: auto;
}

/* 表单样式 */
.variable-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
}

.form-section {
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-6);
  background-color: var(--color-surface-hover);
}

.section-title {
  margin: 0 0 var(--spacing-4) 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  border-bottom: 1px solid var(--color-border);
  padding-bottom: var(--spacing-2);
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-4);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.form-group label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

.form-input, .form-select {
  padding: var(--spacing-3) var(--spacing-4);
  background-color: var(--color-surface);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
  transition: all var(--transition-normal);
  font-family: inherit;
}

.form-input:focus, .form-select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(100, 108, 255, 0.2);
}

.form-input.small {
  width: 100%;
}

.form-textarea {
  padding: var(--spacing-3) var(--spacing-4);
  background-color: var(--color-surface);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
  transition: all var(--transition-normal);
  font-family: inherit;
  resize: vertical;
  min-height: 100px;
}

.form-textarea:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(100, 108, 255, 0.2);
}

/* 配置区域样式 */
.config-section {
  margin-top: var(--spacing-4);
}

.config-subtitle {
  margin: 0 0 var(--spacing-4) 0;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
}

/* 虚拟表格样式 */
.virtual-table {
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  overflow: hidden;
  margin-bottom: var(--spacing-4);
}

.table-header {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr 1fr;
  gap: var(--spacing-2);
  padding: var(--spacing-3);
  background-color: var(--color-surface-hover);
  border-bottom: 1px solid var(--color-border);
  font-weight: var(--font-weight-medium);
  font-size: var(--font-size-sm);
}

.table-row {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr 1fr;
  gap: var(--spacing-2);
  padding: var(--spacing-3);
  border-bottom: 1px solid var(--color-border);
  align-items: center;
}

.table-row:last-child {
  border-bottom: none;
}

.table-footer {
  padding: var(--spacing-3);
  background-color: var(--color-surface-hover);
  border-top: 1px solid var(--color-border);
  text-align: center;
}

/* 按钮样式 */
.condition-btn {
  padding: var(--spacing-2) var(--spacing-4);
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: all var(--transition-normal);
}

.condition-btn:hover {
  background-color: var(--color-primary-hover);
}

.remove-btn {
  padding: var(--spacing-2) var(--spacing-4);
  background-color: #ef4444;
  color: white;
  border: none;
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: all var(--transition-normal);
}

.remove-btn:hover {
  background-color: #dc2626;
}

.add-rule-btn {
  padding: var(--spacing-3) var(--spacing-6);
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: all var(--transition-normal);
}

.add-rule-btn:hover {
  background-color: var(--color-primary-hover);
}

/* 条件编辑器样式 */
.condition-editor {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-6);
}

.condition-builder {
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-4);
  background-color: var(--color-surface);
}

.condition-builder h5 {
  margin: 0 0 var(--spacing-3) 0;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

.expression-builder {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
}

.add-condition-btn {
  padding: var(--spacing-3) var(--spacing-6);
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: all var(--transition-normal);
}

.add-condition-btn:hover {
  background-color: var(--color-primary-hover);
}

.condition-preview {
  padding: var(--spacing-3);
  background-color: var(--color-surface-hover);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
  min-height: 60px;
  display: flex;
  align-items: center;
}

.result-config {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
}

/* 循环配置样式 */
.loop-config {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
}

/* 表单操作 */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-4);
  margin-top: var(--spacing-4);
  padding-top: var(--spacing-4);
  border-top: 1px solid var(--color-border);
}

.cancel-btn, .submit-btn {
  padding: var(--spacing-3) var(--spacing-6);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--transition-normal);
  border: 1px solid var(--color-border);
}

.cancel-btn {
  background-color: var(--color-surface);
  color: var(--color-text-primary);
}

.cancel-btn:hover {
  background-color: var(--color-surface-hover);
  border-color: var(--color-primary);
}

.submit-btn {
  background-color: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

.submit-btn:hover {
  background-color: var(--color-primary-hover);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .table-header,
  .table-row {
    grid-template-columns: 1fr;
    gap: var(--spacing-3);
  }
}
</style>