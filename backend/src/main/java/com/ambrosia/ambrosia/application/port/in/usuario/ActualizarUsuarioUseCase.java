package com.ambrosia.ambrosia.application.port.in.usuario;

import com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto.UsuarioDTO;

import java.util.UUID;

public interface ActualizarUsuarioUseCase {
    UsuarioDTO actualizar(UUID id, ActualizarUsuarioCommand command);
}
