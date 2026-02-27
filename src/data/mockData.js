/**
 * @fileoverview 全局模拟数据
 * @description 提供应用中使用的模拟数据，包括游戏配置、文件类型等
 * @module data/mockData
 */

/**
 * 游戏文件类型枚举
 * @readonly
 * @enum {string}
 */
export const FileType = {
  DRAFT: 'draft',       // 草稿，可以有多个
  TEST_MATCH: 'testMatch',   // 测试比赛配置，只有一个
  TEST_GOLD: 'testGold',      // 测试金币配置，只有一个
  OFFICIAL_MATCH: 'officialMatch', // 正式约局配置，只有一个
  OFFICIAL_GOLD: 'officialGold'    // 正式金币配置，只有一个
};

/**
 * 环境类型枚举
 * @readonly
 * @enum {string}
 */
export const Environment = {
  TEST: 'test',        // 测试环境
  ONLINE: 'online'     // 线上环境
};

/**
 * 全局模拟游戏数据
 * @type {Object}
 */
export const mockGames = {
  '1': {
    id: 1,
    uniqueId: 'fsiodlfhjlsdfnsldkf==',
    name: '麻城痞子杠',
    description: '麻城地区特色麻将玩法',
    region: '湖北省/黄冈市/麻城市',
    collaborators: ['王一博', '江安明', '杨孙怡'],
    createdAt: '2026-02-01T10:30:00',
    createdBy: 'admin',
    updatedAt: '2026-02-01T14:20:00',
    updatedBy: 'admin',
    submitHistory: [
      {
        id: 'submit-1',
        draftId: 'draft-1',
        targetType: 'testMatch',
        createdAt: '2026-02-01T12:00:00',
        createdBy: 'admin'
      },
      {
        id: 'submit-2',
        draftId: 'draft-1',
        targetType: 'testGold',
        createdAt: '2026-02-01T14:20:00',
        createdBy: 'admin'
      }
    ],
    files: [
      {
        id: 'draft-1',
        type: FileType.DRAFT,
        name: '默认草稿',
        content: '{}',
        createdAt: '2026-02-01T10:30:00',
        updatedAt: '2026-02-01T10:30:00',
        updatedBy: 'admin'
      },
      {
        id: 'draft-2',
        type: FileType.DRAFT,
        name: '优化版',
        content: '{}',
        createdAt: '2026-02-02T09:00:00',
        updatedAt: '2026-02-02T14:30:00',
        updatedBy: '王一博'
      },
      {
        id: 'draft-4',
        type: FileType.DRAFT,
        name: '测试环境草稿',
        content: '{}',
        createdAt: '2026-02-03T10:00:00',
        updatedAt: '2026-02-03T10:00:00',
        updatedBy: '江安明'
      },
      {
        id: 'testMatch-1',
        type: FileType.TEST_MATCH,
        name: '测试约局配置',
        content: '{}',
        createdAt: '2026-02-01T12:00:00',
        updatedAt: '2026-02-01T12:00:00',
        updatedBy: 'admin'
      },
      {
        id: 'testGold-1',
        type: FileType.TEST_GOLD,
        name: '测试金币配置',
        content: '{}',
        createdAt: '2026-02-01T14:20:00',
        updatedAt: '2026-02-01T14:20:00',
        updatedBy: 'admin'
      }
    ]
  },
  '2': {
    id: 2,
    name: '通用麻将',
    description: '标准通用麻将规则',
    createdAt: '2026-02-02T09:00:00',
    createdBy: 'admin',
    updatedAt: '2026-02-03T16:45:00',
    updatedBy: 'admin',
    submitHistory: [],
    files: [
      {
        id: 'draft-3',
        type: FileType.DRAFT,
        name: '默认草稿',
        content: '{}',
        createdAt: '2026-02-02T09:00:00',
        updatedAt: '2026-02-02T09:00:00',
        updatedBy: 'admin'
      },
      {
        id: 'draft-5',
        type: FileType.DRAFT,
        name: '测试环境草稿',
        content: '{}',
        createdAt: '2026-02-04T11:00:00',
        updatedAt: '2026-02-04T11:00:00',
        updatedBy: '杨孙怡'
      }
    ]
  },
  '3': {
    id: 3,
    name: '香港麻将',
    description: '香港地区特色麻将玩法',
    createdAt: '2026-02-03T08:00:00',
    createdBy: 'admin',
    updatedAt: '2026-02-03T08:00:00',
    updatedBy: 'admin',
    submitHistory: [],
    files: [
      {
        id: 'draft-6',
        type: FileType.DRAFT,
        name: '默认草稿',
        content: '{}',
        createdAt: '2026-02-03T08:00:00',
        updatedAt: '2026-02-03T08:00:00',
        updatedBy: 'admin'
      },
      {
        id: 'draft-7',
        type: FileType.DRAFT,
        name: '测试环境草稿',
        content: '{}',
        createdAt: '2026-02-04T10:00:00',
        updatedAt: '2026-02-04T10:00:00',
        updatedBy: '王一博'
      }
    ]
  },
  '4': {
    id: 4,
    name: '深圳麻将',
    description: '深圳地区特色麻将玩法',
    createdAt: '2026-02-04T09:30:00',
    createdBy: 'admin',
    updatedAt: '2026-02-04T09:30:00',
    updatedBy: 'admin',
    submitHistory: [],
    files: [
      {
        id: 'draft-8',
        type: FileType.DRAFT,
        name: '默认草稿',
        content: '{}',
        createdAt: '2026-02-04T09:30:00',
        updatedAt: '2026-02-04T09:30:00',
        updatedBy: 'admin'
      },
      {
        id: 'draft-9',
        type: FileType.DRAFT,
        name: '测试环境草稿',
        content: '{}',
        createdAt: '2026-02-05T09:00:00',
        updatedAt: '2026-02-05T09:00:00',
        updatedBy: '江安明'
      }
    ]
  },
  '5': {
    id: 5,
    name: '四川麻将',
    description: '四川地区特色麻将玩法',
    createdAt: '2026-02-05T10:00:00',
    createdBy: 'admin',
    updatedAt: '2026-02-05T10:00:00',
    updatedBy: 'admin',
    submitHistory: [],
    files: [
      {
        id: 'draft-10',
        type: FileType.DRAFT,
        name: '默认草稿',
        content: '{}',
        createdAt: '2026-02-05T10:00:00',
        updatedAt: '2026-02-05T10:00:00',
        updatedBy: 'admin'
      },
      {
        id: 'draft-11',
        type: FileType.DRAFT,
        name: '测试环境草稿',
        content: '{}',
        createdAt: '2026-02-06T10:00:00',
        updatedAt: '2026-02-06T10:00:00',
        updatedBy: '杨孙怡'
      }
    ]
  }
};

