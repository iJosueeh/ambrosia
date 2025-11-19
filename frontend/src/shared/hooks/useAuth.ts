import * as React from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from 'react-hot-toast';
import { login as authServiceLogin, type LoginResponse } from "../../modules/auth/services/auth.service";
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { jwtDecode } from 'jwt-decode'; // Import jwtDecode

interface User {
    id: number;
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
    error: string | null;
    checkTokenExpiration: () => void; // Add this to context type
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const navigate = useNavigate(); // Initialize useNavigate
    const [user, setUser] = React.useState<User | null>(() => {
        const storedUser = localStorage.getItem('user');
        const initialUser = storedUser ? JSON.parse(storedUser) : null;
        // console.log("DEBUG: AuthProvider initial user from localStorage:", initialUser);
        return initialUser;
    });

    const logout = React.useCallback(() => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('jwt_token'); // Clear the JWT token
        // Also remove any other relevant items if they exist
    }, []);

    const loginMutation = useMutation<LoginResponse, any, Parameters<typeof authServiceLogin>[0]>({ // Changed BackendError to any
        mutationFn: authServiceLogin,
        onSuccess: (data) => {
            // console.log("🔍 RESPUESTA COMPLETA DEL LOGIN:", data);
            // console.log("🔍 data.roles:", data.roles);
            // console.log("🔍 data.rolPrincipal:", data.rolPrincipal);
            
            const roles = Array.isArray(data.roles) ? data.roles : 
                         data.roles ? [data.roles] : 
                         ['ROLE_USER']; // Fallback por defecto
            
            // ✅ Usar rolPrincipal del backend o calcularlo
            const rolPrincipal = data.rolPrincipal || 
                                (roles.includes('ROLE_ADMIN') ? 'ROLE_ADMIN' : 'ROLE_USER');
            
            const loggedInUser: User = { 
                id: data.id, 
                name: data.nombre, 
                email: data.correo, 
                roles: roles,
                rolPrincipal: rolPrincipal
            };
            
            // console.log("🔍 Usuario final guardado:", loggedInUser);
            setUser(loggedInUser);
            localStorage.setItem('user', JSON.stringify(loggedInUser));
            localStorage.setItem('jwt_token', data.token); // Ensure token is explicitly stored here as well
            toast.success("¡Inicio de sesión exitoso!");
        },
        onError: (err) => {
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

    const checkTokenExpiration = React.useCallback(() => {
        const token = localStorage.getItem('jwt_token');
        if (token) {
            try {
                const decodedToken: any = jwtDecode(token);
                // console.log("Token expiration (exp):", new Date(decodedToken.exp * 1000));
                // console.log("Current time:", new Date());
                if (decodedToken.exp * 1000 < Date.now()) {
                    toast.error("Tu sesión ha expirado.");
                    logout();
                    navigate('/login?sessionExpired=true');
                }
            } catch (error) {
                console.error("Error decoding token:", error);
                logout();
                navigate('/login?sessionExpired=true');
            }
        }
    }, [navigate, logout]);

    // Periodically check token expiration
    React.useEffect(() => {
        const interval = setInterval(() => {
            checkTokenExpiration();
        }, 60 * 1000); // Check every minute

        // Initial check on mount
        checkTokenExpiration();

        return () => clearInterval(interval);
    }, [checkTokenExpiration]);


    const value = React.useMemo(() => ({
        user,
        isAuthenticated: !!user,
        login,
        logout,
        loading: loginMutation.isPending,
        error: loginMutation.isError ? loginMutation.error.response?.data?.message || "Error al iniciar sesión." : null,
        checkTokenExpiration,
    }), [user, login, logout, loginMutation.isPending, loginMutation.isError, loginMutation.error, checkTokenExpiration]);

    return React.createElement(AuthContext.Provider, { value }, children);
};

export const useAuth = () => {
    const context = React.useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};