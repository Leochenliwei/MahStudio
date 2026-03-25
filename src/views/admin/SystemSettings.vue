<template>
  <div class="system-settings-container">
    <div class="page-header">
      <h3>系统设置</h3>
    </div>
    
    <div class="content-card">
      <div class="settings-section">
        <h4>基本设置</h4>
        <div class="setting-item">
          <span class="setting-label">系统名称</span>
          <input type="text" class="setting-input" value="配置面板管理中台" />
        </div>
        <div class="setting-item">
          <span class="setting-label">系统版本</span>
          <span class="setting-value">v1.0.0</span>
        </div>
      </div>
      
      <div class="settings-section">
        <h4>安全设置</h4>
        <div class="setting-item">
          <span class="setting-label">登录超时时间</span>
          <select class="setting-select">
            <option>15分钟</option>
            <option>30分钟</option>
            <option>1小时</option>
            <option>2小时</option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * SystemSettings.vue - 系统设置页面
 * 
 * 功能：系统参数配置、全局设置管理
 * 
 * @author Frontend Architect
 * @since 2026-03-19
 */
</script>

<style scoped>
.system-settings-container {
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
  padding: 24px;
}

.settings-section {
  margin-bottom: 32px;
}

.settings-section:last-child {
  margin-bottom: 0;
}

.settings-section h4 {
  margin: 0 0 16px 0;
  font-size: 16px;
  color: #1f2937;
  font-weight: 600;
  padding-bottom: 8px;
  border-bottom: 1px solid #e5e7eb;
}

.setting-item {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-label {
  width: 150px;
  font-size: 14px;
  color: #4b5563;
  font-weight: 500;
}

.setting-value {
  flex: 1;
  font-size: 14px;
  color: #1f2937;
}

.setting-input,
.setting-select {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 14px;
  color: #1f2937;
  background-color: #ffffff;
  max-width: 300px;
}

.setting-input:focus,
.setting-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}
</style>
