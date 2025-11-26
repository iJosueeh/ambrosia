package com.ambrosia.ambrosia.application.port.in.test;

import com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto.TestDTO;

import java.util.List;

public interface ListarTestsUseCase {
    List<TestDTO> listarTodos();
}
