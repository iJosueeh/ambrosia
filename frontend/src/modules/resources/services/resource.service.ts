import axiosInstance from '../../../utils/axiosInstance';
import type { RecursoDTO } from "../types/recurso.types";
import type { CategoriaRecursoDTO } from "../types/categoria.types";

const API_URL = '/recursos';

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

export const updateRecurso = async (id: string, recurso: Omit<RecursoDTO, 'id' | 'fechaPublicacion' | 'creadorId' | 'nombreCreador' | 'categoria'>): Promise<RecursoDTO> => {
    const response = await axiosInstance.put<RecursoDTO>(`${API_URL}/${id}`, recurso);
    return response.data;
};

export const deleteRecurso = async (id: string): Promise<void> => {
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
    const response = await axiosInstance.get<CategoriaRecursoDTO[]>(`${API_URL}/categorias`);
    return response.data;
};

export const getRecursoStatuses = async (): Promise<{ id: number; nombre: string; descripcion: string }[]> => {
    const response = await axiosInstance.get<{ id: number; nombre: string; descripcion: string }[]>('/estados-publicado');
    return response.data;
};

export const getResourcesByCategory = async (categoryId: string, page: number, size: number, searchQuery: string = ''): Promise<PaginatedResources> => {
    const response = await axiosInstance.get<PaginatedResources>(`${API_URL}/categoria/${categoryId}`, {
        params: {
            page: page,
            size: size,
            search: searchQuery
        }
    });
    return response.data;
};

export const getRecursoById = async (id: string): Promise<RecursoDTO> => {
    const response = await axiosInstance.get<RecursoDTO>(`${API_URL}/${id}`);
    return response.data;
};

export const getRecursoBySlug = async (slug: string): Promise<RecursoDTO> => {
    const response = await axiosInstance.get<RecursoDTO>(`${API_URL}/slug/${slug}`);
    return response.data;
};

export const incrementDownloadCount = async (id: string): Promise<void> => {
    await axiosInstance.put(`${API_URL}/${id}/descargar`);
};

export interface RecursoRelacionado {
    id: string;
    titulo: string;
    descripcion: string;
    slug: string;
    urlimg: string;
    tipoRecurso: string;
    nombreCategoria: string;
}

export interface ProgresoUsuario {
    articulosLeidos: number;
    totalArticulosRecomendados: number;
    porcentaje: number;
    recursosLeidosIds: string[];
}

export const getRecursosRelacionados = async (
    recursoId: string,
    limit: number = 3
): Promise<RecursoRelacionado[]> => {
    const response = await axiosInstance.get<RecursoRelacionado[]>(
        `${API_URL}/${recursoId}/relacionados`,
        { params: { limit } }
    );
    return response.data;
};

export const marcarRecursoComoLeido = async (
    recursoId: string,
    tiempoLecturaSegundos?: number
): Promise<void> => {
    await axiosInstance.post(
        `${API_URL}/${recursoId}/marcar-leido`,
        null,
        { params: { tiempoLecturaSegundos } }
    );
};

export const getProgresoUsuario = async (): Promise<ProgresoUsuario> => {
    const response = await axiosInstance.get<ProgresoUsuario>(`${API_URL}/progreso`);
    return response.data;
};