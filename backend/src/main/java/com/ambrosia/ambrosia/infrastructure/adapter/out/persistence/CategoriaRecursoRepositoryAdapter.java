package com.ambrosia.ambrosia.infrastructure.adapter.out.persistence;

import com.ambrosia.ambrosia.domain.model.CategoriaRecurso;
import com.ambrosia.ambrosia.domain.repository.CategoriaRecursoRepositoryPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class CategoriaRecursoRepositoryAdapter implements CategoriaRecursoRepositoryPort {

    private final SpringDataCategoriaRecursoRepository springDataCategoriaRecursoRepository;

    @Override
    public CategoriaRecurso save(CategoriaRecurso categoriaRecurso) {
        return springDataCategoriaRecursoRepository.save(categoriaRecurso);
    }

    @Override
    public Optional<CategoriaRecurso> findById(UUID id) {
        return springDataCategoriaRecursoRepository.findById(id);
    }

    @Override
    public void delete(CategoriaRecurso categoriaRecurso) {
        springDataCategoriaRecursoRepository.delete(categoriaRecurso);
    }

    @Override
    public List<CategoriaRecurso> findAll() {
        return springDataCategoriaRecursoRepository.findAll();
    }

    @Override
    public Optional<CategoriaRecurso> findByNombre(String nombre) {
        return springDataCategoriaRecursoRepository.findByNombre(nombre);
    }
}