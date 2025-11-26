package com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID; // Importar UUID

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminProfileDTO {
    private UUID id; // Cambio a UUID
    private String nombre;
    private String email;
    private Integer nivelAcceso;
}
