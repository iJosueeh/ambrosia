package com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecursoDTO {
    private UUID id;
    private String titulo;
    private String descripcion;
    private String enlace;
    private String urlimg;
    private String contenido;
    private String size;
    private Long downloads;
    private String slug;
    private LocalDateTime fechaPublicacion;
    private String nombreCategoria;
    private CategoriaRecursoDTO categoria;
    private String estado;
    private UUID creadorId;
    private String nombreCreador;
}