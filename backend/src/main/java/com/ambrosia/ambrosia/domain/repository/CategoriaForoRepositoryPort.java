package com.ambrosia.ambrosia.domain.repository;

import com.ambrosia.ambrosia.domain.model.CategoriaForo;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CategoriaForoRepositoryPort {
    CategoriaForo save(CategoriaForo categoriaForo);

    Optional<CategoriaForo> findById(UUID id);

    void delete(CategoriaForo categoriaForo);

    List<CategoriaForo> findAll();
}