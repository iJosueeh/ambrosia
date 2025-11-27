import axiosInstance from '../../../utils/axiosInstance';
import type { RecursoDTO } from "../types/recurso.types";
import type { CategoriaRecursoDTO } from "../types/categoria.types";

const API_URL = '/v1/recursos';

export interface PaginatedResources {
    content: RecursoDTO[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number; // current page number (0-indexed)
}

export const createRecurso = async (recurso: Omit<RecursoDTO, 'id' | 'fechaPublicacion' | 'creadorId' | 'nombreCreador' | 'categoria'>): Promise<RecursoDTO> => {
    const response = await axiosInstance.post<RecursoDTO>(API_URL, recurso);
    return response.data;
};

export const updateRecurso = async (id: number, recurso: Omit<RecursoDTO, 'id' | 'fechaPublicacion' | 'creadorId' | 'nombreCreador' | 'categoria'>): Promise<RecursoDTO> => {
    const response = await axiosInstance.put<RecursoDTO>(`${API_URL}/${id}`, recurso);
    return response.data;
};

export const deleteRecurso = async (id: number): Promise<void> => {
    await axiosInstance.delete(`${API_URL}/${id}`);
};

export const getRecursosByProfesionalId = async (profesionalId: string): Promise<RecursoDTO[]> => {
    const response = await axiosInstance.get<RecursoDTO[]>(`${API_URL}/profesional/${profesionalId}`);
    return response.data;
};

export const getAllResources = async (page: number, size: number, searchQuery: string = ''): Promise<PaginatedResources> => {
    const response = await axiosInstance.get<PaginatedResources>(API_URL, {
        params: {
            page: page,
            size: size,
            search: searchQuery
        }
    });
    return response.data;
};

export const getCategories = async (): Promise<CategoriaRecursoDTO[]> => {
    const response = await axiosInstance.get<CategoriaRecursoDTO[]>('/resource-categories'); // This endpoint is not /v1
    return response.data;
};

export const getRecursoStatuses = async (): Promise<{ id: number; nombre: string; descripcion: string }[]> => {
    const response = await axiosInstance.get<{ id: number; nombre: string; descripcion: string }[]>('/resource-statuses'); // This endpoint is not /v1
    return response.data;
};

export const getResourcesByCategory = async (categoryId: number, page: number, size: number, searchQuery: string = ''): Promise<PaginatedResources> => {
    const response = await axiosInstance.get<PaginatedResources>(`${API_URL}/categoria/${categoryId}`, {
        params: {
            page: page,
            size: size,
            search: searchQuery
        }
    });
    return response.data;
};

export const getRecursoById = async (id: number): Promise<RecursoDTO> => {
    const response = await axiosInstance.get<RecursoDTO>(`${API_URL}/${id}`);
    return response.data;
};

export const incrementDownloadCount = async (id: number): Promise<void> => {
    await axiosInstance.put(`${API_URL}/${id}/descargar`);
};