package com.ambrosia.ambrosia.application.port.in.usuario;

import com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto.UsuarioDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ListarUsuariosUseCase {
    Page<UsuarioDTO> listar(Pageable pageable, String search, String role);
}
