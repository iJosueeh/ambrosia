package com.ambrosia.ambrosia.domain.repository;

import com.ambrosia.ambrosia.domain.model.ResultadoTest;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ResultadoTestRepositoryPort {
    ResultadoTest save(ResultadoTest resultadoTest);
    Optional<ResultadoTest> findById(UUID id);
    void delete(ResultadoTest resultadoTest);
    List<ResultadoTest> findAll();
}
