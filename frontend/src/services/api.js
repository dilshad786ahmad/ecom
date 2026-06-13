import axios from 'axios';

const api = axios.create({
  baseURL: 'https://ecom-skc5.onrender.com/api', // Backend running on render
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercept requests to add token
api.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const { token } = JSON.parse(userInfo);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
