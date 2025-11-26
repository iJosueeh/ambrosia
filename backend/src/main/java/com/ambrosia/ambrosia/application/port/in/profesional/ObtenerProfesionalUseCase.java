package com.ambrosia.ambrosia.application.port.in.profesional;

import com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto.ProfesionalDTO;

import java.util.UUID;

public interface ObtenerProfesionalUseCase {
    ProfesionalDTO obtenerPorId(UUID id);

    ProfesionalDTO obtenerPorUsuarioId(UUID usuarioId);
}
