<template>
  <div v-if="visible" class="modal-overlay" @click="closeModal">
    <div class="modal-container" @click.stop>
      <!-- 弹窗头部 -->
      <div class="modal-header">
        <h2>变量管理</h2>
        <button class="close-btn" @click="closeModal">
          <Icon name="x" size="20" />
        </button>
      </div>
      
      <!-- 弹窗内容 -->
      <div class="modal-content">
        <!-- 搜索区域 -->
        <div class="search-section">
          <div class="search-box">
            <input 
              type="text" 
              v-model="searchKeyword" 
              placeholder="请输入变量名称" 
              class="search-input"
            >
            <button class="search-btn" @click="searchVariables">查询</button>
            <button class="add-btn" @click="openAddVariableForm">新增变量</button>
          </div>
        </div>
        
        <!-- 变量列表 -->
        <div class="variable-list">
          <table class="variable-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>变量名称</th>
                <th>变量类型</th>
                <th>变量说明</th>
                <th>创建信息</th>
                <th>编辑信息</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="variable in filteredVariables" :key="variable.id">
                <td>{{ variable.id }}</td>
                <td>{{ variable.name }}</td>
                <td>{{ getVariableTypeName(variable.type) }}</td>
                <td>{{ variable.description }}</td>
                <td>{{ variable.createdAt }}</td>
                <td>{{ variable.updatedAt }}</td>
                <td class="action-buttons">
                  <button class="action-btn view-btn" @click="openViewVariableDialog(variable)">查看</button>
                  <button class="action-btn edit-btn" @click="openEditVariableForm(variable)">编辑</button>
                  <button class="action-btn disable-btn" @click="toggleVariableStatus(variable)">{{ variable.enabled ? '禁用' : '启用' }}</button>
                  <button class="action-btn delete-btn" @click="openDeleteConfirmDialog(variable)">删除</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- 分页区域 -->
        <div class="pagination-section">
          <div class="pagination-info">
            共 {{ totalVariables }} 条数据，{{ pageSize }} 条/页
          </div>
          <div class="pagination-controls">
            <button class="page-btn" :disabled="currentPage === 1" @click="prevPage">上一页</button>
            <button 
              v-for="page in totalPages" 
              :key="page"
              class="page-btn" 
              :class="{ 'active': currentPage === page }"
              @click="currentPage = page"
            >
              {{ page }}
            </button>
            <button class="page-btn" :disabled="currentPage === totalPages" @click="nextPage">下一页</button>
            <span class="page-jump">
              跳至
              <input type="number" v-model="jumpPage" class="page-input" min="1" :max="totalPages" @change="jumpToPage">
              页
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- 变量编辑器 -->
  <VariableEditor 
    :visible="showVariableEditor" 
    :variable="editingVariable" 
    @close="closeVariableEditor" 
    @save="saveVariable"
  />
  
  <!-- 查看变量详情对话框 -->
  <div v-if="showViewDialog" class="modal-overlay" @click="closeViewDialog">
    <div class="modal-container small" @click.stop>
      <div class="modal-header">
        <h2>变量详情</h2>
        <button class="close-btn" @click="closeViewDialog">
          <Icon name="x" size="20" />
        </button>
      </div>
      <div class="modal-content">
        <div class="variable-details">
          <div class="detail-item">
            <label>ID：</label>
            <span>{{ viewingVariable?.id }}</span>
          </div>
          <div class="detail-item">
            <label>变量名称：</label>
            <span>{{ viewingVariable?.name }}</span>
          </div>
          <div class="detail-item">
            <label>变量类型：</label>
            <span>{{ viewingVariable?.type ? getVariableTypeName(viewingVariable?.type) : '未知' }}</span>
          </div>
          <div class="detail-item">
            <label>变量说明：</label>
            <span>{{ viewingVariable?.description }}</span>
          </div>
          <div class="detail-item">
            <label>状态：</label>
            <span class="status-badge" :class="{ 'enabled': viewingVariable?.enabled, 'disabled': !viewingVariable?.enabled }">{{ viewingVariable?.enabled ? '启用' : '禁用' }}</span>
          </div>
          <div class="detail-item">
            <label>创建时间：</label>
            <span>{{ viewingVariable?.createdAt }}</span>
          </div>
          <div class="detail-item">
            <label>更新时间：</label>
            <span>{{ viewingVariable?.updatedAt }}</span>
          </div>
        </div>
        <div class="dialog-actions">
          <button class="ok-btn" @click="closeViewDialog">确定</button>
        </div>
      </div>
    </div>
  </div>
  
  <!-- 删除确认对话框 -->
  <div v-if="showDeleteDialog" class="modal-overlay" @click="closeDeleteDialog">
    <div class="modal-container small" @click.stop>
      <div class="modal-header">
        <h2>确认删除</h2>
        <button class="close-btn" @click="closeDeleteDialog">
          <Icon name="x" size="20" />
        </button>
      </div>
      <div class="modal-content">
        <div class="delete-confirm">
          <p>确定要删除变量 <strong>{{ deletingVariable?.name }}</strong> 吗？</p>
          <p class="delete-warning">删除后将无法恢复，请谨慎操作。</p>
        </div>
        <div class="dialog-actions">
          <button class="cancel-btn" @click="closeDeleteDialog">取消</button>
          <button class="delete-btn" @click="deleteVariable">删除</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import Icon from './Icon.vue'
