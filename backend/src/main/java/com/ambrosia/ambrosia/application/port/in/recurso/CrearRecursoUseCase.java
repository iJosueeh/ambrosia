package com.ambrosia.ambrosia.application.port.in.recurso;

import com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto.RecursoDTO;

public interface CrearRecursoUseCase {
    RecursoDTO crear(CrearRecursoCommand command);
}
