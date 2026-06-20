import axios from 'axios';

const getBaseURL = () => {
  let url = '';
  
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) {
      url = import.meta.env.VITE_API_URL;
    }
  } catch (e) {
    // Ignore error in non-Vite environments
  }

  if (!url) {
    url = process.env.REACT_APP_API_URL || process.env.VITE_API_URL || 'http://localhost:5000/api';
  }

  if (url && !url.includes('/api')) {
    url = url.replace(/\/$/, '') + '/api';
  }

  return url;
};

const api = axios.create({
  baseURL: getBaseURL(),
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;