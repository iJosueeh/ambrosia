import axiosInstance from '@utils/axiosInstance';
import type {
  LoginResponse,
  LoginCredentials,
  RegisterRequest,
  RegisterResponse,
  CurrentUser,
} from '../../../types/auth.types';

export type { LoginResponse, RegisterResponse };

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

/**
 * Llama al endpoint de logout para revocar tokens.
 * Las cookies se eliminan automáticamente por el backend.
 */
export const logout = async (): Promise<void> => {
  try {
    await axiosInstance.post('/auth/logout');
  } catch (error) {
    console.error('Error during logout:', error);
    // No lanzar error, solo loguearlo
  }
};

/**
 * Obtiene la información del usuario autenticado actual.
 * Lee desde el endpoint /auth/me que usa el token de la cookie.
 */
export const getCurrentUser = async (): Promise<CurrentUser> => {
  const response = await axiosInstance.get<CurrentUser>('/auth/me');
  return response.data;
};