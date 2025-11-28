import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../shared/hooks/useAuth';

/**
 * Hook que requiere autenticación y opcionalmente un rol específico
 * Redirige a login si no está autenticado o a unauthorized si no tiene el rol
 */
export const useRequireAuth = (requiredRole?: string) => {
    const { user, isAuthenticated, isLoading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoading) return;

        if (!isAuthenticated) {
            navigate('/login', { replace: true });
            return;
        }

        if (requiredRole && !user?.roles.includes(requiredRole)) {
            navigate('/unauthorized', { replace: true });
        }
    }, [isAuthenticated, isLoading, user, requiredRole, navigate]);

    return { user, isAuthenticated, isLoading };
};
