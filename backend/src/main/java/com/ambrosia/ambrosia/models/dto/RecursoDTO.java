package com.ambrosia.ambrosia.models.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecursoDTO {
    private Long id;
    private String titulo;
    private String descripcion;
    private String enlace;
    private String urlimg;
    private String contenido;
    private String size;
    private Long downloads;
    private LocalDateTime fechaPublicacion;
    private String nombreCategoria;
    private CategoriaRecursoDTO categoria;
    private String estado;
    private Long creadorId;
    private String nombreCreador;
}