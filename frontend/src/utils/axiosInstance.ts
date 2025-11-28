import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { API_CONFIG } from '../config/api.config';
import type { RefreshTokenResponse } from '../types/auth.types';

const axiosInstance = axios.create(API_CONFIG);

// Variable para controlar el proceso de refresh
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(null);
    }
  });
  failedQueue = [];
};

// Response interceptor - Manejar errores 401 y refresh automático
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Excluir ciertos endpoints del manejo automático de 401
    const excludedPaths = ['/auth/me', '/auth/refresh', '/auth/login'];
    const isExcluded = excludedPaths.some(path => originalRequest.url?.includes(path));

    // Si es un endpoint excluido con 401, retornar error silenciosamente
    if (error.response?.status === 401 && isExcluded) {
      // Retornar el error sin procesarlo (será manejado por el catch en useAuth)
      return Promise.reject(error);
    }

    // Si es 401 y no hemos intentado refresh y no es un endpoint excluido
    if (error.response?.status === 401 && !originalRequest._retry && !isExcluded) {

      // Si ya estamos refrescando, agregar a la cola
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            // Reintentar request original (las cookies se envían automáticamente)
            return axiosInstance(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Intentar refresh - las cookies se envían automáticamente
        await axios.post<RefreshTokenResponse>(
          `${API_CONFIG.baseURL}/auth/refresh`,
          {}, // Body vacío, el refresh token va en la cookie
          { withCredentials: true } // Importante: enviar cookies en esta petición
        );

        // Procesar cola de requests
        processQueue(null);

        // Reintentar request original (las cookies se envían automáticamente)
        return axiosInstance(originalRequest);

      } catch (refreshError) {
        // Refresh falló, hacer logout
        processQueue(refreshError);
        forceLogout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

/**
 * Fuerza el logout del usuario
 */
const forceLogout = () => {
  window.location.href = '/login';
};

export default axiosInstance;