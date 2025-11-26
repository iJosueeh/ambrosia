import { jwtDecode } from 'jwt-decode';
import type { DecodedToken } from '../types/auth.types';
import { TOKEN_KEYS } from '../config/api.config';

export const tokenUtils = {
    /**
     * Obtiene el access token del localStorage
     */
    getAccessToken(): string | null {
        return localStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN);
    },

    /**
     * Obtiene el refresh token del localStorage
     */
    getRefreshToken(): string | null {
        return localStorage.getItem(TOKEN_KEYS.REFRESH_TOKEN);
    },

    /**
     * Guarda los tokens en localStorage
     */
    setTokens(accessToken: string, refreshToken: string): void {
        localStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, accessToken);
        localStorage.setItem(TOKEN_KEYS.REFRESH_TOKEN, refreshToken);
    },

    /**
     * Elimina los tokens del localStorage
     */
    clearTokens(): void {
        localStorage.removeItem(TOKEN_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(TOKEN_KEYS.REFRESH_TOKEN);
    },

    /**
     * Decodifica un token JWT
     */
    decodeToken(token: string): DecodedToken | null {
        try {
            return jwtDecode<DecodedToken>(token);
        } catch (error) {
            console.error('Error decoding token:', error);
            return null;
        }
    },

    /**
     * Verifica si un token ha expirado
     */
    isTokenExpired(token: string): boolean {
        const decoded = this.decodeToken(token);
        if (!decoded) return true;
        return decoded.exp * 1000 < Date.now();
    },

    /**
     * Obtiene el usuario desde el token
     */
    getUserFromToken(token: string): { id: string; email: string; roles: string[]; profesionalId?: string } | null {
        const decoded = this.decodeToken(token);
        if (!decoded) return null;

        return {
            id: decoded.userId,
            email: decoded.sub,
            roles: decoded.roles,
            profesionalId: decoded.profesionalId,
        };
    },
};
