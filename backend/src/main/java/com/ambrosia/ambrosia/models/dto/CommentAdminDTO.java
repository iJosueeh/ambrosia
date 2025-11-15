package com.ambrosia.ambrosia.models.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommentAdminDTO {
    private Long id;
    private String contenido;
    private String autorNombre;
    private Long foroId;
    private String foroTitulo;
    private LocalDateTime fechaCreacion;
    private String status;
}
