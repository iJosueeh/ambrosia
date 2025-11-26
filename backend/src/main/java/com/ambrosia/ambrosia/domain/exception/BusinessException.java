package com.ambrosia.ambrosia.domain.exception;

/**
 * Excepción lanzada cuando ocurre un error en la lógica de negocio.
 * Resulta en una respuesta HTTP 400 (Bad Request).
 */
public class BusinessException extends RuntimeException {

    public BusinessException(String message) {
        super(message);
    }

    public BusinessException(String message, Throwable cause) {
        super(message, cause);
    }
}
