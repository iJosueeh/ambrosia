package com.ambrosia.ambrosia.application.port.in.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Value;

@Value
public class AutenticarUsuarioCommand {
    @NotBlank(message = "El correo es obligatorio")
    @Email(message = "El correo debe ser válido")
    String correo;

    @NotBlank(message = "La contraseña es obligatoria")
    String contrasena;
}
