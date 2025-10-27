import axiosInstance from '../../../utils/axiosInstance';
import type { RecursoDTO } from "../types/recurso.types";
import type { CategoriaRecursoDTO } from "../types/categoria.types";

export interface PaginatedResources {
    content: RecursoDTO[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number; // current page number (0-indexed)
}

export const getAllResources = async (page: number, size: number, searchQuery: string = ''): Promise<PaginatedResources> => {
    const response = await axiosInstance.get<PaginatedResources>(`/recursos`, {
        params: {
            page: page,
            size: size,
            search: searchQuery
        }
    });
    return response.data;
};

export const getCategories = async (): Promise<CategoriaRecursoDTO[]> => {
    const response = await axiosInstance.get<CategoriaRecursoDTO[]>('/recursos/categorias');
    return response.data;
};

export const getResourcesByCategory = async (categoryId: number, page: number, size: number, searchQuery: string = ''): Promise<PaginatedResources> => {
    const response = await axiosInstance.get<PaginatedResources>(`/recursos/categoria/${categoryId}`, {
        params: {
            page: page,
            size: size,
            search: searchQuery
        }
    });
    return response.data;
};

export const getArticleById = async (id: number): Promise<RecursoDTO> => {
    const response = await axiosInstance.get<RecursoDTO>(`/recursos/${id}`);
    return response.data;
};

export const incrementDownloadCount = async (id: number): Promise<void> => {
    await axiosInstance.put(`/recursos/${id}/descargar`);
};