import VariableEditor from './VariableEditor.vue'

/**
 * 变量管理弹窗组件
 * 用于管理系统中的变量，支持增删改查操作
 */

// Props
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['close'])

// 搜索关键词
const searchKeyword = ref('')

// 分页相关
const currentPage = ref(1)
const pageSize = ref(10)
const jumpPage = ref(1)

// 表单和对话框状态
const showVariableEditor = ref(false)
const showViewDialog = ref(false)
const showDeleteDialog = ref(false)
const editingVariable = ref(null)
const viewingVariable = ref(null)
const deletingVariable = ref(null)

// 变量类型名称映射
const variableTypeNames = {
  pattern_fan: '牌型番',
  pattern_score: '牌型分',
  action_fan: '行为番',
  action_score: '行为分',
  status_fan: '状态番',
  status_score: '状态分',
  custom_condition: '自定义条件',
  loop_accumulate: '循环累加'
}

// 模拟变量数据
const variables = ref([
  {
    id: '100001',
    name: '牌型番',
    type: 'pattern_fan',
    description: '牌型番数计算',
    rules: [
      { group: '基本牌型', condition: '', value: 1 }
    ],
    createdAt: '2025-11-21 17:01:52',
    updatedAt: '2025-11-21 17:01:52',
    enabled: true
  },
  {
    id: '100002',
    name: '牌型分',
    type: 'pattern_score',
    description: '牌型分数计算',
    rules: [
      { group: '基本牌型', condition: '', value: 10 }
    ],
    createdAt: '2025-11-21 17:01:52',
    updatedAt: '2025-11-21 17:01:52',
    enabled: true
  },
  {
    id: '100003',
    name: '行为番',
    type: 'action_fan',
    description: '行为番数计算',
    rules: [
      { group: '基本行为', condition: '', value: 1 }
    ],
    createdAt: '2025-11-21 17:01:52',
    updatedAt: '2025-11-21 17:01:52',
    enabled: true
  },
  {
    id: '100004',
    name: '行为分',
    type: 'action_score',
    description: '行为分数计算',
    rules: [
      { group: '基本行为', condition: '', value: 5 }
    ],
    createdAt: '2025-11-21 17:01:52',
    updatedAt: '2025-11-21 17:01:52',
    enabled: true
  },
  {
    id: '100005',
    name: '状态番',
    type: 'status_fan',
    description: '状态番数计算',
    rules: [
      { group: '基本状态', condition: '', value: 1 }
    ],
    createdAt: '2025-11-21 17:01:52',
    updatedAt: '2025-11-21 17:01:52',
    enabled: true
  },
  {
    id: '100006',
    name: '状态分',
    type: 'status_score',
    description: '状态分数计算',
    rules: [
      { group: '基本状态', condition: '', value: 3 }
    ],
    createdAt: '2025-11-21 17:01:52',
    updatedAt: '2025-11-21 17:01:52',
    enabled: true
  }
])

/**
 * 计算过滤后的变量列表
 * 包括搜索过滤和分页过滤
 */
const filteredVariables = computed(() => {
  let result = variables.value
  
  // 搜索过滤
  if (searchKeyword.value) {
    result = result.filter(variable => 
      variable.name.includes(searchKeyword.value)
    )
  }
  
  // 分页过滤
  const startIndex = (currentPage.value - 1) * pageSize.value
  const endIndex = startIndex + pageSize.value
  return result.slice(startIndex, endIndex)
})

/**
 * 计算总变量数
 */
const totalVariables = computed(() => {
  return variables.value.length
})

/**
 * 计算总页数
 */
const totalPages = computed(() => {
  return Math.ceil(totalVariables.value / pageSize.value)
})

/**
 * 监听总页数变化，更新跳转页码
 */
watch(totalPages, (newTotalPages) => {
  if (jumpPage.value > newTotalPages) {
    jumpPage.value = newTotalPages
  }
})

