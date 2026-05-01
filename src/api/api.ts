import axios from 'axios';
import { API_BASE } from './config';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

// Add a request interceptor to attach the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle 401s
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized (e.g., redirect to login or clear token)
      console.warn('Unauthorized! Redirecting to login...');
      localStorage.removeItem('auth_token');
      // We can't easily redirect here without access to history/router 
      // but we can emit an event or just let the UI handle it.
    }
    return Promise.reject(error);
  }
);

export default api;
