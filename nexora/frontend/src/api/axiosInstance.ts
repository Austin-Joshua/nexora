import axios from 'axios';

// Base URL is the backend ORIGIN (no /api suffix) — all paths already include /api/...
// e.g. VITE_API_BASE_URL = https://nexora-75kw.onrender.com  (no trailing slash, no /api)
const RAW_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
// Normalise: strip any trailing /api or / so we get a clean origin
const API_BASE_URL = RAW_BASE.replace(/\/api\/?$/, '').replace(/\/$/, '');

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});


// Request interceptor — attach JWT
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('nexora_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('nexora_token');
      localStorage.removeItem('nexora_user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
