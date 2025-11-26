package com.ambrosia.ambrosia.application.port.in.usuario;

import com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto.UsuarioDTO;

public interface RegistrarUsuarioUseCase {
    UsuarioDTO registrar(RegistrarUsuarioCommand command);
}
