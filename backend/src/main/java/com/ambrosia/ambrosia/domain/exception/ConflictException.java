package com.ambrosia.ambrosia.domain.exception;

/**
 * Excepción lanzada cuando hay un conflicto con el estado actual del recurso.
 * Resulta en una respuesta HTTP 409 (Conflict).
 */
public class ConflictException extends RuntimeException {

    public ConflictException(String message) {
        super(message);
    }

    public ConflictException(String message, Throwable cause) {
        super(message, cause);
    }
}
