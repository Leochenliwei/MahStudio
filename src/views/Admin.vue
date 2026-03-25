<template>
  <div class="admin-home-container">
    <!-- 欢迎区域 -->
    <div class="welcome-section">
      <h1>欢迎使用配置面板管理中台</h1>
      <p class="subtitle">高效管理游戏配置，支持多环境发布和版本控制</p>
    </div>

    <!-- 快捷入口 -->
    <div class="quick-access">
      <h3>快捷入口</h3>
      <div class="access-grid">
        <div
          v-for="menu in mainMenus"
          :key="menu.id"
          class="access-card"
          @click="openMenu(menu)"
        >
          <div class="card-icon">
            <el-icon :size="32">
              <component :is="getIconComponent(menu.icon)" />
            </el-icon>
          </div>
          <div class="card-info">
            <h4>{{ menu.name }}</h4>
            <p>{{ menu.description }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 统计概览 -->
    <div class="stats-overview">
      <h3>数据概览</h3>
      <div class="stats-grid">
        <div class="stat-item">
          <span class="stat-number">{{ gameCount }}</span>
          <span class="stat-label">游戏总数</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">{{ configCount }}</span>
          <span class="stat-label">配置总数</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">{{ draftCount }}</span>
          <span class="stat-label">草稿数量</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">{{ onlineCount }}</span>
          <span class="stat-label">线上配置</span>
        </div>
      </div>
    </div>

    <!-- 最近活动 -->
    <div class="recent-activity">
      <h3>最近活动</h3>
      <div class="activity-list">
        <div class="activity-item">
          <el-icon :size="16"><Document /></el-icon>
          <span class="activity-text">系统初始化完成</span>
          <span class="activity-time">刚刚</span>
        </div>
        <div class="activity-item">
          <el-icon :size="16"><Grid /></el-icon>
          <span class="activity-text">游戏配置管理功能已就绪</span>
          <span class="activity-time">刚刚</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * Admin.vue - 管理后台首页
 *
 * 功能：
 * 1. 欢迎页面和快捷入口
 * 2. 数据概览展示
 * 3. 最近活动记录
 *
 * @author Frontend Architect
 * @since 2026-03-19
 */

import { ref, onMounted } from 'vue'
import { Grid, Box, User, Setting, Document, TrendCharts } from '@element-plus/icons-vue'
import { getMainMenus } from '../config/menuConfig.js'
import { getAllGames } from '../api/gameApi.js'

// ==================== 图标映射 ====================
const iconComponents = {
  Grid,
  Box,
  User,
  Setting,
  Document,
  TrendCharts
}

function getIconComponent(iconName) {
  return iconComponents[iconName] || Grid
}

// ==================== 数据 ====================
const mainMenus = ref(getMainMenus())
const gameCount = ref(0)
const configCount = ref(0)
const draftCount = ref(0)
const onlineCount = ref(0)

// ==================== 方法 ====================

/**
 * 打开菜单
 * @param {Object} menu - 菜单配置
 */
function openMenu(menu) {
  if (window.openMenuTab) {
    window.openMenuTab(menu)
  }
}

/**
 * 加载统计数据
 */
async function loadStats() {
  try {
    const games = await getAllGames()
    gameCount.value = games.length
    // 这里可以根据实际需求计算其他统计数据
    configCount.value = games.length * 4 // 估算
    draftCount.value = Math.floor(games.length * 1.5)
    onlineCount.value = Math.floor(games.length * 0.8)
  } catch (error) {
    console.error('加载统计数据失败:', error)
  }
}

// ==================== 生命周期 ====================
onMounted(() => {
  loadStats()
})
</script>

<style scoped>
.admin-home-container {
  width: 100%;
  height: 100%;
  padding: 32px;
  overflow-y: auto;
  background-color: #f5f5f5;
}

/* 欢迎区域 */
.welcome-section {
  margin-bottom: 32px;
}

.welcome-section h1 {
  margin: 0 0 8px 0;
  font-size: 28px;
  font-weight: 600;
  color: #1f2937;
}

.subtitle {
  margin: 0;
  font-size: 16px;
  color: #6b7280;
}

/* 快捷入口 */
.quick-access {
  margin-bottom: 32px;
}

.quick-access h3 {
  margin: 0 0 16px 0;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.access-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.access-card {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.access-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-color: #3b82f6;
}

.card-icon {
  width: 56px;
  height: 56px;
  background-color: rgba(59, 130, 246, 0.1);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3b82f6;
  flex-shrink: 0;
}

.card-info h4 {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.card-info p {
  margin: 0;
  font-size: 14px;
  color: #6b7280;
}

/* 统计概览 */
.stats-overview {
  margin-bottom: 32px;
}

.stats-overview h3 {
  margin: 0 0 16px 0;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.stat-item {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.stat-number {
  font-size: 32px;
  font-weight: 700;
  color: #3b82f6;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #6b7280;
}

/* 最近活动 */
.recent-activity {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 24px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.recent-activity h3 {
  margin: 0 0 16px 0;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background-color: #f9fafb;
  border-radius: 8px;
  color: #6b7280;
}

.activity-text {
  flex: 1;
  font-size: 14px;
  color: #374151;
}

.activity-time {
  font-size: 12px;
  color: #9ca3af;
}

/* 响应式 */
@media (max-width: 1200px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .access-grid {
    grid-template-columns: 1fr;
  }
}
</style>
