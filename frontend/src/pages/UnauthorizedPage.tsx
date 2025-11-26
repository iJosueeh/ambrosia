import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const UnauthorizedPage: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full text-center">
                {/* Icon */}
                <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6">
                    <svg
                        className="w-12 h-12 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                    </svg>
                </div>

                {/* Title */}
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    Acceso Denegado
                </h1>

                {/* Message */}
                <p className="text-gray-600 mb-8">
                    No tienes los permisos necesarios para acceder a esta página.
                    {user && (
                        <span className="block mt-2 text-sm">
                            Tu rol actual: <span className="font-semibold">{user.rolPrincipal}</span>
                        </span>
                    )}
                </p>

                {/* Actions */}
                <div className="space-y-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        Volver Atrás
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        className="w-full px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                    >
                        Ir al Inicio
                    </button>
                </div>

                {/* Help text */}
                <p className="mt-8 text-sm text-gray-500">
                    Si crees que esto es un error, contacta al administrador.
                </p>
            </div>
        </div>
    );
};
