package com.ambrosia.ambrosia.application.port.in.foro;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Value;

import java.util.UUID;

@Value
public class CrearForoCommand {
    @NotBlank(message = "El título es obligatorio")
    @Size(min = 5, max = 200, message = "El título debe tener entre 5 y 200 caracteres")
    String titulo;

    @NotBlank(message = "La descripción es obligatoria")
    @Size(min = 10, max = 2000, message = "La descripción debe tener entre 10 y 2000 caracteres")
    String descripcion;

    @NotNull(message = "El ID del autor es obligatorio")
    UUID autorId;

    @NotNull(message = "El ID de la categoría es obligatorio")
    UUID categoriaForoId;
}
