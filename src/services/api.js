import axios from 'axios';

const API_URL = 'https://symmetrical-space-spork-4jpqw5p4qv5gh74j5-5000.app.github.dev/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const auth = {
  login: async (username, password) => {
    try {
      const response = await api.post('/auth/login', { username, password });
      const { access_token } = response.data;
      if (access_token) {
        localStorage.setItem('admin_token', access_token);
      }
      return response.data;
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      throw error;
    }
  },
  logout: () => {
    localStorage.removeItem('admin_token');
  },
};

export const brands = {
  getAll: () => api.get('/brands'),
  create: (data) => api.post('/brands', data),
  update: (name, data) => api.put(`/brands/${name}`, data),
  delete: (name) => api.delete(`/brands/${name}`),
};

export const products = {
  getAll: () => api.get('/products'),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
};

export const messages = {
  create: (data) => api.post('/messages', data),
  getAll: () => api.get('/messages'),
};

export const admin = {
  getDashboard: () => api.get('/admin/dashboard'),
};