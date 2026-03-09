import * as storageService from '../storage/localStorageService';

export const FileType = {
  DRAFT: 'draft',
  TEST_MATCH: 'testMatch',
  TEST_GOLD: 'testGold',
  OFFICIAL_MATCH: 'officialMatch',
  OFFICIAL_GOLD: 'officialGold'
};

storageService.initializeData();

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
