package com.ambrosia.ambrosia.domain.repository;

import com.ambrosia.ambrosia.domain.model.Foro;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ForoRepositoryPort {
    Foro save(Foro foro);

    Optional<Foro> findById(UUID id);

    void delete(Foro foro);

    List<Foro> findAll();

    Page<Foro> findAll(Specification<Foro> spec, Pageable pageable);

    List<Foro> findByCategoriaForoId(UUID categoriaForoId);

    List<Foro> findByAutorId(UUID autorId);

    long count();
}