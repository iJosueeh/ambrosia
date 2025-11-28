package com.ambrosia.ambrosia.infrastructure.util.security;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.Optional;

/**
 * Utilidad para manejo centralizado de cookies de autenticación.
 * Gestiona la creación, lectura y eliminación de cookies HttpOnly para tokens
 * JWT.
 */
@Component
public class CookieUtil {

    public static final String ACCESS_TOKEN_COOKIE = "accessToken";
    public static final String REFRESH_TOKEN_COOKIE = "refreshToken";

    @Value("${jwt.expiration.ms}")
    private long accessTokenExpirationMs;

    @Value("${jwt.refresh.expiration.ms}")
    private long refreshTokenExpirationMs;

    @Value("${cookie.secure:false}")
    private boolean secureCookie;

    /**
     * Crea una cookie HttpOnly para el access token.
     *
     * @param token El JWT access token
     * @return Cookie configurada con flags de seguridad
     */
    public Cookie createAccessTokenCookie(String token) {
        Cookie cookie = new Cookie(ACCESS_TOKEN_COOKIE, token);
        cookie.setHttpOnly(true);
        cookie.setSecure(secureCookie); // true en producción (HTTPS)
        cookie.setPath("/");
        cookie.setMaxAge((int) (accessTokenExpirationMs / 1000)); // Convertir a segundos
        cookie.setAttribute("SameSite", "Lax");
        return cookie;
    }

    /**
     * Crea una cookie HttpOnly para el refresh token.
     *
     * @param token El refresh token
     * @return Cookie configurada con flags de seguridad
     */
    public Cookie createRefreshTokenCookie(String token) {
        Cookie cookie = new Cookie(REFRESH_TOKEN_COOKIE, token);
        cookie.setHttpOnly(true);
        cookie.setSecure(secureCookie); // true en producción (HTTPS)
        cookie.setPath("/");
        cookie.setMaxAge((int) (refreshTokenExpirationMs / 1000)); // Convertir a segundos
        cookie.setAttribute("SameSite", "Lax");
        return cookie;
    }

    /**
     * Extrae el valor de una cookie específica del request.
     *
     * @param request    HttpServletRequest
     * @param cookieName Nombre de la cookie a buscar
     * @return Optional con el valor de la cookie, o empty si no existe
     */
    public Optional<String> getTokenFromCookie(HttpServletRequest request, String cookieName) {
        if (request.getCookies() == null) {
            return Optional.empty();
        }

        return Arrays.stream(request.getCookies())
                .filter(cookie -> cookieName.equals(cookie.getName()))
                .map(Cookie::getValue)
                .findFirst();
    }

    /**
     * Obtiene el access token desde las cookies del request.
     *
     * @param request HttpServletRequest
     * @return Optional con el access token, o empty si no existe
     */
    public Optional<String> getAccessToken(HttpServletRequest request) {
        return getTokenFromCookie(request, ACCESS_TOKEN_COOKIE);
    }

    /**
     * Obtiene el refresh token desde las cookies del request.
     *
     * @param request HttpServletRequest
     * @return Optional con el refresh token, o empty si no existe
     */
    public Optional<String> getRefreshToken(HttpServletRequest request) {
        return getTokenFromCookie(request, REFRESH_TOKEN_COOKIE);
    }

    /**
     * Elimina una cookie estableciendo su MaxAge a 0.
     *
     * @param cookieName Nombre de la cookie a eliminar
     * @return Cookie con MaxAge=0 para ser agregada al response
     */
    public Cookie deleteCookie(String cookieName) {
        Cookie cookie = new Cookie(cookieName, null);
        cookie.setHttpOnly(true);
        cookie.setSecure(secureCookie);
        cookie.setPath("/");
        cookie.setMaxAge(0); // Elimina la cookie
        cookie.setAttribute("SameSite", "Lax");
        return cookie;
    }

    /**
     * Elimina el access token cookie.
     *
     * @return Cookie de access token con MaxAge=0
     */
    public Cookie deleteAccessTokenCookie() {
        return deleteCookie(ACCESS_TOKEN_COOKIE);
    }

    /**
     * Elimina el refresh token cookie.
     *
     * @return Cookie de refresh token con MaxAge=0
     */
    public Cookie deleteRefreshTokenCookie() {
        return deleteCookie(REFRESH_TOKEN_COOKIE);
    }

    /**
     * Agrega cookies de autenticación al response.
     *
     * @param response     HttpServletResponse
     * @param accessToken  JWT access token
     * @param refreshToken Refresh token
     */
    public void addAuthCookies(HttpServletResponse response, String accessToken, String refreshToken) {
        response.addCookie(createAccessTokenCookie(accessToken));
        response.addCookie(createRefreshTokenCookie(refreshToken));
    }

    /**
     * Elimina todas las cookies de autenticación del response.
     *
     * @param response HttpServletResponse
     */
    public void deleteAuthCookies(HttpServletResponse response) {
        response.addCookie(deleteAccessTokenCookie());
        response.addCookie(deleteRefreshTokenCookie());
    }
}
