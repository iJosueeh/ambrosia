package com.ambrosia.ambrosia.domain.repository;

import com.ambrosia.ambrosia.domain.model.TestEvaluacion;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TestEvaluacionRepositoryPort {
    TestEvaluacion save(TestEvaluacion testEvaluacion);

    Optional<TestEvaluacion> findById(UUID id);

    void delete(TestEvaluacion testEvaluacion);

    List<TestEvaluacion> findAll();

    long count();
}
