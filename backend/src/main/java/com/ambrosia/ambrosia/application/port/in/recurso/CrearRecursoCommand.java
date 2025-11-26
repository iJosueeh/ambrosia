package com.ambrosia.ambrosia.application.port.in.recurso;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Value;

import java.util.UUID;

@Value
public class CrearRecursoCommand {
    @NotBlank(message = "El título es obligatorio")
    @Size(min = 3, max = 200, message = "El título debe tener entre 3 y 200 caracteres")
    String titulo;

    @NotBlank(message = "La descripción es obligatoria")
    @Size(min = 10, max = 1000, message = "La descripción debe tener entre 10 y 1000 caracteres")
    String descripcion;

    @NotBlank(message = "El enlace es obligatorio")
    String enlace;

    String urlimg;
    String contenido;
    String size;

    @NotBlank(message = "La categoría es obligatoria")
    String nombreCategoria;

    @NotNull(message = "El ID del profesional es obligatorio")
    UUID profesionalId;
}
