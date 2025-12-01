import axiosInstance from '@utils/axiosInstance';

const API_URL = '';

export const forumService = {
    getAllCategories: async () => {
        const response = await axiosInstance.get(`${API_URL}/categorias-foro`);
        return response.data;
    },

    getCategoryById: async (id: string) => {
        const response = await axiosInstance.get(`${API_URL}/categorias-foro/${id}`);
        return response.data;
    },

    createCategory: async (categoryData: any) => {
        const response = await axiosInstance.post(`${API_URL}/categorias-foro`, categoryData);
        return response.data;
    },

    getAllForos: async () => {
        const response = await axiosInstance.get(`${API_URL}/foros`);
        return response.data;
    },

    getForoById: async (id: string) => {
        const response = await axiosInstance.get(`${API_URL}/foros/${id}`);
        return response.data;
    },

    createForo: async (foroData: any) => {
        const response = await axiosInstance.post(`${API_URL}/foros`, foroData);
        return response.data;
    },

    getForosByCategoriaForoId: async (categoriaForoId: string) => {
        const response = await axiosInstance.get(`${API_URL}/foros/categoria/${categoriaForoId}`);
        return response.data;
    },

    getCommentsByForoId: async (foroId: string) => {
        const response = await axiosInstance.get(`${API_URL}/foros/${foroId}/comentarios`);
        return response.data;
    },

    createComment: async (foroId: string, commentData: any) => {
        const response = await axiosInstance.post(`${API_URL}/foros/${foroId}/comentarios`, commentData);
        return response.data;
    },

    // Métodos de likes
    toggleLike: async (foroId: string, comentarioId: string) => {
        const response = await axiosInstance.post(`${API_URL}/foros/${foroId}/comentarios/${comentarioId}/like`);
        return response.data;
    },

    getLikesCount: async (foroId: string, comentarioId: string) => {
        const response = await axiosInstance.get(`${API_URL}/foros/${foroId}/comentarios/${comentarioId}/likes/count`);
        return response.data;
    },

    hasUserLiked: async (foroId: string, comentarioId: string) => {
        const response = await axiosInstance.get(`${API_URL}/foros/${foroId}/comentarios/${comentarioId}/likes/me`);
        return response.data;
    }
};
