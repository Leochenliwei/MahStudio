<template>
  <div v-if="visible" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h4>游戏属性编辑</h4>
        <button class="modal-close-btn" @click="closeModal">
          ×
        </button>
      </div>
      <div class="modal-body">
        <!-- 唯一ID -->
        <div class="form-group">
          <label>唯一ID</label>
          <input 
            type="text" 
            v-model="formData.uniqueId" 
            class="form-input" 
            readonly
          />
        </div>
        
        <!-- 游戏名称 -->
        <div class="form-group">
          <label for="gameName">
            游戏名
            <span class="required">*</span>
          </label>
          <div class="input-with-counter">
            <input 
              type="text" 
              id="gameName" 
              v-model="formData.name" 
              placeholder="请输入游戏名称"
              class="form-input"
              maxlength="50"
            />
            <span class="counter">{{ formData.name.length }} / 50</span>
          </div>
        </div>
        
        <!-- 说明 -->
        <div class="form-group">
          <label for="gameDescription">说明</label>
          <div class="textarea-with-counter">
            <textarea 
              id="gameDescription" 
              v-model="formData.description" 
              placeholder="请输入游戏说明"
              class="form-textarea"
              rows="4"
              maxlength="200"
            ></textarea>
            <span class="counter">{{ formData.description.length }} / 200</span>
          </div>
        </div>
        
        <!-- 地区 -->
        <div class="form-group">
          <label for="gameRegion">地区</label>
          <select 
            id="gameRegion" 
            v-model="formData.region" 
            class="form-select"
          >
            <option value="江西省/南昌市/东湖区">江西省/南昌市/东湖区</option>
            <option value="湖北省/黄冈市/麻城市">湖北省/黄冈市/麻城市</option>
            <option value="广东省/深圳市">广东省/深圳市</option>
            <option value="四川省/成都市">四川省/成都市</option>
            <option value="香港特别行政区">香港特别行政区</option>
          </select>
        </div>
        
        <!-- 协作人 -->
        <div class="form-group">
          <label for="gameCollaborators">协作人</label>
          <select 
            id="gameCollaborators" 
            v-model="formData.collaborators" 
            class="form-select"
            multiple
          >
            <option value="王一博">王一博</option>
            <option value="江安明">江安明</option>
            <option value="杨孙怡">杨孙怡</option>
            <option value="张三">张三</option>
            <option value="李四">李四</option>
          </select>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn-text" @click="closeModal">取消</button>
        <button class="action-btn" @click="saveGame" :disabled="!formData.name.trim()">
          保存
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * GameInfo.vue - 游戏属性编辑弹窗组件
 * 
 * 需求关联：
 * 1. 点击编辑按钮时弹出游戏属性编辑弹窗
 * 2. 显示和编辑游戏的详细信息，包括唯一ID、游戏名、说明、地区、协作人
 * 3. 支持表单验证和字数统计
 * 
 * @author Frontend Architect
 * @since 2026-02-26
 */

import { ref, reactive, watch } from 'vue'

// ==================== Props ====================

const props = defineProps({
  /**
   * 游戏数据
   * @type {Object}
   */
  game: {
    type: Object,
    required: true
  },
  /**
   * 弹窗显示状态
   * @type {boolean}
   */
  visible: {
    type: Boolean,
    default: false
  }
})

// ==================== Emits ====================

const emit = defineEmits([
  /**
   * 关闭弹窗事件
   */
  'close',
  /**
   * 保存游戏事件
   * @param {Object} gameData - 更新后的游戏数据
   */
  'save'
])

// ==================== 状态管理 ====================

/**
 * 表单数据
 * @type {Object}
 */
const formData = reactive({
  uniqueId: '',
  name: '',
  description: '',
  region: '',
  collaborators: []
})

// 监听游戏数据变化，更新表单
watch(() => props.game, (newGame) => {
  if (newGame) {
    formData.uniqueId = newGame.uniqueId || ''
    formData.name = newGame.name || ''
    formData.description = newGame.description || ''
    formData.region = newGame.region || ''
    formData.collaborators = newGame.collaborators || []
  }
}, { deep: true, immediate: true })

// ==================== 方法函数 ====================

/**
 * 关闭弹窗
 * @description 触发close事件，通知父组件关闭弹窗
 */
function closeModal() {
  emit('close')
}

/**
 * 保存游戏
 * @description 触发save事件，通知父组件保存游戏数据
 */
function saveGame() {
  if (!formData.name.trim()) {
    alert('请输入游戏名称')
    return
  }
  
  emit('save', { ...formData })
}
</script>

<style scoped>
/* ==================== 弹窗样式 ==================== */

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
  backdrop-filter: blur(4px);
}

.modal-content {
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h4 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.modal-close-btn {
  width: 32px;
  height: 32px;
  background-color: transparent;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #6b7280;
}

.modal-close-btn:hover {
  background-color: #f0f0f0;
  border-color: #d1d5db;
  color: #1f2937;
}

.modal-body {
  margin-bottom: 20px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
}

/* ==================== 表单样式 ==================== */

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.required {
  color: #ef4444;
  margin-left: 4px;
}

.form-input,
.form-textarea,
.form-select {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  color: #1f2937;
  background-color: #ffffff;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
}

.form-select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='%236b7280' class='w-6 h-6'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5' /%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 14px center;
  background-size: 16px 16px;
  padding-right: 40px;
}

/* ==================== 计数器样式 ==================== */

.input-with-counter,
.textarea-with-counter {
  position: relative;
}

.counter {
  position: absolute;
  right: 12px;
  bottom: 10px;
  font-size: 12px;
  color: #6b7280;
  pointer-events: none;
}

.textarea-with-counter .counter {
  bottom: 12px;
}

/* ==================== 按钮样式 ==================== */

.action-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 10px 20px;
  background-color: #3b82f6;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 1px 2px rgba(59, 130, 246, 0.2);
}

.action-btn:hover {
  background-color: #2563eb;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.action-btn:active {
  background-color: #1d4ed8;
  transform: translateY(0);
}

.action-btn:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.btn-text {
  padding: 10px 20px;
  background-color: transparent;
  color: #4b5563;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-text:hover {
  background-color: #f0f0f0;
  border-color: #d1d5db;
}
</style>