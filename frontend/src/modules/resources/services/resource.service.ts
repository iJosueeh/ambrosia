import axiosInstance from '../../../utils/axiosInstance';
import type { RecursoDTO } from "./types/recurso.types";
import type { CategoriaRecursoDTO } from "./types/categoria.types";

export const getAllResources = async (): Promise<RecursoDTO[]> => {
    const response = await axiosInstance.get<RecursoDTO[]>('/recursos');
    return response.data;
};

export const getCategories = async (): Promise<CategoriaRecursoDTO[]> => {
    const response = await axiosInstance.get<CategoriaRecursoDTO[]>('/recursos/categorias');
    return response.data;
};

export const getResourcesByCategory = async (categoryId: number): Promise<RecursoDTO[]> => {
    const response = await axiosInstance.get<RecursoDTO[]>(`/recursos/categoria/${categoryId}`);
    return response.data;
};

export const getArticleById = async (id: number): Promise<RecursoDTO> => {
    const response = await axiosInstance.get<RecursoDTO>(`/recursos/${id}`);
    return response.data;
};

export const incrementDownloadCount = async (id: number): Promise<void> => {
    await axiosInstance.put(`/recursos/${id}/descargar`);
};