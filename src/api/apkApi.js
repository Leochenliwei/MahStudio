// 使用环境变量中的端口配置
const API_PORT = import.meta.env.VITE_API_PORT || '8001';
const API_BASE_URL = `http://localhost:${API_PORT}/api`;

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

export async function getAllApks() {
  return request(`${API_BASE_URL}/apks`);
}
