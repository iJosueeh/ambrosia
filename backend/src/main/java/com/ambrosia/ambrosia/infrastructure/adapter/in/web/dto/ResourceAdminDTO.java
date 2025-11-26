package com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResourceAdminDTO {
    private UUID id;
    private String titulo;
    private String categoriaNombre;
    private String estadoNombre;
    private LocalDateTime fechaPublicacion;
    private String creadorNombre;
}
