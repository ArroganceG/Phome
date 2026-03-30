import { api } from './api';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const USE_LOCAL = import.meta.env.VITE_USE_LOCAL === 'true';

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const token = localStorage.getItem('phome_token');

  const config = {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  };

  if (options.body) {
    config.body = JSON.stringify(options.body);
  }

  const response = await fetch(url, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Request failed');
  }

  return data;
}

export async function loadPhotos() {
  try {
    const photos = await api.photos.list();
    return photos;
  } catch (error) {
    console.error('Failed to load photos from API:', error);
    return [];
  }
}

export async function updatePhoto(photoId, updates) {
  try {
    const updated = await api.photos.update(photoId, updates);
    return updated;
  } catch (error) {
    console.error('Failed to update photo:', error);
    return null;
  }
}

export async function deletePhoto(photoId) {
  try {
    await api.photos.delete(photoId);
    return photoId;
  } catch (error) {
    console.error('Failed to delete photo:', error);
    return null;
  }
}

export async function addPhoto(photoData) {
  try {
    const newPhoto = await api.photos.create(photoData);
    return newPhoto;
  } catch (error) {
    if (error.message && error.message.includes('已存在')) {
      throw error;
    }
    console.error('Failed to add photo:', error);
    return null;
  }
}

export async function getCategories() {
  try {
    const categories = await api.categories.list();
    return categories;
  } catch (error) {
    console.error('Failed to load categories:', error);
    return ['全部', '运动', '课堂', '师生', '趣味活动', '日常', '作品'];
  }
}

export async function addCategory(categoryName) {
  try {
    const result = await api.categories.create(categoryName);
    return result.categories;
  } catch (error) {
    console.error('Failed to add category:', error);
    return null;
  }
}

export async function updateCategory(oldName, newName) {
  try {
    const result = await api.categories.update(oldName, newName);
    return result.categories;
  } catch (error) {
    console.error('Failed to update category:', error);
    return null;
  }
}

export async function deleteCategory(categoryName) {
  try {
    const result = await api.categories.delete(categoryName);
    return result.categories;
  } catch (error) {
    console.error('Failed to delete category:', error);
    return null;
  }
}

export function getCustomCategories() {
  return ['全部', '运动', '课堂', '师生', '趣味活动', '日常', '作品'];
}

export const defaultCategories = ['全部', '运动', '课堂', '师生', '趣味活动', '日常', '作品'];