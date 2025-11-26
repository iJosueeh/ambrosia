package com.ambrosia.ambrosia.infrastructure.adapter.out.persistence;

import com.ambrosia.ambrosia.domain.model.CategoriaForo;
import com.ambrosia.ambrosia.domain.repository.CategoriaForoRepositoryPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class CategoriaForoRepositoryAdapter implements CategoriaForoRepositoryPort {

    private final SpringDataCategoriaForoRepository springDataCategoriaForoRepository;

    @Override
    public CategoriaForo save(CategoriaForo categoriaForo) {
        return springDataCategoriaForoRepository.save(categoriaForo);
    }

    @Override
    public Optional<CategoriaForo> findById(UUID id) {
        return springDataCategoriaForoRepository.findById(id);
    }

    @Override
    public void delete(CategoriaForo categoriaForo) {
        springDataCategoriaForoRepository.delete(categoriaForo);
    }

    @Override
    public List<CategoriaForo> findAll() {
        return springDataCategoriaForoRepository.findAll();
    }
}
