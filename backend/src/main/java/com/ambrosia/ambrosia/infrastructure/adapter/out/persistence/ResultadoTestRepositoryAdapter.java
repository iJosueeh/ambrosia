package com.ambrosia.ambrosia.infrastructure.adapter.out.persistence;

import com.ambrosia.ambrosia.domain.model.ResultadoTest;
import com.ambrosia.ambrosia.domain.repository.ResultadoTestRepositoryPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class ResultadoTestRepositoryAdapter implements ResultadoTestRepositoryPort {

    private final SpringDataResultadoTestRepository springDataResultadoTestRepository;

    @Override
    public ResultadoTest save(ResultadoTest resultadoTest) {
        return springDataResultadoTestRepository.save(resultadoTest);
    }

    @Override
    public Optional<ResultadoTest> findById(UUID id) {
        return springDataResultadoTestRepository.findById(id);
    }

    @Override
    public void delete(ResultadoTest resultadoTest) {
        springDataResultadoTestRepository.delete(resultadoTest);
    }

    @Override
    public List<ResultadoTest> findAll() {
        return springDataResultadoTestRepository.findAll();
    }
}
