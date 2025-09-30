import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

console.log('API URL:', API_URL); // Debug log

const api = axios.create({
  baseURL: API_URL,
  withCredentials: false, // Changed to false since we're not using cookies
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000, // 10 second timeout
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
      console.log('Attempting login request to:', API_URL + '/auth/login');
      const response = await api.post('/auth/login', { username, password });
      console.log('Login response:', response.data);
      const { access_token } = response.data;
      if (access_token) {
        localStorage.setItem('admin_token', access_token);
      }
      return response.data;
    } catch (error) {
      console.error('Login error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          baseURL: error.config?.baseURL,
          headers: error.config?.headers
        }
      });
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