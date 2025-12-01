package com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID; // Importar UUID

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ComentarioDTO {
    private UUID id; // Cambio a UUID
    private String contenido;
    private LocalDateTime fechaCreacion;
    private UUID autorId; // Cambio a UUID
    private String autorNombre;
    private UUID foroId; // Cambio a UUID
    private String status;
    private Long likesCount; // Total de likes del comentario
}
