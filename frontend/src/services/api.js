import axios from 'axios';

// In production (Vercel), API calls go to /api (same domain, proxied by vercel.json).
// In development, calls go to http://localhost:5000/api (local Express/Python server).
const baseURL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');

const api = axios.create({ baseURL });

api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
