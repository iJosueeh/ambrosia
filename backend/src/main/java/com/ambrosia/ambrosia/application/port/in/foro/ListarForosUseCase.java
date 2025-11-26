package com.ambrosia.ambrosia.application.port.in.foro;

import com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto.ForoDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface ListarForosUseCase {
    Page<ForoDTO> listar(Pageable pageable, String search, UUID categoriaId);
}
