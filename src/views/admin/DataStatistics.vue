<template>
  <div class="data-statistics-container">
    <div class="page-header">
      <h3>数据统计</h3>
      <div class="date-range">
        <select class="range-select">
          <option>最近7天</option>
          <option>最近30天</option>
          <option>本月</option>
          <option>上月</option>
        </select>
      </div>
    </div>
    
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon blue">
          <el-icon :size="24"><Grid /></el-icon>
        </div>
        <div class="stat-info">
          <span class="stat-value">12</span>
          <span class="stat-label">游戏总数</span>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon green">
          <el-icon :size="24"><Document /></el-icon>
        </div>
        <div class="stat-info">
          <span class="stat-value">48</span>
          <span class="stat-label">配置总数</span>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon orange">
          <el-icon :size="24"><User /></el-icon>
        </div>
        <div class="stat-info">
          <span class="stat-value">5</span>
          <span class="stat-label">活跃用户</span>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon purple">
          <el-icon :size="24"><TrendCharts /></el-icon>
        </div>
        <div class="stat-info">
          <span class="stat-value">+23%</span>
          <span class="stat-label">环比增长</span>
        </div>
      </div>
    </div>
    
    <div class="content-card">
      <div class="empty-state">
        <el-icon :size="48" class="empty-icon"><TrendCharts /></el-icon>
        <p>数据统计功能开发中...</p>
        <p class="sub-text">支持业务数据可视化分析和报表导出</p>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * DataStatistics.vue - 数据统计页面
 * 
 * 功能：业务数据统计分析、可视化图表、报表导出
 * 
 * @author Frontend Architect
 * @since 2026-03-19
 */

import { Grid, Document, User, TrendCharts } from '@element-plus/icons-vue'
</script>

<style scoped>
.data-statistics-container {
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

.range-select {
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 14px;
  color: #1f2937;
  background-color: #ffffff;
}

.range-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon.blue {
  background-color: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.stat-icon.green {
  background-color: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.stat-icon.orange {
  background-color: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.stat-icon.purple {
  background-color: rgba(139, 92, 246, 0.1);
  color: #8b5cf6;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
}

.stat-label {
  font-size: 14px;
  color: #6b7280;
  margin-top: 4px;
}

.content-card {
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  min-height: 300px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
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

@media (max-width: 1200px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
