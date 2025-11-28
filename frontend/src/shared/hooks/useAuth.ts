import * as React from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from 'react-hot-toast';
import { login as authServiceLogin, logout as authServiceLogout, getCurrentUser, type LoginResponse } from "../../modules/auth/services/auth.service";
import type { CurrentUser } from "../../types/auth.types";

export interface User {
    id: string;
    name: string;
    email: string;
    roles: string[];
    rolPrincipal: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string, pass: string) => Promise<boolean>;
    logout: () => void;
    loading: boolean;
    isLoading: boolean; // Alias para compatibilidad
    error: string | null;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = React.useState<User | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);

    // Inicializar usuario desde el backend al cargar
    React.useEffect(() => {
        const initializeAuth = async () => {
            try {
                // Verificar si hay cookies de sesión antes de llamar al backend
                // Esto evita el error 401 innecesario cuando no hay sesión activa
                const hasCookies = document.cookie.includes('accessToken') || document.cookie.includes('refreshToken');

                if (!hasCookies) {
                    // No hay cookies, no hay sesión activa
                    setUser(null);
                    setIsLoading(false);
                    return;
                }

                // Intentar obtener el usuario actual desde /auth/me
                // Si hay una cookie válida, el backend retornará el usuario
                const currentUser: CurrentUser = await getCurrentUser();

                setUser({
                    id: currentUser.id,
                    name: currentUser.nombre,
                    email: currentUser.correo,
                    roles: currentUser.roles,
                    rolPrincipal: currentUser.rol,
                });
            } catch (error: any) {
                // Error al verificar sesión (cookie expirada, error de red, etc.)
                // Solo mostramos errores que NO sean 401 (otros errores sí son importantes)
                if (error?.response?.status !== 401) {
                    console.error('Error al verificar sesión:', error);
                }
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        initializeAuth();
    }, []);

    const logout = React.useCallback(() => {
        // Llamar al backend para revocar tokens y eliminar cookies
        authServiceLogout().catch((err: any) => {
            console.error('Error during logout:', err);
        });

        // Limpiar estado local
        setUser(null);
    }, []);

    const loginMutation = useMutation<LoginResponse, any, Parameters<typeof authServiceLogin>[0]>({
        mutationFn: authServiceLogin,
        onSuccess: (data) => {
            const roles = Array.isArray(data.roles) ? data.roles :
                data.roles ? [data.roles] :
                    ['ROLE_USER'];

            const rolPrincipal = data.rol ||
                (roles.includes('ROLE_ADMIN') ? 'ROLE_ADMIN' : 'ROLE_USER');

            const loggedInUser: User = {
                id: data.id,
                name: data.nombre,
                email: data.correo,
                roles: roles,
                rolPrincipal: rolPrincipal
            };

            setUser(loggedInUser);
            // Ya no guardamos en localStorage, las cookies se manejan automáticamente
            toast.success("¡Inicio de sesión exitoso!");
        },
        onError: (err: any) => {
            const errorMessage = err.response?.data?.message || "Error al iniciar sesión.";
            toast.error(errorMessage);
        },
    });

    const login = React.useCallback(async (email: string, pass: string): Promise<boolean> => {
        try {
            await loginMutation.mutateAsync({ correo: email, contrasena: pass });
            return true;
        } catch (error: unknown) {
            console.error(error);
            return false;
        }
    }, [loginMutation]);

    const value = React.useMemo(() => ({
        user,
        isAuthenticated: !!user,
        login,
        logout,
        loading: isLoading || loginMutation.isPending,
        isLoading: isLoading || loginMutation.isPending, // Alias para compatibilidad
        error: loginMutation.isError ? loginMutation.error.response?.data?.message || "Error al iniciar sesión." : null,
    }), [user, login, logout, isLoading, loginMutation.isPending, loginMutation.isError, loginMutation.error]);

    return React.createElement(AuthContext.Provider, { value }, children);
};

export const useAuth = () => {
    const context = React.useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};