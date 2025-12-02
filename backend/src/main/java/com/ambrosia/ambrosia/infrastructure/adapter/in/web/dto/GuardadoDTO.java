package com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto;

import com.ambrosia.ambrosia.domain.model.Guardado;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GuardadoDTO {
    private UUID id;
    private Guardado.TipoContenido tipo;
    private UUID itemId;
    private LocalDateTime fechaGuardado;

    // Optional fields for UI display (populated by service if possible)
    private String titulo;
    private String descripcion;
    private String url;
}
