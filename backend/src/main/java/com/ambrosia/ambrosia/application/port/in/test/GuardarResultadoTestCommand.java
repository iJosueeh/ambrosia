package com.ambrosia.ambrosia.application.port.in.test;

import lombok.Value;

import java.util.UUID;

@Value
public class GuardarResultadoTestCommand {
    UUID usuarioId;
    UUID testId;
    Integer puntajeTotal;
}
