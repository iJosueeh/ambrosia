package com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto.error;

/**
 * DTO que representa un error de campo específico en validaciones.
 */
public record FieldError(
        String field,
        String message,
        Object rejectedValue) {
}
