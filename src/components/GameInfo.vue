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
            :disabled="isReadOnly"
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
              :disabled="isReadOnly"
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
            :disabled="isReadOnly"
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
            :disabled="isReadOnly"
          >
            <option value="王一博">王一博</option>
            <option value="江安明">江安明</option>
            <option value="杨孙怡">杨孙怡</option>
            <option value="张三">张三</option>
            <option value="李四">李四</option>
          </select>
        </div>
        
        <!-- 测试环境 APK -->
        <div class="form-group">
          <label>测试环境 APK</label>
          <div v-if="loading" class="loading-state">
            加载中...
          </div>
          <div v-else-if="error" class="error-state">
            {{ error }}
          </div>
          <Transfer 
            v-else
            :data="apkList"
            v-model="formData.test_apk_ids"
            left-title="可用 APK"
            right-title="已选择"
            :isReadOnly="isReadOnly"
          />
        </div>
        
        <!-- 灰度环境 APK -->
        <div class="form-group">
          <label>灰度环境 APK</label>
          <Transfer 
            v-if="!loading && !error"
            :data="apkList"
            v-model="formData.gray_apk_ids"
            left-title="可用 APK"
            right-title="已选择"
            :isReadOnly="isReadOnly"
          />
        </div>
        
        <!-- 生产环境 APK -->
        <div class="form-group">
          <label>生产环境 APK</label>
          <Transfer 
            v-if="!loading && !error"
            :data="apkList"
            v-model="formData.pro_apk_ids"
            left-title="可用 APK"
            right-title="已选择"
            :isReadOnly="isReadOnly"
          />
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn-text" @click="closeModal">取消</button>
        <button v-if="!isReadOnly" class="action-btn" @click="saveGame" :disabled="!formData.name.trim() || loading">
          {{ loading ? '保存中...' : '保存' }}
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
 * 4. 增加三个APK ID选择器：test_apk_ids、gray_apk_ids、pro_apk_ids
 * 5. 使用穿梭框组件实现APK选择交互
 * 6. 集成APK API获取可选择的APK列表
 * 
 * @author Frontend Architect
 * @since 2026-02-26
 */

import { ref, reactive, watch, onMounted } from 'vue'
import { ElNotification } from 'element-plus'
import Transfer from './Transfer.vue'
import { getAllApks } from '../api/apkApi.js'

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
  },
  /**
   * 是否为只读态
   * @type {boolean}
   */
  isReadOnly: {
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
  collaborators: [],
  test_apk_ids: [],
  gray_apk_ids: [],
  pro_apk_ids: []
})

/**
 * APK列表
 * @type {Array}
 */
const apkList = ref([])

/**
 * 加载状态
 * @type {boolean}
 */
const loading = ref(false)

/**
 * 错误信息
 * @type {string}
 */
const error = ref('')

// ==================== 生命周期 ====================

onMounted(() => {
  loadApkData()
})

// ==================== 监听 ====================

// 监听游戏数据变化，更新表单
watch(() => props.game, (newGame) => {
  console.log('Game data changed:', newGame)
  if (newGame) {
    formData.uniqueId = newGame.uniqueId || ''
    formData.name = newGame.name || ''
    formData.description = newGame.description || ''
    formData.region = newGame.region || ''
    formData.collaborators = newGame.collaborators || []
    formData.test_apk_ids = Array.isArray(newGame.test_apk_ids) ? newGame.test_apk_ids : []
    formData.gray_apk_ids = Array.isArray(newGame.gray_apk_ids) ? newGame.gray_apk_ids : []
    formData.pro_apk_ids = Array.isArray(newGame.pro_apk_ids) ? newGame.pro_apk_ids : []
    
    console.log('Form data updated:', {
      test_apk_ids: formData.test_apk_ids,
      gray_apk_ids: formData.gray_apk_ids,
      pro_apk_ids: formData.pro_apk_ids
    })
  }
}, { deep: true, immediate: true })

// ==================== 方法函数 ====================

/**
 * 加载APK数据
 * @description 从API获取APK列表
 */
async function loadApkData() {
  console.log('开始加载APK数据')
  loading.value = true
  error.value = ''
  
  try {
    const data = await getAllApks()
    console.log('API返回数据:', data)
    // 检查API返回的数据格式
    if (Array.isArray(data)) {
      // 确保每个APK项都有id和name属性
      apkList.value = data.map((item, index) => ({
        id: item.id || item.apk_id || item.apkid || index + 1,
        name: item.name || item.apk_name || item.apkname || `APK ${item.id || index + 1}`
      }))
      console.log('API加载成功，APK数量:', apkList.value.length)
    } else {
      // API返回的数据格式不正确，使用模拟数据
      throw new Error('API返回的数据格式不正确')
    }
  } catch (err) {
    console.log('API调用失败:', err)
    error.value = `加载APK数据失败：${err.message}`
    // 模拟数据，防止API调用失败
    apkList.value = [
      { id: 999999, name: '测试APK 999999' },
      { id: 1001, name: '灰度APK 1001' },
      { id: 1002, name: '灰度APK 1002' },
      { id: 2001, name: '生产APK 2001' },
      { id: 2002, name: '生产APK 2002' },
      { id: 3001, name: '其他APK 3001' }
    ]
    console.log('使用模拟数据，APK数量:', apkList.value.length)
  } finally {
    loading.value = false
    console.log('加载完成，loading:', loading.value)
    
    // 确保初始时test_apk_ids、gray_apk_ids、pro_apk_ids为空数组
    if (!Array.isArray(formData.test_apk_ids)) {
      formData.test_apk_ids = []
    }
    if (!Array.isArray(formData.gray_apk_ids)) {
      formData.gray_apk_ids = []
    }
    if (!Array.isArray(formData.pro_apk_ids)) {
      formData.pro_apk_ids = []
    }
    
    console.log('表单数据:', {
      test_apk_ids: formData.test_apk_ids,
      gray_apk_ids: formData.gray_apk_ids,
      pro_apk_ids: formData.pro_apk_ids
    })
  }
}



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
    ElNotification({
      title: '警告',
      message: '请输入游戏名称',
      type: 'warning',
      duration: 3000
    })
    return
  }
  
  // 确保传递所有字段，包括APK IDs
  const gameData = {
    uniqueId: formData.uniqueId,
    name: formData.name,
    description: formData.description,
    region: formData.region,
    collaborators: formData.collaborators,
    test_apk_ids: Array.from(formData.test_apk_ids),
    gray_apk_ids: Array.from(formData.gray_apk_ids),
    pro_apk_ids: Array.from(formData.pro_apk_ids)
  }
  
  console.log('Saving game data:', gameData)
  console.log('test_apk_ids length:', gameData.test_apk_ids.length)
  emit('save', gameData)
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
    width: 90%;
    max-width: 700px;
    max-height: 90vh;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    display: flex;
    flex-direction: column;
  }

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 24px 16px;
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
  padding: 0 24px;
  flex: 1;
  overflow-y: auto;
  max-height: calc(100vh - 200px);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px 24px;
  border-top: 1px solid #e5e7eb;
  background-color: #ffffff;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
}

/* ==================== 表单样式 ==================== */

.form-group {
  margin-bottom: 16px;
  padding: 8px 0;
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

/* ==================== 加载和错误状态 ==================== */

.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 300px;
  background-color: #f9fafb;
  border-radius: 8px;
  color: #6b7280;
  font-size: 14px;
}

.error-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 300px;
  background-color: #fef2f2;
  border-radius: 8px;
  color: #ef4444;
  font-size: 14px;
  text-align: center;
  padding: 20px;
}
</style>