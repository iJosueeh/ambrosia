package com.ambrosia.ambrosia.application.port.in.usuario;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Value;

@Value
public class ActualizarUsuarioCommand {
    @NotBlank(message = "El nombre es obligatorio")
    @Size(min = 2, max = 100, message = "El nombre debe tener entre 2 y 100 caracteres")
    String nombre;

    @NotBlank(message = "El email es obligatorio")
    @Email(message = "El email debe ser válido")
    String email;

    @Size(max = 20, message = "El teléfono no puede tener más de 20 caracteres")
    String telefono; // Campo opcional

    @NotBlank(message = "El rol es obligatorio")
    String rol;
}
