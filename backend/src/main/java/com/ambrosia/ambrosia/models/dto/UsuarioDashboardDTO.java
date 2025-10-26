package com.ambrosia.ambrosia.models.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;
import com.ambrosia.ambrosia.models.dto.ActividadDTO;
import com.ambrosia.ambrosia.models.dto.RecomendacionDTO;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioDashboardDTO {
    private String nombre;
    private String correo;
    private LocalDate fechaRegistro;
    private long diasActivo;
    private int articulosLeidos;
    private int testsCompletados;
    private int recursosDescargados;
    private List<ProgressItemDTO> progreso;
    private List<ActividadDTO> actividadReciente;
    private List<RecomendacionDTO> recomendaciones;
}
