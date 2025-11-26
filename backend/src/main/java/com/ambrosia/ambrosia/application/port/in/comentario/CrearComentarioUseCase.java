package com.ambrosia.ambrosia.application.port.in.comentario;

import com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto.ComentarioDTO;

public interface CrearComentarioUseCase {
    ComentarioDTO crear(CrearComentarioCommand command);
}
