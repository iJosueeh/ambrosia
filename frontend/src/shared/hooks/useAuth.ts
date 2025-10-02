import { useState } from "react";

interface User {
    id: string;
    name: string;
    email: string;
    role: "admin" | "user";
}

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);

    const login = (newUser: User) => setUser(newUser);
    const logout = () => setUser(null);

    return { user, isAuthenticated: !!user, login, logout };
}