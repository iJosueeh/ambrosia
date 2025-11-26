package com.ambrosia.ambrosia.application.port.in.foro;

import com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto.ForoDTO;

public interface CrearForoUseCase {
    ForoDTO crear(CrearForoCommand command);
}
