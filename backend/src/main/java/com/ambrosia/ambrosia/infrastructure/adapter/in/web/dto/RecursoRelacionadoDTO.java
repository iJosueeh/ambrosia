package com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecursoRelacionadoDTO {
    private UUID id;
    private String titulo;
    private String descripcion;
    private String slug;
    private String urlimg;
    private String tipoRecurso; // "Artículo", "Video", "Podcast", etc.
    private String nombreCategoria;
}
