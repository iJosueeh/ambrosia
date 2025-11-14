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
public class ResourceAdminDTO {
    private Long id;
    private String titulo;
    private String categoriaNombre;
    private String estadoNombre;
    private LocalDateTime fechaPublicacion;
    private String creadorNombre; // or email
}
