import axiosInstance from '@utils/axiosInstance';
import {
  LoginResponse,
  LoginCredentials,
  RegisterRequest,
  RegisterResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
} from '../../../types/auth.types';
import { tokenUtils } from '../../../utils/tokenUtils';

/**
 * Servicio de autenticación
 */

export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  const response = await axiosInstance.post<LoginResponse>('/auth/login', {
    correo: credentials.correo,
    contrasena: credentials.contrasena,
  });

  return response.data;
};

export const register = async (userData: RegisterRequest): Promise<RegisterResponse> => {
  const response = await axiosInstance.post<RegisterResponse>('/usuarios/registrar', userData);
  return response.data;
};

export const refreshToken = async (refreshToken: string): Promise<RefreshTokenResponse> => {
  const response = await axiosInstance.post<RefreshTokenResponse>('/auth/refresh', {
    refreshToken,
  });
  return response.data;
};

export const logout = async (refreshToken: string): Promise<void> => {
  try {
    await axiosInstance.post('/auth/logout', { refreshToken });
  } catch (error) {
    console.error('Error during logout:', error);
    // No lanzar error, solo loguearlo
  }
};

export const isAuthenticated = (): boolean => {
  const token = tokenUtils.getAccessToken();
  return token !== null && !tokenUtils.isTokenExpired(token);
};