package com.ambrosia.ambrosia.domain.exception;

/**
 * Excepción lanzada cuando un usuario no tiene permisos para acceder a un
 * recurso.
 * Resulta en una respuesta HTTP 403 (Forbidden).
 */
public class ForbiddenException extends RuntimeException {

    public ForbiddenException(String message) {
        super(message);
    }

    public ForbiddenException(String message, Throwable cause) {
        super(message, cause);
    }
}
