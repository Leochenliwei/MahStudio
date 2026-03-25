import * as storageService from '../storage/localStorageService';

export const FileType = {
  DRAFT: 'draft',
  TEST_MATCH: 'testMatch',
  TEST_GOLD: 'testGold',
  OFFICIAL_MATCH: 'officialMatch',
  OFFICIAL_GOLD: 'officialGold'
};

storageService.initializeData();

// ==================== 变量配置管理 API ====================

/**
 * 获取变量配置列表
 * @param {Object} params - 查询参数
 * @param {number} params.cfg_id - 游戏配置ID
 * @param {number} params.page - 页码
 * @param {number} params.page_size - 每页数量
 * @returns {Promise<Object>} 变量配置列表响应
 */
export async function getVariableConfigList(params) {
  const { cfg_id, page = 1, page_size = 999 } = params;
  const variables = storageService.getVariableConfigs(cfg_id);
  
  // 模拟分页
  const startIndex = (page - 1) * page_size;
  const endIndex = startIndex + page_size;
  const paginatedVariables = variables.slice(startIndex, endIndex);
  
  return {
    errno: 0,
    data: {
      list: paginatedVariables,
      total: variables.length,
      page,
      page_size
    }
  };
}

/**
 * 添加变量配置
 * @param {Object} variableData - 变量数据
 * @returns {Promise<Object>} 添加结果
 */
export async function addVariableConfig(variableData) {
  const { cfg_id, ...data } = variableData;
  const newVariable = storageService.addVariableConfig(cfg_id, data);
  
  if (newVariable) {
    return {
      errno: 0,
      data: newVariable
    };
  }
  
  return {
    errno: 1,
    errmsg: '添加变量失败'
  };
}

/**
 * 更新变量配置
 * @param {Object} variableData - 变量数据（包含 id 和 cfg_id）
 * @returns {Promise<Object>} 更新结果
 */
export async function updateVariableConfig(variableData) {
  if (!variableData || !variableData.id) {
    return {
      errno: 1,
      errmsg: '变量ID不能为空'
    };
  }
  
  const { id, cfg_id, ...updateData } = variableData;
  const updatedVariable = storageService.updateVariableConfig(cfg_id, id, updateData);
  
  if (updatedVariable) {
    return {
      errno: 0,
      data: updatedVariable
    };
  }
  
  return {
    errno: 1,
    errmsg: '更新变量失败'
  };
}

/**
 * 删除变量配置
 * @param {Object} params - 删除参数
 * @param {string} params.id - 变量ID
 * @param {number} params.cfg_id - 游戏配置ID
 * @returns {Promise<Object>} 删除结果
 */
export async function deleteVariableConfig(params) {
  const { id, cfg_id } = params;
  const success = storageService.deleteVariableConfig(cfg_id, id);
  
  if (success) {
    return {
      errno: 0,
      data: { id }
    };
  }
  
  return {
    errno: 1,
    errmsg: '删除变量失败'
  };
}

export async function getAllGames() {
  return storageService.getAllGames();
}

export async function getGameById(gameId) {
  return storageService.getGame(gameId);
}

export async function createGame(gameData) {
  const newGame = storageService.addGame(gameData);
  if (!newGame) {
    throw new Error('创建游戏失败');
  }
  return newGame;
}

export async function updateGame(gameId, gameData) {
  const updatedGame = storageService.updateGame(gameId, gameData);
  if (!updatedGame) {
    throw new Error('游戏不存在或更新失败');
  }
  return updatedGame;
}

export async function deleteGame(gameId) {
  const success = storageService.deleteGame(gameId);
  if (!success) {
    throw new Error('删除游戏失败');
  }
  return { success: true, message: 'Game deleted successfully' };
}

export async function getGameFiles(gameId) {
  return storageService.getGameFiles(gameId);
}

export async function createGameFile(gameId, fileData) {
  const newFile = storageService.addGameFile(gameId, fileData);
  if (!newFile) {
    throw new Error('创建文件失败');
  }
  return newFile;
}

export async function updateGameFile(gameId, fileId, fileData) {
  const updatedFile = storageService.updateGameFile(gameId, fileId, fileData);
  if (!updatedFile) {
    throw new Error('文件不存在或更新失败');
  }
  return updatedFile;
}

export async function deleteGameFile(gameId, fileId) {
  const success = storageService.deleteGameFile(gameId, fileId);
  if (!success) {
    throw new Error('删除文件失败');
  }
  return { success: true, message: 'File deleted successfully' };
}

export async function getSubmitHistory(gameId) {
  return storageService.getSubmitHistory(gameId);
}

export async function createSubmitHistory(gameId, historyData) {
  const newHistory = storageService.addSubmitHistory(gameId, historyData);
  if (!newHistory) {
    throw new Error('创建提交历史失败');
  }
  return newHistory;
}

export async function getOtherGames(currentGameId) {
  const games = await getAllGames();
  return games.filter(game => game.id != currentGameId);
}

export const addNewGame = createGame;
