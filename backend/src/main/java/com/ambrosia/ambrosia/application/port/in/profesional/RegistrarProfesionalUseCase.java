package com.ambrosia.ambrosia.application.port.in.profesional;

import com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto.ProfesionalDTO;

public interface RegistrarProfesionalUseCase {
    ProfesionalDTO registrar(RegistrarProfesionalCommand command);
}
