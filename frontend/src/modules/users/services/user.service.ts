import axiosInstance from '@utils/axiosInstance'; // Use the path alias

export interface UsuarioDTO {
    actividadReciente: never[];
    progreso: never[];
    diasActivo: any;
    recursosDescargados: any;
    testsCompletados: any;
    articulosLeidos: any;
    recomendaciones: never[];
    id: number;
    nombre: string;
    correo: string;
    rol: string;
} 

export const getUserByEmail = async (email: string): Promise<UsuarioDTO> => {
    try {
        const response = await axiosInstance.get(`/usuarios/${email}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching user by email:', error);
        throw error;
    }
};