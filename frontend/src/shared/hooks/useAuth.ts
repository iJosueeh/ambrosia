import * as React from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from 'react-hot-toast';
import { login as authServiceLogin, type LoginResponse } from "../../modules/auth/services/auth.service";

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

interface BackendError {
    response?: {
        data?: {
            message?: string;
        };
    };
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string, pass: string) => Promise<boolean>;
    logout: () => void;
    loading: boolean;
    error: string | null;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = React.useState<User | null>(null);

    const loginMutation = useMutation<LoginResponse, BackendError, Parameters<typeof authServiceLogin>[0]>({
        mutationFn: authServiceLogin,
        onSuccess: (data) => {
            console.log("Login successful, data from backend:", data);
            const loggedInUser: User = { id: data.id, name: data.nombre, email: data.correo, role: data.rol };
            console.log("Logged in user object:", loggedInUser);
            setUser(loggedInUser);
            toast.success("¡Inicio de sesión exitoso!");
        },
        onError: (err) => {
            const errorMessage = err.response?.data?.message || "Error al iniciar sesión.";
            toast.error(errorMessage);
        },
    });

    const login = async (email: string, pass: string): Promise<boolean> => {
        try {
            await loginMutation.mutateAsync({ correo: email, contrasena: pass });
            return true;
        } catch (error: unknown) {
            console.error(error);
            return false;
        }
    };

    const logout = () => {
        setUser(null);
    };

    const value = {
        user,
        isAuthenticated: !!user,
        login,
        logout,
        loading: loginMutation.isPending,
        error: loginMutation.isError ? loginMutation.error.response?.data?.message || "Error al iniciar sesión." : null,
    };

    return React.createElement(AuthContext.Provider, { value }, children);
};

export const useAuth = () => {
    const context = React.useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};