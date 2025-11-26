package com.ambrosia.ambrosia.application.port.in.comentario;

import com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto.ComentarioDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface ListarComentariosUseCase {
    Page<ComentarioDTO> listarPorForo(UUID foroId, Pageable pageable);
}
