import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LoadingSpinner } from '../shared/components/LoadingSpinner';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: string[];
}

/**
 * Componente para proteger rutas que requieren autenticación
 * y opcionalmente roles específicos
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    allowedRoles
}) => {
    const { user, isAuthenticated, isLoading } = useAuth();

    // Mostrar spinner mientras se carga el estado de autenticación
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <LoadingSpinner size="lg" />
                    <p className="mt-4 text-gray-600">Verificando autenticación...</p>
                </div>
            </div>
        );
    }

    // Si no está autenticado, redirigir a login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Si se requieren roles específicos, verificar
    if (allowedRoles && allowedRoles.length > 0) {
        const hasRequiredRole = user?.roles.some(role => allowedRoles.includes(role));

        if (!hasRequiredRole) {
            return <Navigate to="/unauthorized" replace />;
        }
    }

    // Usuario autenticado y con permisos correctos
    return <>{children}</>;
};