/**
 * 获取变量类型名称
 * @param {string} type - 变量类型
 * @returns {string} 变量类型名称
 */
function getVariableTypeName(type) {
  return variableTypeNames[type] || '未知类型'
}

/**
 * 关闭变量管理弹窗
 */
function closeModal() {
  emit('close')
}

/**
 * 打开新增变量表单
 */
function openAddVariableForm() {
  editingVariable.value = null
  showVariableEditor.value = true
}

/**
 * 打开编辑变量表单
 * @param {Object} variable - 要编辑的变量对象
 */
function openEditVariableForm(variable) {
  editingVariable.value = variable
  showVariableEditor.value = true
}

/**
 * 关闭变量编辑器
 */
function closeVariableEditor() {
  showVariableEditor.value = false
  editingVariable.value = null
}

/**
 * 保存变量
 * 支持新增和编辑操作
 * @param {Object} variableData - 变量数据
 */
function saveVariable(variableData) {
  const now = new Date().toLocaleString('zh-CN')
  
  if (editingVariable.value) {
    // 编辑现有变量
    const index = variables.value.findIndex(v => v.id === editingVariable.value.id)
    if (index !== -1) {
      variables.value[index] = {
        ...variables.value[index],
        ...variableData,
        updatedAt: now
      }
    }
  } else {
    // 新增变量
    try {
      // 生成新ID
      const lastVariable = variables.value[variables.value.length - 1]
      const newId = lastVariable 
        ? String(parseInt(lastVariable.id) + 1).padStart(6, '0')
        : '100001'
      
      const newVariable = {
        id: newId,
        ...variableData,
        createdAt: now,
        updatedAt: now,
        enabled: true
      }
      variables.value.push(newVariable)
    } catch (error) {
      console.error('新增变量失败:', error)
      alert('新增变量失败，请重试')
      return
    }
  }
  
  closeVariableEditor()
}

/**
 * 打开查看变量对话框
 * @param {Object} variable - 要查看的变量对象
 */
function openViewVariableDialog(variable) {
  viewingVariable.value = variable
  showViewDialog.value = true
}

/**
 * 关闭查看变量对话框
 */
function closeViewDialog() {
  showViewDialog.value = false
  viewingVariable.value = null
}

/**
 * 打开删除确认对话框
 * @param {Object} variable - 要删除的变量对象
 */
function openDeleteConfirmDialog(variable) {
  deletingVariable.value = variable
  showDeleteDialog.value = true
}

/**
 * 关闭删除确认对话框
 */
function closeDeleteDialog() {
  showDeleteDialog.value = false
  deletingVariable.value = null
}

/**
 * 删除变量
 */
function deleteVariable() {
  if (deletingVariable.value) {
    try {
      const index = variables.value.findIndex(v => v.id === deletingVariable.value.id)
      if (index !== -1) {
        variables.value.splice(index, 1)
      }
      closeDeleteDialog()
    } catch (error) {
      console.error('删除变量失败:', error)
      alert('删除变量失败，请重试')
    }
  }
}

/**
 * 切换变量状态
 * @param {Object} variable - 要切换状态的变量对象
 */
function toggleVariableStatus(variable) {
  try {
    variable.enabled = !variable.enabled
    variable.updatedAt = new Date().toLocaleString('zh-CN')
  } catch (error) {
    console.error('切换变量状态失败:', error)
    alert('切换变量状态失败，请重试')
  }
}

/**
 * 搜索变量
 */
function searchVariables() {
  currentPage.value = 1
}

/**
 * 上一页
 */
function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

/**
 * 下一页
 */
function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

/**
 * 跳转到指定页
 */
function jumpToPage() {
  let page = parseInt(jumpPage.value)
  if (isNaN(page)) {
    page = 1
  }
  if (page < 1) {
    page = 1
  }
  if (page > totalPages.value) {
    page = totalPages.value
  }
  currentPage.value = page
  jumpPage.value = page
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
  max-width: 1200px;
  max-height: 80vh;
  background-color: var(--color-surface);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-lg);
  display: flex;
  flex-direction: column;
  overflow: hidden;
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
  display: flex;
  flex-direction: column;
  gap: var(--spacing-6);
}

.search-section {
  margin-bottom: var(--spacing-4);
}

.search-box {
  display: flex;
  gap: var(--spacing-4);
  align-items: center;
}

.search-input {
  flex: 1;
  max-width: 400px;
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

.search-btn,
.add-btn {
  padding: var(--spacing-3) var(--spacing-6);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--transition-normal);
  border: 1px solid var(--color-border);
}

.search-btn {
  background-color: var(--color-surface);
  color: var(--color-text-primary);
}

.search-btn:hover {
  background-color: var(--color-surface-hover);
  border-color: var(--color-primary);
}

