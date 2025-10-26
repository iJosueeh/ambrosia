package com.ambrosia.ambrosia.models.dto;

import com.ambrosia.ambrosia.models.TipoActividad;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ActividadDTO {
    private TipoActividad tipoActividad;
    private String descripcion;
    private LocalDateTime fecha;
}
