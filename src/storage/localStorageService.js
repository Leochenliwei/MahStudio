import { mockGames } from '../data/mockData';

const STORAGE_KEY = 'gameConfigData';

function loadData() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      return null;
    }
    return JSON.parse(data);
  } catch (error) {
    console.error('读取 localStorage 数据失败:', error);
    return null;
  }
}

function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('写入 localStorage 数据失败:', error);
    return false;
  }
}

export function initializeData() {
  let data = loadData();
  
  if (!data) {
    data = { ...mockGames };
    saveData(data);
  }
  
  return data;
}

export function updateData(newData) {
  return saveData(newData);
}

export function clearData() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('删除 localStorage 数据失败:', error);
    return false;
  }
}

export function getGame(gameId) {
  const data = loadData();
  if (!data) return null;
  return data[gameId.toString()] || null;
}

export function updateGame(gameId, updateData) {
  const data = loadData();
  if (!data) return null;
  
  const game = data[gameId.toString()];
  if (!game) return null;
  
  const updatedGame = {
    ...game,
    ...updateData,
    updatedAt: new Date().toISOString()
  };
  
  data[gameId.toString()] = updatedGame;
  
  if (saveData(data)) {
    return updatedGame;
  }
  
  return null;
}

export function addGame(gameData) {
  const data = loadData() || {};
  
  const newId = Object.keys(data).length + 1;
  const newGame = {
    id: newId,
    uniqueId: `unique-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    region: '未设置',
    collaborators: [],
    submitHistory: [],
    files: [],
    ...gameData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  data[newId.toString()] = newGame;
  
  if (saveData(data)) {
    return newGame;
  }
  
  return null;
}

export function deleteGame(gameId) {
  const data = loadData();
  if (!data) return false;
  
  delete data[gameId.toString()];
  
  return saveData(data);
}

export function getAllGames() {
  const data = loadData();
  if (!data) return [];
  return Object.values(data);
}

export function getGameFiles(gameId) {
  const game = getGame(gameId);
  if (!game) return [];
  return game.files || [];
}

export function addGameFile(gameId, fileData) {
  const data = loadData();
  if (!data) return null;
  
  const game = data[gameId.toString()];
  if (!game) return null;
  
  if (!game.files) {
    game.files = [];
  }
  
  const newFile = {
    id: `${fileData.type}-${Date.now()}`,
    ...fileData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  game.files.push(newFile);
  game.updatedAt = new Date().toISOString();
  
  if (saveData(data)) {
    return newFile;
  }
  
  return null;
}

export function updateGameFile(gameId, fileId, updateData) {
  const data = loadData();
  if (!data) return null;
  
  const game = data[gameId.toString()];
  if (!game || !game.files) return null;
  
  const fileIndex = game.files.findIndex(f => f.id === fileId);
  if (fileIndex === -1) return null;
  
  const updatedFile = {
    ...game.files[fileIndex],
    ...updateData,
    updatedAt: new Date().toISOString()
  };
  
  game.files[fileIndex] = updatedFile;
  game.updatedAt = new Date().toISOString();
  
  if (saveData(data)) {
    return updatedFile;
  }
  
  return null;
}

export function deleteGameFile(gameId, fileId) {
  const data = loadData();
  if (!data) return false;
  
  const game = data[gameId.toString()];
  if (!game || !game.files) return false;
  
  const fileIndex = game.files.findIndex(f => f.id === fileId);
  if (fileIndex === -1) return false;
  
  game.files.splice(fileIndex, 1);
  game.updatedAt = new Date().toISOString();
  
  return saveData(data);
}

export function getSubmitHistory(gameId) {
  const game = getGame(gameId);
  if (!game) return [];
  return game.submitHistory || [];
}

export function addSubmitHistory(gameId, historyData) {
  const data = loadData();
  if (!data) return null;
  
  const game = data[gameId.toString()];
  if (!game) return null;
  
  if (!game.submitHistory) {
    game.submitHistory = [];
  }
  
  const newHistory = {
    id: `submit-${Date.now()}`,
    ...historyData,
    createdAt: new Date().toISOString()
  };
  
  game.submitHistory.unshift(newHistory);
  game.updatedAt = new Date().toISOString();
  
  if (saveData(data)) {
    return newHistory;
  }
  
  return null;
}

// ==================== 变量配置管理 ====================

/**
 * 获取变量配置列表
 * @param {number} cfgId - 游戏配置ID
 * @returns {Array} 变量配置列表
 */
export function getVariableConfigs(cfgId) {
  const data = loadData();
  if (!data) return [];
  
  const game = data[cfgId.toString()];
  if (!game) return [];
  
  return game.variableConfigs || [];
}

/**
 * 添加变量配置
 * @param {number} cfgId - 游戏配置ID
 * @param {Object} variableData - 变量数据
 * @returns {Object|null} 新创建的变量配置
 */
export function addVariableConfig(cfgId, variableData) {
  const data = loadData();
  if (!data) return null;
  
  const game = data[cfgId.toString()];
  if (!game) return null;
  
  if (!game.variableConfigs) {
    game.variableConfigs = [];
  }
  
  const newVariable = {
    id: `var-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    ...variableData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  game.variableConfigs.push(newVariable);
  game.updatedAt = new Date().toISOString();
  
  if (saveData(data)) {
    return newVariable;
  }
  
  return null;
}

/**
 * 更新变量配置
 * @param {number} cfgId - 游戏配置ID
 * @param {string} variableId - 变量ID
 * @param {Object} updateData - 更新数据
 * @returns {Object|null} 更新后的变量配置
 */
export function updateVariableConfig(cfgId, variableId, updateData) {
  const data = loadData();
  if (!data) return null;
  
  const game = data[cfgId.toString()];
  if (!game || !game.variableConfigs) return null;
  
  const variableIndex = game.variableConfigs.findIndex(v => v.id === variableId);
  if (variableIndex === -1) return null;
  
  const updatedVariable = {
    ...game.variableConfigs[variableIndex],
    ...updateData,
    updatedAt: new Date().toISOString()
  };
  
  game.variableConfigs[variableIndex] = updatedVariable;
  game.updatedAt = new Date().toISOString();
  
  if (saveData(data)) {
    return updatedVariable;
  }
  
  return null;
}

/**
 * 删除变量配置
 * @param {number} cfgId - 游戏配置ID
 * @param {string} variableId - 变量ID
 * @returns {boolean} 是否删除成功
 */
export function deleteVariableConfig(cfgId, variableId) {
  const data = loadData();
  if (!data) return false;
  
  const game = data[cfgId.toString()];
  if (!game || !game.variableConfigs) return false;
  
  const variableIndex = game.variableConfigs.findIndex(v => v.id === variableId);
  if (variableIndex === -1) return false;
  
  game.variableConfigs.splice(variableIndex, 1);
  game.updatedAt = new Date().toISOString();
  
  return saveData(data);
}
