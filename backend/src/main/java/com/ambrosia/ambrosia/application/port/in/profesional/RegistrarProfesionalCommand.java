package com.ambrosia.ambrosia.application.port.in.profesional;

import lombok.Value;

import java.util.UUID;

@Value
public class RegistrarProfesionalCommand {
    UUID usuarioId;
    String especialidad;
    String licencia;
    String biografia;
}
