import axiosInstance from '@utils/axiosInstance';
import type { Material } from '../types/material.types';

const API_URL = '/materials';

export const createMaterial = async (material: Omit<Material, 'id' | 'fechaCreacion' | 'nombreProfesional'>): Promise<Material> => {
    const response = await axiosInstance.post<Material>(API_URL, material);
    return response.data;
};

export const getAllMaterials = async (): Promise<Material[]> => {
    const response = await axiosInstance.get<Material[]>(API_URL);
    return response.data;
};

export const getMaterialsByProfesionalId = async (profesionalId: number): Promise<Material[]> => {
    const response = await axiosInstance.get<Material[]>(`${API_URL}/profesional/${profesionalId}`);
    return response.data;
};

export const getMaterialById = async (id: number): Promise<Material> => {
    const response = await axiosInstance.get<Material>(`${API_URL}/${id}`);
    return response.data;
};

export const updateMaterial = async (id: number, material: Omit<Material, 'id' | 'fechaCreacion' | 'nombreProfesional'>): Promise<Material> => {
    const response = await axiosInstance.put<Material>(`${API_URL}/${id}`, material);
    return response.data;
};

export const deleteMaterial = async (id: number): Promise<void> => {
    await axiosInstance.delete(`${API_URL}/${id}`);
};
