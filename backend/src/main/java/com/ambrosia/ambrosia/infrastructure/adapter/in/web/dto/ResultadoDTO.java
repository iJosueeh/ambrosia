package com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto;

import java.util.List;
import java.util.UUID;

public record ResultadoDTO(
        UUID usuarioId,
        UUID testId,
        List<RespuestaDTO> respuestas,
        Integer puntajeTotal
) {
}