import axiosInstance from '@utils/axiosInstance';
import type { Profesional } from '../types/profesional.types';

const API_URL = '/profesionales';

export const createProfesional = async (profesional: Omit<Profesional, 'id' | 'nombreUsuario' | 'emailUsuario'>): Promise<Profesional> => {
    const response = await axiosInstance.post<Profesional>(API_URL, profesional);
    return response.data;
};

export const getAllProfesionales = async (): Promise<Profesional[]> => {
    const response = await axiosInstance.get<Profesional[]>(API_URL);
    return response.data;
};

export const getProfesionalById = async (id: number): Promise<Profesional> => {
    const response = await axiosInstance.get<Profesional>(`${API_URL}/${id}`);
    return response.data;
};

export const updateProfesional = async (id: number, profesional: Omit<Profesional, 'id' | 'usuarioId' | 'nombreUsuario' | 'emailUsuario'>): Promise<Profesional> => {
    const response = await axiosInstance.put<Profesional>(`${API_URL}/${id}`, profesional);
    return response.data;
};

export const deleteProfesional = async (id: number): Promise<void> => {
    await axiosInstance.delete(`${API_URL}/${id}`);
};
