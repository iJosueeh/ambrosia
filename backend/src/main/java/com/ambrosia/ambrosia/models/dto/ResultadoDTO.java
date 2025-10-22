package com.ambrosia.ambrosia.models.dto;

import java.util.List;

public record ResultadoDTO(
        Long usuarioId,
        Long testId,
        List<RespuestaDTO> respuestas,
        Integer puntajeTotal
) {
}