package com.ambrosia.ambrosia.domain.repository;

import com.ambrosia.ambrosia.domain.model.RecursoEducativo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface RecursoRepositoryPort {
    RecursoEducativo save(RecursoEducativo recursoEducativo);

    Optional<RecursoEducativo> findById(UUID id);

    void delete(RecursoEducativo recursoEducativo);

    boolean existsById(UUID id);

    Page<RecursoEducativo> findByCategoriaId(UUID id, Pageable pageable);

    Page<RecursoEducativo> findByTituloContainingIgnoreCaseOrDescripcionContainingIgnoreCase(String titulo,
            String descripcion, Pageable pageable);

    Page<RecursoEducativo> findByCategoriaIdAndTituloContainingIgnoreCaseOrCategoriaIdAndDescripcionContainingIgnoreCase(
            UUID categoriaId1, String titulo, UUID categoriaId2, String descripcion, Pageable pageable);

    List<RecursoEducativo> findByCreadorId(UUID creadorId);

    Page<RecursoEducativo> findByEstadoNombre(String estadoNombre, Pageable pageable);

    Page<RecursoEducativo> findByEstadoNombreAndTituloContainingIgnoreCaseOrEstadoNombreAndDescripcionContainingIgnoreCase(
            String estadoNombre1, String titulo, String estadoNombre2, String descripcion, Pageable pageable);

    Page<RecursoEducativo> findByCategoriaIdAndEstadoNombre(UUID id, String estadoNombre, Pageable pageable);

    Page<RecursoEducativo> findByCategoriaIdAndEstadoNombreAndTituloContainingIgnoreCaseOrCategoriaIdAndEstadoNombreAndDescripcionContainingIgnoreCase(
            UUID categoriaId1, String estadoNombre1, String titulo, UUID categoriaId2, String estadoNombre2,
            String descripcion, Pageable pageable);

    Page<RecursoEducativo> findAll(Pageable pageable);

    Page<RecursoEducativo> findAll(Specification<RecursoEducativo> spec, Pageable pageable);

    long count();
}
