/**
 * @fileoverview 类型定义统一导出
 * @description 集中导出所有类型定义模块，方便其他模块引用
 * @module types
 */

// 从 gameDirectory.js 导出
export {
  FileType,
  Environment,
  FileTypeRules,
  isMultipleAllowed,
  getFileTypeLabel,
  createGameFile,
  createGameDirectory
} from './gameDirectory.js';

// 从 game.js 导出
export {
  GameStatus,
  createGame,
  getGameStatusLabel,
  getEnvironmentLabel,
  isGameEditable,
  isGamePublishable
} from './game.js';

// 默认导出所有类型
export { default as gameDirectoryTypes } from './gameDirectory.js';
export { default as gameTypes } from './game.js';
