package com.ambrosia.ambrosia.models.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ComentarioDTO {
    private Long id;
    private String contenido;
    private LocalDateTime fechaCreacion;
    private Long autorId;
    private String autorNombre;
    private Long foroId;
}
