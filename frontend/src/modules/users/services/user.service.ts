import axiosInstance from '@utils/axiosInstance';
import type { UsuarioDTO, UpdateUserRequest, ChangePasswordRequest, Guardado, CrearGuardadoRequest } from "../types/user.types";

export const getUserByEmail = async (email: string): Promise<UsuarioDTO> => {
    try {
        const response = await axiosInstance.get(`/usuarios/email/${email}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching user by email:', error);
        throw error;
    }
};

export const updateUser = async (id: string, data: UpdateUserRequest): Promise<UsuarioDTO> => {
    try {
        const response = await axiosInstance.put(`/usuarios/${id}`, data);
        return response.data;
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
};

export const changePassword = async (id: string, data: ChangePasswordRequest): Promise<void> => {
    try {
        await axiosInstance.put(`/usuarios/${id}/cambiar-contrasena`, data);
    } catch (error) {
        console.error('Error changing password:', error);
        throw error;
    }
};

export const deleteUser = async (id: string): Promise<void> => {
    try {
        await axiosInstance.delete(`/usuarios/${id}`);
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
};

export const getSavedItems = async (): Promise<Guardado[]> => {
    try {
        const response = await axiosInstance.get('/guardados');
        return response.data.content;
    } catch (error) {
        console.error('Error fetching saved items:', error);
        throw error;
    }
};

export const saveItem = async (data: CrearGuardadoRequest): Promise<Guardado> => {
    try {
        const response = await axiosInstance.post('/guardados', data);
        return response.data;
    } catch (error) {
        console.error('Error saving item:', error);
        throw error;
    }
};

export const removeSavedItem = async (id: string): Promise<void> => {
    try {
        await axiosInstance.delete(`/guardados/${id}`);
    } catch (error) {
        console.error('Error removing saved item:', error);
        throw error;
    }
};

export const checkSavedStatus = async (tipo: string, itemId: string): Promise<boolean> => {
    try {
        const response = await axiosInstance.get('/guardados/check', {
            params: { tipo, itemId }
        });
        return response.data;
    } catch (error) {
        console.error('Error checking saved status:', error);
        return false;
    }
};