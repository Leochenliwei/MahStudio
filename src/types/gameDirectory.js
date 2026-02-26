/**
 * @fileoverview 游戏目录管理类型定义
 * @description 定义游戏目录、文件类型、环境等相关数据类型
 * @module types/gameDirectory
 */

/**
 * 文件类型枚举
 * @readonly
 * @enum {string}
 * @description 定义游戏文件的类型，用于区分不同用途的配置文件
 */
export const FileType = {
  /** 草稿文件 - 可以有多个，用于开发阶段的临时保存 */
  DRAFT: 'draft',
  /** 测试对局配置 - 只能有一个，用于测试环境对局 */
  TEST_MATCH: 'testMatch',
  /** 测试金币配置 - 只能有一个，用于测试环境金币场 */
  TEST_GOLD: 'testGold'
};

/**
 * 环境类型枚举
 * @readonly
 * @enum {string}
 * @description 定义游戏运行的环境类型
 */
export const Environment = {
  /** 测试环境 */
  TEST: 'test',
  /** 线上环境 */
  ONLINE: 'online'
};

/**
 * 游戏文件接口
 * @typedef {Object} GameFile
 * @property {string} id - 文件唯一标识符
 * @property {string} name - 文件名称
 * @property {FileType} type - 文件类型（draft/testMatch/testGold）
 * @property {Object} content - 文件内容（JSON配置对象）
 * @property {string} createdAt - 创建时间（ISO 8601格式）
 * @property {string} updatedAt - 更新时间（ISO 8601格式）
 * @property {string} gameId - 所属游戏ID
 * @description 表示游戏目录中的单个配置文件
 */

/**
 * 游戏目录接口
 * @typedef {Object} GameDirectory
 * @property {string} id - 目录唯一标识符
 * @property {string} name - 目录名称（通常与游戏名称一致）
 * @property {string} [description] - 目录描述（可选）
 * @property {GameFile[]} files - 目录下的文件列表
 * @property {string} createdAt - 创建时间（ISO 8601格式）
 * @property {string} updatedAt - 更新时间（ISO 8601格式）
 * @description 表示一个游戏的配置目录，包含多个配置文件
 */

/**
 * 文件类型验证规则
 * @readonly
 * @type {Object.<FileType, {maxCount: number, label: string}>}
 * @description 定义每种文件类型的验证规则和显示标签
 */
export const FileTypeRules = {
  [FileType.DRAFT]: {
    maxCount: Infinity,
    label: '草稿'
  },
  [FileType.TEST_MATCH]: {
    maxCount: 1,
    label: '测试对局'
  },
  [FileType.TEST_GOLD]: {
    maxCount: 1,
    label: '测试金币'
  }
};

/**
 * 检查文件类型是否允许创建多个
 * @param {FileType} fileType - 文件类型
 * @returns {boolean} 是否允许多个
 * @description 根据文件类型判断是否可以创建多个文件
 */
export function isMultipleAllowed(fileType) {
  return FileTypeRules[fileType]?.maxCount === Infinity;
}

/**
 * 获取文件类型的显示标签
 * @param {FileType} fileType - 文件类型
 * @returns {string} 显示标签
 * @description 获取文件类型的中文显示名称
 */
export function getFileTypeLabel(fileType) {
  return FileTypeRules[fileType]?.label || fileType;
}

/**
 * 创建新的游戏文件对象
 * @param {Object} params - 创建参数
 * @param {string} params.name - 文件名称
 * @param {FileType} params.type - 文件类型
 * @param {Object} [params.content={}] - 文件内容
 * @param {string} params.gameId - 所属游戏ID
 * @returns {GameFile} 新的游戏文件对象
 * @description 工厂函数，用于创建新的游戏文件实例
 */
export function createGameFile({ name, type, content = {}, gameId }) {
  const now = new Date().toISOString();
  return {
    id: generateId(),
    name,
    type,
    content,
    createdAt: now,
    updatedAt: now,
    gameId
  };
}

/**
 * 创建新的游戏目录对象
 * @param {Object} params - 创建参数
 * @param {string} params.name - 目录名称
 * @param {string} [params.description=''] - 目录描述
 * @returns {GameDirectory} 新的游戏目录对象
 * @description 工厂函数，用于创建新的游戏目录实例
 */
export function createGameDirectory({ name, description = '' }) {
  const now = new Date().toISOString();
  return {
    id: generateId(),
    name,
    description,
    files: [],
    createdAt: now,
    updatedAt: now
  };
}

/**
 * 生成唯一ID
 * @returns {string} 唯一标识符
 * @private
 * @description 内部工具函数，生成基于时间戳和随机数的唯一ID
 */
function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// 默认导出所有类型定义
export default {
  FileType,
  Environment,
  FileTypeRules,
  isMultipleAllowed,
  getFileTypeLabel,
  createGameFile,
  createGameDirectory
};
