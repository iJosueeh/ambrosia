package com.ambrosia.ambrosia.domain.repository;

import com.ambrosia.ambrosia.domain.model.CategoriaRecurso;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CategoriaRecursoRepositoryPort {
    CategoriaRecurso save(CategoriaRecurso categoriaRecurso);
    Optional<CategoriaRecurso> findById(UUID id);
    void delete(CategoriaRecurso categoriaRecurso);
    List<CategoriaRecurso> findAll();
    Optional<CategoriaRecurso> findByNombre(String nombre);
}
