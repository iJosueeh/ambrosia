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
public class CommentAdminDTO {
    private UUID id; // Cambio a UUID
    private String contenido;
    private String autorNombre;
    private UUID foroId; // Cambio a UUID
    private String foroTitulo;
    private LocalDateTime fechaCreacion;
    private String status;
}
