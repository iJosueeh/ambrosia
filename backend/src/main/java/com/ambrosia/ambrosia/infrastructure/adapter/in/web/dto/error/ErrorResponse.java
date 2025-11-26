package com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto.error;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;

import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO estándar para respuestas de error en la API.
 * Proporciona información detallada sobre errores de manera consistente.
 */
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public record ErrorResponse(
        LocalDateTime timestamp,
        int status,
        String error,
        String message,
        String path,
        List<FieldError> errors) {
}
