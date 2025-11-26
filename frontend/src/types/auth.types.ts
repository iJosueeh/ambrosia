// Auth types
export interface LoginCredentials {
    correo: string;
    contrasena: string;
}

export interface LoginResponse {
    id: string; // UUID
    nombre: string;
    correo: string;
    roles: string[];
    rol: string; // Rol principal
    token: string; // Access token
    refreshToken: string; // Refresh token
}

export interface DecodedToken {
    sub: string; // email
    userId: string;
    profesionalId?: string;
    roles: string[];
    iat: number;
    exp: number;
}

export interface User {
    id: string;
    nombre: string;
    email: string;
    roles: string[];
    rolPrincipal: string;
    profesionalId?: string;
}

export interface RefreshTokenRequest {
    refreshToken: string;
}

export interface RefreshTokenResponse {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    expiresIn: number;
}

export interface RegisterRequest {
    nombre: string;
    correo: string;
    password: string;
    rol: string;
}

export interface RegisterResponse {
    message: string;
}
