package com.ambrosia.ambrosia.domain.exception;

/**
 * Excepción lanzada cuando hay errores de validación personalizados.
 * Resulta en una respuesta HTTP 400 (Bad Request).
 */
public class ValidationException extends RuntimeException {

    public ValidationException(String message) {
        super(message);
    }

    public ValidationException(String message, Throwable cause) {
        super(message, cause);
    }
}
