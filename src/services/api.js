const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const token = localStorage.getItem('phome_token');

  const config = {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  if (options.body) {
    config.body = JSON.stringify(options.body);
  }

  const response = await fetch(url, config);
  const data = await response.json();

  if (!response.ok) {
    const errorMsg = data.message || data.error || 'Request failed';
    throw new Error(errorMsg);
  }

  return data;
}

export const api = {
  auth: {
    login: (username, password) =>
      request('/auth/login', { method: 'POST', body: { username, password } }),
    register: (username, password) =>
      request('/auth/register', { method: 'POST', body: { username, password } }),
    verify: () => request('/auth/verify'),
  },
  photos: {
    list: () => request('/photos'),
    get: (id) => request(`/photos/${id}`),
    create: (photoData) =>
      request('/photos', { method: 'POST', body: photoData }),
    update: (id, updates) =>
      request(`/photos/${id}`, { method: 'PUT', body: updates }),
    delete: (id) =>
      request(`/photos/${id}`, { method: 'DELETE' }),
    batchDelete: (ids) =>
      request('/photos/batch-delete', { method: 'POST', body: { ids } }),
  },
  categories: {
    list: () => request('/categories'),
    create: (name) =>
      request('/categories', { method: 'POST', body: { name } }),
    update: (oldName, newName) =>
      request('/categories', { method: 'PUT', body: { oldName, newName } }),
    delete: (name) =>
      request(`/categories/${encodeURIComponent(name)}`, { method: 'DELETE' }),
  },
};

export function setAuthToken(token) {
  if (token) {
    localStorage.setItem('phome_token', token);
  } else {
    localStorage.removeItem('phome_token');
  }
}

export function getAuthToken() {
  return localStorage.getItem('phome_token');
}