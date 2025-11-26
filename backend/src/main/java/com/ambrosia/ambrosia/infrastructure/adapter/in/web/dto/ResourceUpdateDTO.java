package com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResourceUpdateDTO {
    private String titulo;
    private String descripcion;
    private String enlace;
    private String urlimg;
    private String contenido;
    private UUID categoriaId;
    private UUID estadoId;
}