.add-btn {
  background-color: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

.add-btn:hover {
  background-color: var(--color-primary-hover);
}

.variable-list {
  flex: 1;
  overflow: auto;
}

.variable-table {
  width: 100%;
  border-collapse: collapse;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  overflow: hidden;
}

.variable-table th,
.variable-table td {
  padding: var(--spacing-4);
  text-align: left;
  border-bottom: 1px solid var(--color-border);
}

.variable-table th:nth-child(3),
.variable-table td:nth-child(3) {
  min-width: 120px;
}

.variable-table th {
  background-color: var(--color-surface-hover);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
}

.variable-table tr:hover {
  background-color: var(--color-surface-hover);
}

.action-buttons {
  display: flex;
  gap: var(--spacing-2);
}

.action-btn {
  padding: var(--spacing-2) var(--spacing-4);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--transition-normal);
  border: 1px solid var(--color-border);
}

.view-btn {
  background-color: var(--color-surface);
  color: var(--color-text-primary);
}

.view-btn:hover {
  background-color: var(--color-surface-hover);
  border-color: var(--color-primary);
}

.edit-btn {
  background-color: var(--color-surface);
  color: var(--color-primary);
  border-color: var(--color-primary);
}

.edit-btn:hover {
  background-color: rgba(100, 108, 255, 0.1);
}

.disable-btn {
  background-color: var(--color-surface);
  color: #f97316;
  border-color: #f97316;
}

.disable-btn:hover {
  background-color: rgba(249, 115, 22, 0.1);
}

.delete-btn {
  background-color: var(--color-surface);
  color: #ef4444;
  border-color: #ef4444;
}

.delete-btn:hover {
  background-color: rgba(239, 68, 68, 0.1);
}

.pagination-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: var(--spacing-4);
  padding-top: var(--spacing-4);
  border-top: 1px solid var(--color-border);
}

.pagination-info {
  font-size: var(--font-size-sm);
  color: var(--color-text-tertiary);
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
}

.page-btn {
  padding: var(--spacing-2) var(--spacing-4);
  background-color: var(--color-surface);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: all var(--transition-normal);
}

.page-btn:hover:not(:disabled) {
  background-color: var(--color-surface-hover);
  border-color: var(--color-primary);
}

.page-btn.active {
  background-color: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-jump {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
}

.page-input {
  width: 60px;
  padding: var(--spacing-2) var(--spacing-3);
  background-color: var(--color-surface-hover);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
  text-align: center;
}

.page-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(100, 108, 255, 0.2);
}

/* 小型弹窗容器 */
.modal-container.small {
  width: 500px;
  max-width: 90%;
  max-height: 80vh;
}

/* 变量表单样式 */
.variable-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-6);
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

.form-input,
.form-textarea {
  padding: var(--spacing-3) var(--spacing-4);
  background-color: var(--color-surface-hover);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
  transition: all var(--transition-normal);
  font-family: inherit;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(100, 108, 255, 0.2);
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-4);
  margin-top: var(--spacing-4);
}

.cancel-btn,
.submit-btn {
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

/* 变量详情样式 */
.variable-details {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
  margin-bottom: var(--spacing-6);
}

.detail-item {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-4);
}

.detail-item label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-tertiary);
  min-width: 100px;
}

.detail-item span {
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
  flex: 1;
}

.status-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: var(--border-radius-full);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
}

.status-badge.enabled {
  background-color: rgba(16, 185, 129, 0.1);
  color: #10b981;
  border: 1px solid #10b981;
}

.status-badge.disabled {
  background-color: rgba(156, 163, 175, 0.1);
  color: #9ca3af;
  border: 1px solid #9ca3af;
}

/* 对话框操作按钮 */
.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-4);
  margin-top: var(--spacing-6);
  padding-top: var(--spacing-4);
  border-top: 1px solid var(--color-border);
}

.ok-btn {
  padding: var(--spacing-3) var(--spacing-6);
  background-color: var(--color-primary);
  color: white;
  border: 1px solid var(--color-primary);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--transition-normal);
}

.ok-btn:hover {
  background-color: var(--color-primary-hover);
}

/* 删除确认样式 */
.delete-confirm {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
}

.delete-confirm p {
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
  line-height: var(--line-height-normal);
}

.delete-warning {
  color: #ef4444 !important;
  font-weight: var(--font-weight-medium);
}

.dialog-actions .delete-btn {
  padding: var(--spacing-3) var(--spacing-6);
  background-color: #ef4444;
  color: white;
  border: 1px solid #ef4444;
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--transition-normal);
}

.dialog-actions .delete-btn:hover {
  background-color: #dc2626;
}
</style>