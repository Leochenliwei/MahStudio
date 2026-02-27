<template>
  <!--
    文件卡片组件
    用于展示游戏配置文件的信息和操作按钮
    关联需求：文件管理模块 - 文件卡片展示
  -->
  <div class="file-card" :class="[`type-${file.type}`, `env-${environment}`]">
    <!-- 卡片主体：文件名 -->
    <div class="card-body">
      <h4 class="file-name" :title="file.name">{{ file.name }}</h4>
      <p v-if="file.description" class="file-description">{{ file.description }}</p>
    </div>
    
    
    <!-- 卡片头部：更新时间和操作人 -->
    <div class="card-header">
      
      <span class="update-time">最新版本：{{ formatTime(file.updatedAt) }}</span>
      <span class="updated-by">|</span>
      <span class="updated-by">操作人：{{ file.updatedBy || '未知' }}</span>
      <span class="updated-by">|</span>
      <span class="updated-by">草稿ID：{{ file.id || '未知' }}</span>
      <button class="action-btn small-icon history" @click="handleViewHistory" title="查看提测记录">
          <Icon name="clock" size="14" />
          更多记录
      </button>
    </div>

    

    <!-- 卡片底部：操作按钮 -->
    <div class="card-footer">


      <!-- 测试/灰度类型操作按钮 -->
      <template v-if="file.type === 'testMatch' || file.type === 'testGold'">
        <button class="action-btn copy" @click="handleView" title="查看配置">
          <Icon name="eye" size="14" />
          <span>查看</span>
        </button>
        <button class="action-btn copy" @click="handleCopy" title="复制">
          <Icon name="copy" size="14" />
          <span>复制</span>
        </button>
        <button class="action-btn copy" @click="handleCopyTo" title="复制">
          <Icon name="copy" size="14" />
          <span>复制到..</span>
        </button>
        <button class="action-btn gray" @click="handleGrayRelease" :title="environment === 'online' ? '发布' : '发灰度'">
          <Icon name="rocket" size="14" />
          <span>{{ environment === 'online' ? '发布' : '发灰度' }}</span>
        </button>
      </template>
      
      <!-- 正式类型操作按钮（无发布按钮） -->
      <template v-if="file.type === 'officialMatch' || file.type === 'officialGold'">
        <button class="action-btn copy" @click="handleView" title="查看配置">
          <Icon name="eye" size="14" />
          <span>查看</span>
        </button>
        <button class="action-btn copy" @click="handleCopy" title="复制">
          <Icon name="copy" size="14" />
          <span>复制</span>
        </button>
        <button class="action-btn copy" @click="handleCopyTo" title="复制">
          <Icon name="copy" size="14" />
          <span>复制到..</span>
        </button>
      </template>
    </div>
  </div>
</template>

<script setup>
/**
 * FileCard.vue - 文件卡片组件
 * 
 * 功能说明：
 * 用于展示游戏配置文件的基本信息和操作按钮
 * 根据文件类型（测试约局/测试金币）显示不同的样式和操作按钮
 * 
 * Props:
 * @property {Object} file - 文件对象
 *   @property {string} file.id - 文件唯一标识
 *   @property {string} file.name - 文件名称
 *   @property {string} file.type - 文件类型 (testMatch/testGold)
 *   @property {string|number} file.updatedAt - 更新时间戳
 *   @property {string} [file.description] - 文件描述（可选）
 * @property {string} environment - 环境标识 (test/online)
 * 
 * Events:
 * @event copy - 复制文件，携带文件对象
 * @event gray-release - 发布灰度，携带文件对象
 * @event view-history - 查看提测记录，携带文件对象
 */

import Icon from './Icon.vue'

// 定义Props
const props = defineProps({
  /**
   * 文件对象
   * @type {Object}
   */
  file: {
    type: Object,
    required: true,
    validator(value) {
      return value.id && value.name && value.type
    }
  },
  /**
   * 环境标识
   * @type {string}
   */
  environment: {
    type: String,
    default: 'test',
    validator(value) {
      return ['test', 'online'].includes(value)
    }
  }
})

// 定义事件
const emit = defineEmits(['view','copy','copy-to', 'publish', 'view-history'])

/**
 * 获取类型标签文本
 * @param {string} type - 文件类型
 * @returns {string} 类型标签文本
 */
function getTypeLabel(type) {
  const typeMap = {
    testMatch: '测试约局',
    testGold: '测试金币'
  }
  return typeMap[type] || type
}

/**
 * 格式化时间
 * @param {string|number} timestamp - 时间戳
 * @returns {string} 格式化后的时间字符串
 */
