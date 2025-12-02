package com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto;

import com.ambrosia.ambrosia.domain.model.Guardado;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CrearGuardadoRequest {
    @NotNull(message = "El tipo de contenido es obligatorio")
    private Guardado.TipoContenido tipo;

    @NotNull(message = "El ID del item es obligatorio")
    private UUID itemId;
}
