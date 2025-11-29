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
    // Los tokens ahora se envían como cookies HttpOnly, no en el body
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

/**
 * Respuesta del endpoint /auth/me
 */
export interface CurrentUser {
    id: string;
    nombre: string;
    correo: string;
    roles: string[];
    rol: string;
    profesionalId?: string;
}

export interface RegisterRequest {
    nombre: string;
    email: string;
    password: string;
    rol: string;
}

export interface RegisterResponse {
    message: string;
}