function formatTime(timestamp) {
  if (!timestamp) return '-'
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now - date

  // 小于1小时显示"X分钟前"
  if (diff < 60 * 60 * 1000) {
    const minutes = Math.floor(diff / (60 * 1000))
    return minutes < 1 ? '刚刚' : `${minutes}分钟前`
  }

  // 小于24小时显示"X小时前"
  if (diff < 24 * 60 * 60 * 1000) {
    const hours = Math.floor(diff / (60 * 60 * 1000))
    return `${hours}小时前`
  }

  // 小于7天显示"X天前"
  if (diff < 7 * 24 * 60 * 60 * 1000) {
    const days = Math.floor(diff / (24 * 60 * 60 * 1000))
    return `${days}天前`
  }

  // 否则显示具体日期
  return date.toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric'
  })
}

/**
 * 处理查看按钮点击
 * 关联需求：文件管理 - 查看文件配置
 */
function handleView() {
  emit('view', props.file)
}

/**
 * 处理复制按钮点击
 * 关联需求：文件管理 - 复制文件
 */
function handleCopy() {
  emit('copy', props.file)
}

/**
 * 处理复制到按钮点击
 * 关联需求：文件管理 - 复制文件到指定目录
 */
function handleCopyTo() {
  emit('copy-to', props.file)
}

/**
 * 处理发布按钮点击
 * 关联需求：文件管理 - 发布灰度/发布到正式
 */
function handleGrayRelease() {
  emit('publish', props.file)
}

/**
 * 处理查看提测记录按钮点击
 * 关联需求：文件管理 - 查看提测记录
 */
function handleViewHistory() {
  emit('view-history', props.file)
}
</script>

<style scoped>
/* 文件卡片基础样式 */
.file-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-4);
  transition: all var(--transition-normal);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
  box-shadow: var(--shadow-sm);
}

.file-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
  border-color: var(--color-border-dark);
}

/* 卡片头部样式 */
.card-header {
  display: flex;
  align-items: center;
  /* justify-content: space-between; */
  gap: var(--spacing-2);
}

/* 类型标签样式已移除，因为区域标题已显示类型信息 */

/* 更新时间样式 */
.update-time {
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
  white-space: nowrap;
}

/* 操作人样式 */
.updated-by {
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
  white-space: nowrap;
}

/* 卡片主体样式 */
.card-body {
  flex: 1;
  min-height: 0;
}

.file-name {
  margin: 0;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  line-height: var(--line-height-tight);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-description {
  margin: var(--spacing-2) 0 0;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  line-height: var(--line-height-normal);
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

/* 文件ID样式 */
.file-id {
  margin: var(--spacing-1) 0 0;
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
  line-height: var(--line-height-normal);
  font-family: var(--font-family-mono);
  background: var(--color-surface-hover);
  padding: var(--spacing-1) var(--spacing-2);
  border-radius: var(--border-radius-sm);
  display: inline-block;
}

/* 卡片底部样式 */
.card-footer {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-2);
  padding-top: var(--spacing-3);
  border-top: 1px solid var(--color-border);
}

/* 操作按钮样式 */
.action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-1);
  padding: var(--spacing-2) var(--spacing-3);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--transition-fast);
  border: 1px solid transparent;
  background: transparent;
  color: var(--color-text-secondary);
  flex: 1;
  min-width: 0;
}

.action-btn:hover {
  transform: translateY(-1px);
}

/* 复制按钮 */
.action-btn.copy {
  background: var(--color-surface-hover);
  color: var(--color-text-secondary);
  border-color: var(--color-border);
}

.action-btn.copy:hover {
  background: #8b5cf6;
  color: white;
  border-color: #8b5cf6;
}

/* 发灰度按钮 */
.action-btn.gray {
  background: rgba(245, 158, 11, 0.1);
  color: var(--color-warning);
  border-color: rgba(245, 158, 11, 0.2);
}

.action-btn.gray:hover {
  background: var(--color-warning);
  color: white;
  border-color: var(--color-warning);
}

/* 提测记录按钮 */
.action-btn.history {
  background: rgba(139, 92, 246, 0.1);
  color: #8b5cf6;
  border-color: rgba(139, 92, 246, 0.2);
  margin-left: 16px;
}

.action-btn.history:hover {
  background: #8b5cf6;
  color: white;
  border-color: #8b5cf6;
}

/* 小图标按钮 */
.action-btn.small-icon {
  padding: var(--spacing-2);
  min-width: auto;
  flex: none;
  /* width: 32px; */
  height: 32px;
}

/* 环境标识样式 - 测试环境 */
.file-card.env-test {
  border-left: 3px solid var(--color-primary);
}

/* 环境标识样式 - 线上环境 */
.file-card.env-online {
  border-left: 3px solid var(--color-success);
}

/* 响应式适配 */
@media (max-width: 768px) {
  .file-card {
    padding: var(--spacing-3);
  }

  .card-footer {
    flex-wrap: wrap;
  }

  .action-btn {
    flex: 1 1 calc(50% - var(--spacing-2));
    min-width: 60px;
  }

  .action-btn span {
    display: none;
  }
}

@media (max-width: 480px) {
  .action-btn {
    padding: var(--spacing-2);
  }

  .file-name {
    font-size: var(--font-size-sm);
  }
}
</style>
