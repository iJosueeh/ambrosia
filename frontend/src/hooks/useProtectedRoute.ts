import { useAuth } from '../contexts/AuthContext';

/**
 * Hook para verificar si el usuario tiene permisos para una ruta
 */
export const useProtectedRoute = (allowedRoles: string[]) => {
    const { user } = useAuth();

    if (!user) return false;

    return user.roles.some(role => allowedRoles.includes(role));
};
