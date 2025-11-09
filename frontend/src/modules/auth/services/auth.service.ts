import axiosInstance from '@utils/axiosInstance';

export interface LoginResponse {
  id: number;
  nombre: string;
  correo: string;
  roles: string[];        // ✅ Array de roles
  rolPrincipal: string;   // ✅ Rol principal (ADMIN o USER)
  token: string;
}

export const login = async (credentials: { correo: string; contrasena: string }): Promise<LoginResponse> => {
  const response = await axiosInstance.post('/auth/login', {
    correo: credentials.correo,
    contrasena: credentials.contrasena,
  });

  const loginResponse = response.data;
  localStorage.setItem('jwt_token', loginResponse.token);
  return loginResponse;
};

export interface RegisterResponse {
  message: string;
}

interface RegisterRequest {
  nombre: string;
  correo: string;
  password: string;
  rol: string;
}

export const register = async (userData: RegisterRequest): Promise<RegisterResponse> => {
  const response = await axiosInstance.post('/usuarios/registrar', userData);
  return response.data;
};