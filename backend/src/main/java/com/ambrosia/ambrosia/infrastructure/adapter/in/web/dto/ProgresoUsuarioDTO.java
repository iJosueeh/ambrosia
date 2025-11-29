package com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProgresoUsuarioDTO {
    private int articulosLeidos;
    private int totalArticulosRecomendados;
    private int porcentaje;
    private List<UUID> recursosLeidosIds; // IDs de recursos que el usuario ha leído
}
