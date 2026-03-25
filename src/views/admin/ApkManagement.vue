<template>
  <div class="apk-management-container">
    <div class="page-header">
      <h3>APK管理</h3>
      <button class="action-btn" @click="showUploadModal = true">
        上传APK
      </button>
    </div>
    
    <div class="content-card">
      <div class="empty-state">
        <el-icon :size="48" class="empty-icon"><Box /></el-icon>
        <p>APK管理功能开发中...</p>
        <p class="sub-text">支持APK包上传、版本管理和灰度发布</p>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * ApkManagement.vue - APK管理页面
 * 
 * 功能：APK包管理、版本控制、灰度发布
 * 
 * @author Frontend Architect
 * @since 2026-03-19
 */

import { ref } from 'vue'
import { Box } from '@element-plus/icons-vue'

const showUploadModal = ref(false)
</script>

<style scoped>
.apk-management-container {
  width: 100%;
  height: 100%;
  padding: 24px;
  overflow-y: auto;
  background-color: #f5f5f5;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e5e7eb;
}

.page-header h3 {
  margin: 0;
  font-size: 20px;
  color: #1f2937;
  font-weight: 600;
}

.content-card {
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  min-height: 400px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  color: #9ca3af;
}

.empty-icon {
  margin-bottom: 16px;
  color: #d1d5db;
}

.empty-state p {
  margin: 0 0 8px 0;
  font-size: 16px;
}

.sub-text {
  font-size: 14px;
  color: #9ca3af;
}

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
</style>
