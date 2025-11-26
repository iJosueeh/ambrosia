package com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID; // Importar UUID

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PreguntaDTO {
    private UUID id; // Cambio a UUID
    private String texto;
    private List<OpcionDTO> opciones;
}