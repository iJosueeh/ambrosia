package com.ambrosia.ambrosia.repository;

import com.ambrosia.ambrosia.models.CategoriaRecurso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CategoriaRecursoRepository extends JpaRepository<CategoriaRecurso, Long> {
    Optional<CategoriaRecurso> findByNombre(String nombre);
}
