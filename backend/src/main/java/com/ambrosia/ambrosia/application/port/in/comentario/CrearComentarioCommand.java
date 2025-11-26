package com.ambrosia.ambrosia.application.port.in.comentario;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Value;

import java.util.UUID;

@Value
public class CrearComentarioCommand {
    @NotBlank(message = "El contenido es obligatorio")
    @Size(min = 1, max = 1000, message = "El contenido debe tener entre 1 y 1000 caracteres")
    String contenido;

    @NotNull(message = "El ID del autor es obligatorio")
    UUID autorId;

    @NotNull(message = "El ID del foro es obligatorio")
    UUID foroId;
}
