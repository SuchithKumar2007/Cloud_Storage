import axios from 'axios';

const API_BASE = '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach Authorization Bearer token from localStorage
api.interceptors.request.use(config => {
  const token = localStorage.getItem('memopix_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle unauthorized responses
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      if (!window.location.pathname.startsWith('/login') && 
          !window.location.pathname.startsWith('/register') &&
          !window.location.pathname.startsWith('/share')) {
        localStorage.removeItem('memopix_token');
        localStorage.removeItem('memopix_user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authApi = {
  register: (data: any) => api.post('/auth/register', data).then(r => r.data),
  login: (data: any) => api.post('/auth/login', data).then(r => r.data),
  getMe: () => api.get('/auth/me').then(r => r.data),
  forgotPassword: (email: string) => api.post('/auth/forgot-password', { email }).then(r => r.data),
  resetPassword: (data: any) => api.post('/auth/reset-password', data).then(r => r.data),
  logout: () => api.post('/auth/logout').then(r => r.data)
};

// Media APIs
export const mediaApi = {
  list: (params: { view?: string; albumId?: string; search?: string; page?: number; limit?: number }) =>
    api.get('/media', { params }).then(r => r.data),
  
  getById: (id: string) => api.get(`/media/${id}`).then(r => r.data),

  upload: (file: File, forceDuplicate: boolean = false, onProgress?: (pct: number) => void) => {
    const formData = new FormData();
    formData.append('file', file);
    if (forceDuplicate) {
      formData.append('forceDuplicate', 'true');
    }

    return api.post('/media/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: progressEvent => {
        if (progressEvent.total && onProgress) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percent);
        }
      }
    }).then(r => r.data);
  },

  update: (id: string, data: { isFavorite?: boolean; isArchived?: boolean; originalName?: string }) =>
    api.patch(`/media/${id}`, data).then(r => r.data),

  trash: (id: string) => api.delete(`/media/${id}`).then(r => r.data),
  restore: (id: string) => api.post(`/media/${id}/restore`).then(r => r.data),
  deletePermanent: (id: string) => api.delete(`/media/${id}/permanent`).then(r => r.data),
  emptyTrash: () => api.post('/media/empty-trash').then(r => r.data),

  bulkAction: (action: string, mediaIds: string[]) =>
    api.post('/media/bulk', { action, mediaIds }).then(r => r.data),

  downloadZip: (mediaIds: string[]) => {
    return api.post('/media/bulk-download', { mediaIds }, { responseType: 'blob' });
  }
};

// Album APIs
export const albumApi = {
  list: () => api.get('/albums').then(r => r.data),
  create: (data: { title: string; description?: string; mediaIds?: string[] }) =>
    api.post('/albums', data).then(r => r.data),
  getById: (id: string) => api.get(`/albums/${id}`).then(r => r.data),
  update: (id: string, data: any) => api.patch(`/albums/${id}`, data).then(r => r.data),
  delete: (id: string) => api.delete(`/albums/${id}`).then(r => r.data),
  addMedia: (albumId: string, mediaIds: string[]) =>
    api.post(`/albums/${albumId}/media`, { mediaIds }).then(r => r.data),
  removeMedia: (albumId: string, mediaId: string) =>
    api.delete(`/albums/${albumId}/media/${mediaId}`).then(r => r.data)
};

// Share APIs
export const shareApi = {
  create: (data: { mediaId?: string; albumId?: string; expiresInDays?: number; allowDownload?: boolean }) =>
    api.post('/share', data).then(r => r.data),
  listMyLinks: () => api.get('/share/my-links').then(r => r.data),
  update: (id: string, data: any) => api.patch(`/share/${id}`, data).then(r => r.data),
  delete: (id: string) => api.delete(`/share/${id}`).then(r => r.data),
  getPublic: (token: string) => api.get(`/share/public/${token}`).then(r => r.data)
};

// Storage APIs
export const storageApi = {
  getUsage: () => api.get('/storage/usage').then(r => r.data),
  recalculate: () => api.post('/storage/recalculate').then(r => r.data)
};

// User APIs
export const userApi = {
  updateProfile: (data: { name?: string; avatarUrl?: string }) =>
    api.patch('/user/profile', data).then(r => r.data),
  changePassword: (data: any) => api.post('/user/change-password', data).then(r => r.data)
};

export default api;
