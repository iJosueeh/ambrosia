package com.ambrosia.ambrosia.models.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MaterialDTO {
    private Long id;
    private String titulo;
    private String contenidoHtml;
    private String tipo;
    private LocalDateTime fechaCreacion;
    private Long profesionalId;
    private String nombreProfesional; // Para mostrar en el frontend
}
