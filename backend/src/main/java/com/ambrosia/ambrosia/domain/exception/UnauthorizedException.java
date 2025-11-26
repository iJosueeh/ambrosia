package com.ambrosia.ambrosia.domain.exception;

/**
 * Excepción lanzada cuando un usuario no está autenticado.
 * Resulta en una respuesta HTTP 401 (Unauthorized).
 */
public class UnauthorizedException extends RuntimeException {

    public UnauthorizedException(String message) {
        super(message);
    }

    public UnauthorizedException(String message, Throwable cause) {
        super(message, cause);
    }
}
