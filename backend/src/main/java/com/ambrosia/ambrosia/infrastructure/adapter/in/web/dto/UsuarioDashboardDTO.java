package com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioDashboardDTO {
    private String nombre;
    private String correo;
    private String telefono;
    private LocalDate fechaRegistro;
    private long diasActivo;
    private int articulosLeidos;
    private int testsCompletados;
    private int recursosDescargados;
    private List<ProgressItemDTO> progreso;
    private List<ActividadDTO> actividadReciente;
    private List<RecomendacionDTO> recomendaciones;
}