import { useState } from "react";

interface User {
    id: string;
    name: string;
    email: string;
    role: "admin" | "user";
}

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const login = async (email: string, pass: string) => {
        setLoading(true);
        setError(null);
        await new Promise(resolve => setTimeout(resolve, 1500));

        if (email === "test@test.com" && pass === "password") {
            const mockUser: User = { id: "1", name: "Test User", email, role: "user" };
            setUser(mockUser);
            setLoading(false);
            return true;
        } else {
            setError("Correo o contraseña incorrectos.");
            setLoading(false);
            return false;
        }
    };

    const logout = async () => {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500));
        setUser(null);
        setLoading(false);
    };

    return { user, isAuthenticated: !!user, loading, error, login, logout };
}