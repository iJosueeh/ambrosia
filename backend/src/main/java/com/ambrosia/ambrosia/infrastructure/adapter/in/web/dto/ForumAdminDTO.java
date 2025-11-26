package com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID; // Importar UUID

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ForumAdminDTO {
    private UUID id; // Cambio a UUID
    private String titulo;
    private String autorNombre;
    private String categoriaForoNombre;
    private LocalDateTime fechaCreacion;
    private String status;
    private int commentCount;
}
