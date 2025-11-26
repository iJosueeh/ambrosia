package com.ambrosia.ambrosia.infrastructure.adapter.out.persistence;

import com.ambrosia.ambrosia.domain.model.CategoriaRecurso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID; // Importar UUID

@Repository
public interface SpringDataCategoriaRecursoRepository extends JpaRepository<CategoriaRecurso, UUID> {
    Optional<CategoriaRecurso> findByNombre(String nombre);
}
