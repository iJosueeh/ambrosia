import axiosInstance from '@utils/axiosInstance'; // Use the path alias // Base URL is now handled by axiosInstance

export interface LoginResponse {
  id: number;
  nombre: string;
  correo: string;
  rol: string;
  token: string; // Add token field
}

export const login = async (credentials: { correo: string; contrasena: string }): Promise<LoginResponse> => {
  const response = await axiosInstance.post('/auth/login', { // Use axiosInstance
    correo: credentials.correo,
    contrasena: credentials.contrasena,
  });

  const loginResponse = response.data;
  localStorage.setItem('jwt_token', loginResponse.token); // Store the token
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
  const response = await axiosInstance.post('/usuarios/registrar', userData); // Use axiosInstance
  return response.data;
};
