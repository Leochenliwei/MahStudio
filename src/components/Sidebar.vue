<template>
  <div class="sidebar">
    <div class="sidebar-header">
      <h3>配置工具</h3>
    </div>
    <div class="sidebar-content">
      <button class="btn btn-primary btn-block" @click="$emit('add-group')">
        <Icon name="plus" size="16" />
        添加分组
      </button>
      <button class="btn btn-outline btn-block" @click="$emit('open-dependency-editor')">
        <Icon name="link" size="16" />
        选项联动
      </button>
    </div>
    <div class="sidebar-footer">
      <div class="sidebar-info">
        <Icon name="info-circle" size="14" />
        <span>拖动组件调整顺序</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import Icon from './Icon.vue'

// 定义事件
const emit = defineEmits(['add-group', 'open-dependency-editor'])
</script>

<style scoped>
.sidebar {
  width: 240px;
  height: 100%;
  padding: 20px;
  border-right: 1px solid #e8e8e8;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.sidebar-header {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e8e8e8;
}

.sidebar-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #333333;
}

.sidebar-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.sidebar-footer {
  margin-top: auto;
  padding-top: 16px;
  border-top: 1px solid #e8e8e8;
}

.sidebar-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #999999;
}

/* 按钮样式 */
.btn {
  padding: 12px 16px;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  cursor: pointer;
  background: #ffffff;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.btn-primary {
  background: #1890ff;
  color: #fff;
  border-color: #1890ff;
}

.btn-primary:hover {
  background: #40a9ff;
  border-color: #40a9ff;
}

.btn-outline {
  background: #ffffff;
  color: #333333;
  border-color: #e8e8e8;
}

.btn-outline:hover {
  color: #1890ff;
  border-color: #1890ff;
  background: rgba(24, 144, 255, 0.08);
}

.btn-block {
  width: 100%;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #e8e8e8;
    padding: 16px;
    flex-direction: row;
    height: auto;
  }
  
  .sidebar-header {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
    margin-right: 24px;
  }
  
  .sidebar-content {
    flex-direction: row;
    flex: 1;
  }
  
  .btn {
    flex: 1;
  }
  
  .sidebar-footer {
    display: none;
  }
}
</style>