package com.ambrosia.ambrosia.application.port.in.recurso;

import com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto.RecursoDTO;

import java.util.UUID;

public interface ObtenerRecursoUseCase {
    RecursoDTO obtenerPorId(UUID id);
}
