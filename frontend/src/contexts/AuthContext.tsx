import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginCredentials, LoginResponse } from '../types/auth.types';
import { tokenUtils } from '../utils/tokenUtils';
import * as authService from '../modules/auth/services/auth.service';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => void;
    updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Inicializar usuario desde token al cargar
    useEffect(() => {
        const initializeAuth = () => {
            const accessToken = tokenUtils.getAccessToken();

            if (accessToken && !tokenUtils.isTokenExpired(accessToken)) {
                const tokenData = tokenUtils.getUserFromToken(accessToken);
                if (tokenData) {
                    // Aquí podrías hacer una llamada al backend para obtener datos completos del usuario
                    // Por ahora, usamos los datos del token
                    setUser({
                        id: tokenData.id,
                        nombre: '', // Se llenará en login
                        email: tokenData.email,
                        roles: tokenData.roles,
                        rolPrincipal: tokenData.roles[0]?.replace('ROLE_', '') || 'USER',
                        profesionalId: tokenData.profesionalId,
                    });
                }
            }

            setIsLoading(false);
        };

        initializeAuth();
    }, []);

    const login = async (credentials: LoginCredentials): Promise<void> => {
        try {
            const response: LoginResponse = await authService.login(credentials);

            // Guardar tokens
            tokenUtils.setTokens(response.token, response.refreshToken);

            // Establecer usuario
            const newUser: User = {
                id: response.id,
                nombre: response.nombre,
                email: response.correo,
                roles: response.roles,
                rolPrincipal: response.rol,
            };

            // Si hay profesionalId en el token, agregarlo
            const tokenData = tokenUtils.getUserFromToken(response.token);
            if (tokenData?.profesionalId) {
                newUser.profesionalId = tokenData.profesionalId;
            }

            setUser(newUser);
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const logout = () => {
        // Llamar al backend para revocar refresh token
        const refreshToken = tokenUtils.getRefreshToken();
        if (refreshToken) {
            authService.logout(refreshToken).catch(err => {
                console.error('Error during logout:', err);
            });
        }

        // Limpiar estado local
        tokenUtils.clearTokens();
        setUser(null);
    };

    const updateUser = (updatedUser: User) => {
        setUser(updatedUser);
    };

    const value: AuthContextType = {
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        updateUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook para acceder al contexto de autenticación
 */
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