/**
 * 获取所有游戏列表
 * @returns {Array} 游戏列表数组
 */
export function getAllGames() {
  return Object.values(mockGames);
}

/**
 * 根据ID获取游戏数据
 * @param {string|number} gameId - 游戏ID
 * @returns {Object|null} 游戏数据对象
 */
export function getGameById(gameId) {
  return mockGames[gameId.toString()] || null;
}

/**
 * 获取其他游戏列表（排除指定游戏）
 * @param {number} excludeGameId - 排除的游戏ID
 * @returns {Array} 其他游戏列表
 */
export function getOtherGames(excludeGameId) {
  return Object.values(mockGames).filter(game => game.id !== excludeGameId);
}

/**
 * 添加新游戏
 * @param {Object} gameData - 游戏数据
 * @returns {Object} 新创建的游戏对象
 */
export function addNewGame(gameData) {
  const newId = Object.keys(mockGames).length + 1;
  const newGame = {
    id: newId,
    uniqueId: `unique-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    region: '未设置',
    collaborators: [],
    ...gameData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  mockGames[newId.toString()] = newGame;
  return newGame;
}

/**
 * 更新游戏数据
 * @param {string|number} gameId - 游戏ID
 * @param {Object} updateData - 更新的数据
 * @returns {Object|null} 更新后的游戏对象
 */
export function updateGame(gameId, updateData) {
  const game = mockGames[gameId.toString()];
  if (!game) return null;
  
  const updatedGame = {
    ...game,
    ...updateData,
    updatedAt: new Date().toISOString()
  };
  
  mockGames[gameId.toString()] = updatedGame;
  return updatedGame;
}
