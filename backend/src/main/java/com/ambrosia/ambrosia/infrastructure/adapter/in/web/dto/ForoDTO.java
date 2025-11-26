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
public class ForoDTO {
    private UUID id; // Cambio a UUID
    private String titulo;
    private String descripcion;
    private UUID autorId; // Cambio a UUID
    private String autorNombre;
    private LocalDateTime fechaCreacion;
    private int numeroComentarios;
}