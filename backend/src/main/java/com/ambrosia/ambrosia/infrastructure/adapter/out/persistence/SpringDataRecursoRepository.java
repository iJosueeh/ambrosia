package com.ambrosia.ambrosia.infrastructure.adapter.out.persistence;

import com.ambrosia.ambrosia.domain.model.RecursoEducativo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID; // Importar UUID

@Repository
public interface SpringDataRecursoRepository extends JpaRepository<RecursoEducativo, UUID>, JpaSpecificationExecutor<RecursoEducativo> {
    Page<RecursoEducativo> findByCategoriaId(UUID id, Pageable pageable); // Cambio a UUID
    Page<RecursoEducativo> findByTituloContainingIgnoreCaseOrDescripcionContainingIgnoreCase(String titulo, String descripcion, Pageable pageable);
    Page<RecursoEducativo> findByCategoriaIdAndTituloContainingIgnoreCaseOrCategoriaIdAndDescripcionContainingIgnoreCase(UUID categoriaId1, String titulo, UUID categoriaId2, String descripcion, Pageable pageable); // Cambio a UUID
    List<RecursoEducativo> findByCreadorId(UUID creadorId); // Cambio a UUID

    // New methods for filtering by estado.nombre
    Page<RecursoEducativo> findByEstadoNombre(String estadoNombre, Pageable pageable);
    Page<RecursoEducativo> findByEstadoNombreAndTituloContainingIgnoreCaseOrEstadoNombreAndDescripcionContainingIgnoreCase(String estadoNombre1, String titulo, String estadoNombre2, String descripcion, Pageable pageable);
    Page<RecursoEducativo> findByCategoriaIdAndEstadoNombre(UUID id, String estadoNombre, Pageable pageable); // Cambio a UUID
    Page<RecursoEducativo> findByCategoriaIdAndEstadoNombreAndTituloContainingIgnoreCaseOrCategoriaIdAndEstadoNombreAndDescripcionContainingIgnoreCase(UUID categoriaId1, String estadoNombre1, String titulo, UUID categoriaId2, String estadoNombre2, String descripcion, Pageable pageable); // Cambio a UUID
}