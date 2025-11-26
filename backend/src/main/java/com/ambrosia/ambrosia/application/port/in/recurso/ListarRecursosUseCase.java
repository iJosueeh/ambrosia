package com.ambrosia.ambrosia.application.port.in.recurso;

import com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto.RecursoDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface ListarRecursosUseCase {
    Page<RecursoDTO> listarTodos(Pageable pageable, String search);

    Page<RecursoDTO> listarPorCategoria(UUID categoriaId, Pageable pageable, String search);
}
