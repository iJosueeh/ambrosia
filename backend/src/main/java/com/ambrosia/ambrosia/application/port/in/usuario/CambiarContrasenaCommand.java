package com.ambrosia.ambrosia.application.port.in.usuario;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Value;

@Value
public class CambiarContrasenaCommand {

    @NotBlank(message = "La contraseña actual es obligatoria")
    String contrasenaActual;

    @NotBlank(message = "La nueva contraseña es obligatoria")
    @Size(min = 8, max = 100, message = "La nueva contraseña debe tener entre 8 y 100 caracteres")
    String contrasenaNueva;

    @NotBlank(message = "Debe confirmar la nueva contraseña")
    String confirmarContrasena;
}
