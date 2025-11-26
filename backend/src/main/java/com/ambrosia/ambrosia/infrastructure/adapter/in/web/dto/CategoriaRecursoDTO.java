package com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID; // Importar UUID

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoriaRecursoDTO {
    private UUID id; // Cambio a UUID
    private String nombre;
    private String descripcion;
}
