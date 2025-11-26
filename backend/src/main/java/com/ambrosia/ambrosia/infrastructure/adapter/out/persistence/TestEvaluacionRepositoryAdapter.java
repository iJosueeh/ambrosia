package com.ambrosia.ambrosia.infrastructure.adapter.out.persistence;

import com.ambrosia.ambrosia.domain.model.TestEvaluacion;
import com.ambrosia.ambrosia.domain.repository.TestEvaluacionRepositoryPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class TestEvaluacionRepositoryAdapter implements TestEvaluacionRepositoryPort {

    private final SpringDataTestEvaluacionRepository springDataTestEvaluacionRepository;

    @Override
    public TestEvaluacion save(TestEvaluacion testEvaluacion) {
        return springDataTestEvaluacionRepository.save(testEvaluacion);
    }

    @Override
    public Optional<TestEvaluacion> findById(UUID id) {
        return springDataTestEvaluacionRepository.findById(id);
    }

    @Override
    public void delete(TestEvaluacion testEvaluacion) {
        springDataTestEvaluacionRepository.delete(testEvaluacion);
    }

    @Override
    public List<TestEvaluacion> findAll() {
        return springDataTestEvaluacionRepository.findAll();
    }

    @Override
    public long count() {
        return springDataTestEvaluacionRepository.count();
    }
}
