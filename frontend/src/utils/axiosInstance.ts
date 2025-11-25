import axios from 'axios';
import { forceLogout } from './authUtils'; // Import the forceLogout utility

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api/v1/', // Your backend API base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // If 401 Unauthorized, force logout
      forceLogout();
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;