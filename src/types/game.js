/**
 * @fileoverview 游戏类型定义扩展
 * @description 扩展游戏相关数据类型，添加文件管理和环境相关字段
 * @module types/game
 */

import { FileType, Environment } from './gameDirectory.js';

/**
 * 游戏状态枚举
 * @readonly
 * @enum {string}
 * @description 定义游戏的生命周期状态
 */
export const GameStatus = {
  /** 开发中 */
  DEVELOPMENT: 'development',
  /** 测试中 */
  TESTING: 'testing',
  /** 已上线 */
  PUBLISHED: 'published',
  /** 已下线 */
  DEPRECATED: 'deprecated'
};

/**
 * 游戏基础信息接口
 * @typedef {Object} GameBase
 * @property {string} id - 游戏唯一标识符
 * @property {string} name - 游戏名称
 * @property {string} [description] - 游戏描述
 * @property {string} [icon] - 游戏图标URL
 * @property {GameStatus} status - 游戏状态
 * @property {string} createdAt - 创建时间
 * @property {string} updatedAt - 更新时间
 */

/**
 * 游戏环境配置接口
 * @typedef {Object} GameEnvironmentConfig
 * @property {Environment} currentEnv - 当前环境
 * @property {string} [testVersion] - 测试环境版本号
 * @property {string} [onlineVersion] - 线上环境版本号
 * @property {boolean} autoSync - 是否自动同步配置
 * @property {string} [lastSyncAt] - 最后同步时间
 */

/**
 * 游戏文件管理配置接口
 * @typedef {Object} GameFileManagement
 * @property {string} activeDraftId - 当前激活的草稿文件ID
 * @property {string} [testMatchFileId] - 测试对局配置文件ID
 * @property {string} [testGoldFileId] - 测试金币配置文件ID
 * @property {string} [onlineMatchFileId] - 线上对局配置文件ID
 * @property {string} [onlineGoldFileId] - 线上金币配置文件ID
 * @property {number} maxDraftCount - 最大草稿数量限制
 */

/**
 * 完整游戏接口（扩展版）
 * @typedef {GameBase} Game
 * @property {GameFileManagement} fileManagement - 文件管理配置
 * @property {GameEnvironmentConfig} environment - 环境配置
 * @property {Object} [defaultConfig] - 默认配置模板
 * @property {string[]} [tags] - 游戏标签
 * @property {string} [category] - 游戏分类
 * @description 完整的游戏数据模型，包含文件管理和环境配置
 */

/**
 * 游戏列表项接口（简化版）
 * @typedef {Object} GameListItem
 * @property {string} id - 游戏ID
 * @property {string} name - 游戏名称
 * @property {string} [icon] - 游戏图标
 * @property {GameStatus} status - 游戏状态
 * @property {Environment} currentEnv - 当前环境
 * @property {number} draftCount - 草稿数量
 * @property {string} updatedAt - 更新时间
 * @description 用于游戏列表展示的简化数据模型
 */

/**
 * 游戏创建参数接口
 * @typedef {Object} CreateGameParams
 * @property {string} name - 游戏名称
 * @property {string} [description] - 游戏描述
 * @property {string} [icon] - 游戏图标
 * @property {string} [category] - 游戏分类
 * @property {Object} [defaultConfig] - 默认配置
 */

/**
 * 游戏更新参数接口
 * @typedef {Object} UpdateGameParams
 * @property {string} [name] - 游戏名称
 * @property {string} [description] - 游戏描述
 * @property {string} [icon] - 游戏图标
 * @property {GameStatus} [status] - 游戏状态
 * @property {string} [category] - 游戏分类
 * @property {Object} [defaultConfig] - 默认配置
 */

/**
 * 游戏查询过滤器接口
 * @typedef {Object} GameFilter
 * @property {string} [keyword] - 关键词搜索
 * @property {GameStatus} [status] - 状态筛选
 * @property {string} [category] - 分类筛选
 * @property {Environment} [environment] - 环境筛选
 * @property {string} [startDate] - 开始日期
 * @property {string} [endDate] - 结束日期
 */

/**
 * 游戏排序选项接口
 * @typedef {Object} GameSortOptions
 * @property {'name' | 'createdAt' | 'updatedAt' | 'status'} field - 排序字段
 * @property {'asc' | 'desc'} order - 排序方向
 */

/**
 * 游戏分页查询参数接口
 * @typedef {Object} GameQueryParams
 * @property {GameFilter} [filter] - 过滤器
 * @property {GameSortOptions} [sort] - 排序选项
 * @property {number} page - 页码（从1开始）
 * @property {number} pageSize - 每页数量
 */

/**
 * 游戏分页结果接口
 * @typedef {Object} GamePageResult
 * @property {GameListItem[]} list - 游戏列表
 * @property {number} total - 总数量
 * @property {number} page - 当前页码
 * @property {number} pageSize - 每页数量
 * @property {number} totalPages - 总页数
 */

/**
 * 创建新游戏对象
 * @param {CreateGameParams} params - 创建参数
 * @returns {Game} 新的游戏对象
 * @description 工厂函数，用于创建新的游戏实例
 */
export function createGame(params) {
  const now = new Date().toISOString();
  const id = generateId();

  return {
    id,
    name: params.name,
    description: params.description || '',
    icon: params.icon || '',
    status: GameStatus.DEVELOPMENT,
    category: params.category || '',
    defaultConfig: params.defaultConfig || {},
    fileManagement: {
      activeDraftId: '',
      maxDraftCount: 10
    },
    environment: {
      currentEnv: Environment.TEST,
      autoSync: false
    },
    createdAt: now,
    updatedAt: now
  };
}

/**
 * 获取游戏状态标签
 * @param {GameStatus} status - 游戏状态
 * @returns {string} 状态显示标签
 * @description 获取游戏状态的中文显示名称
 */
export function getGameStatusLabel(status) {
  const labels = {
    [GameStatus.DEVELOPMENT]: '开发中',
    [GameStatus.TESTING]: '测试中',
    [GameStatus.PUBLISHED]: '已上线',
    [GameStatus.DEPRECATED]: '已下线'
  };
  return labels[status] || status;
}

/**
 * 获取环境标签
 * @param {Environment} env - 环境类型
 * @returns {string} 环境显示标签
 * @description 获取环境类型的中文显示名称
 */
export function getEnvironmentLabel(env) {
  const labels = {
    [Environment.TEST]: '测试环境',
    [Environment.ONLINE]: '线上环境'
  };
  return labels[env] || env;
}

/**
 * 检查游戏是否可编辑
 * @param {Game} game - 游戏对象
 * @returns {boolean} 是否可编辑
 * @description 检查游戏当前状态是否允许编辑
 */
export function isGameEditable(game) {
  return game.status !== GameStatus.DEPRECATED;
}

/**
 * 检查游戏是否可发布
 * @param {Game} game - 游戏对象
 * @returns {boolean} 是否可发布
 * @description 检查游戏当前状态是否允许发布到线上
 */
export function isGamePublishable(game) {
  return game.status === GameStatus.TESTING || game.status === GameStatus.DEVELOPMENT;
}

/**
 * 生成唯一ID
 * @returns {string} 唯一标识符
 * @private
 * @description 内部工具函数，生成基于时间戳和随机数的唯一ID
 */
function generateId() {
  return `game-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// 默认导出所有类型定义
export default {
  GameStatus,
  FileType,
  Environment,
  createGame,
  getGameStatusLabel,
  getEnvironmentLabel,
  isGameEditable,
  isGamePublishable
};
