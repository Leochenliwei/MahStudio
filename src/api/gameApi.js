const API_BASE_URL = 'http://localhost:3001/api';

export const FileType = {
  DRAFT: 'draft',
  TEST_MATCH: 'testMatch',
  TEST_GOLD: 'testGold',
  OFFICIAL_MATCH: 'officialMatch',
  OFFICIAL_GOLD: 'officialGold'
};

async function request(url, options = {}) {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'Request failed');
  }

  return response.json();
}

export async function getAllGames() {
  return request(`${API_BASE_URL}/games`);
}

export async function getGameById(gameId) {
  return request(`${API_BASE_URL}/games/${gameId}`);
}

export async function createGame(gameData) {
  return request(`${API_BASE_URL}/games`, {
    method: 'POST',
    body: JSON.stringify(gameData),
  });
}

export async function updateGame(gameId, gameData) {
  return request(`${API_BASE_URL}/games/${gameId}`, {
    method: 'PUT',
    body: JSON.stringify(gameData),
  });
}

export async function deleteGame(gameId) {
  return request(`${API_BASE_URL}/games/${gameId}`, {
    method: 'DELETE',
  });
}

export async function getGameFiles(gameId) {
  return request(`${API_BASE_URL}/games/${gameId}/files`);
}

export async function createGameFile(gameId, fileData) {
  return request(`${API_BASE_URL}/games/${gameId}/files`, {
    method: 'POST',
    body: JSON.stringify(fileData),
  });
}

export async function updateGameFile(gameId, fileId, fileData) {
  return request(`${API_BASE_URL}/games/${gameId}/files/${fileId}`, {
    method: 'PUT',
    body: JSON.stringify(fileData),
  });
}

export async function deleteGameFile(gameId, fileId) {
  return request(`${API_BASE_URL}/games/${gameId}/files/${fileId}`, {
    method: 'DELETE',
  });
}

export async function getSubmitHistory(gameId) {
  return request(`${API_BASE_URL}/games/${gameId}/submit-history`);
}

export async function createSubmitHistory(gameId, historyData) {
  return request(`${API_BASE_URL}/games/${gameId}/submit-history`, {
    method: 'POST',
    body: JSON.stringify(historyData),
  });
}

export async function getOtherGames(currentGameId) {
  const games = await getAllGames();
  return games.filter(game => game.id != currentGameId);
}

export const addNewGame = createGame;
