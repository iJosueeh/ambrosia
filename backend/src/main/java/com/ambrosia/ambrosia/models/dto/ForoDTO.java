package com.ambrosia.ambrosia.models.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ForoDTO {
    private Long id;
    private String titulo;
    private String descripcion;
    private Long autorId;
    private String autorNombre;
    private LocalDateTime fechaCreacion;
    private int numeroComentarios;
}
