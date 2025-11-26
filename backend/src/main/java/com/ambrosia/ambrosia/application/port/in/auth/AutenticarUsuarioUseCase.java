package com.ambrosia.ambrosia.application.port.in.auth;

import com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto.LoginResponseDTO;

public interface AutenticarUsuarioUseCase {
    LoginResponseDTO autenticar(AutenticarUsuarioCommand command);
}
