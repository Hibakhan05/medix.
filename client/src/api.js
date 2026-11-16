import axios from 'axios';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || '/api' });

api.interceptors.request.use((cfg) => {
  const t = localStorage.getItem('token');
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    const url = err.config?.url || '';
    if (err.response?.status === 401 && !url.includes('/auth/login') && localStorage.getItem('token')) {
      localStorage.removeItem('token');
      if (location.pathname !== '/login') location.assign('/login');
    }
    return Promise.reject(err);
  }
);

export const errMsg = (e) => e.response?.data?.message || 'Something went wrong. Please try again.';
export default api;
