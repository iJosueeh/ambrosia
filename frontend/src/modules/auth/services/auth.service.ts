import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export interface LoginResponse {
  id: number;
  nombre: string;
  correo: string;
  rol: string;
}

export const login = async (credentials: { correo: string; contrasena: string }): Promise<LoginResponse> => {
  const response = await axios.post(`${API_URL}/auth/login`, {
    correo: credentials.correo,
    contrasena: credentials.contrasena,
  });
  
  return response.data;
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
  const response = await axios.post(`${API_URL}/usuarios/registrar`, userData);
  return response.data;
};
