import axiosInstance from '@utils/axiosInstance';

const API_URL = '';

export const forumService = {
    getAllCategories: async () => {
        const response = await axiosInstance.get(`${API_URL}/categorias-foro`);
        return response.data;
    },

    getCategoryById: async (id: number) => {
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

    getForoById: async (id: number) => {
        const response = await axiosInstance.get(`${API_URL}/foros/${id}`);
        return response.data;
    },

    createForo: async (foroData: any) => {
        const response = await axiosInstance.post(`${API_URL}/foros`, foroData);
        return response.data;
    },

    getForosByCategoriaForoId: async (categoriaForoId: number) => {
        const response = await axiosInstance.get(`${API_URL}/foros/categoria/${categoriaForoId}`);
        return response.data;
    },

    getCommentsByForoId: async (foroId: number) => {
        const response = await axiosInstance.get(`${API_URL}/foros/${foroId}/comentarios`);
        return response.data;
    },

    createComment: async (foroId: number, commentData: any) => {
        const response = await axiosInstance.post(`${API_URL}/foros/${foroId}/comentarios`, commentData);
        return response.data;
    }
};
