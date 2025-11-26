package com.ambrosia.ambrosia.infrastructure.config;

import com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto.error.ErrorResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.LocalDateTime;

/**
 * Maneja errores de autenticación (401 Unauthorized).
 * Se activa cuando un usuario intenta acceder a un recurso protegido sin estar
 * autenticado
 * o con un token inválido/expirado.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {

    private final ObjectMapper objectMapper;

    @Override
    public void commence(HttpServletRequest request,
            HttpServletResponse response,
            AuthenticationException authException) throws IOException, ServletException {

        log.warn("Acceso no autorizado a: {} - {}", request.getRequestURI(), authException.getMessage());

        // Obtener excepción específica si fue guardada por el filtro
        Exception exception = (Exception) request.getAttribute("exception");
        String message = "No estás autenticado. Por favor, inicia sesión";

        if (exception != null) {
            String exceptionClass = exception.getClass().getSimpleName();

            if (exceptionClass.contains("ExpiredJwt")) {
                message = "Tu sesión ha expirado. Por favor, inicia sesión nuevamente";
            } else if (exceptionClass.contains("MalformedJwt") || exceptionClass.contains("SignatureException")) {
                message = "Token inválido o malformado";
            } else if (exceptionClass.contains("UnsupportedJwt")) {
                message = "Token no soportado";
            } else {
                message = "Error de autenticación: " + exception.getMessage();
            }
        }

        ErrorResponse errorResponse = ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.UNAUTHORIZED.value())
                .error(HttpStatus.UNAUTHORIZED.getReasonPhrase())
                .message(message)
                .path(request.getRequestURI())
                .build();

        response.setStatus(HttpStatus.UNAUTHORIZED.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");

        objectMapper.writeValue(response.getWriter(), errorResponse);
    }
}
