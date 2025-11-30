package com.ambrosia.ambrosia.infrastructure.adapter.out.persistence;

import com.ambrosia.ambrosia.domain.model.CategoriaForo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID; // Importar UUID

@Repository
public interface SpringDataCategoriaForoRepository extends JpaRepository<CategoriaForo, UUID> {
    java.util.Optional<CategoriaForo> findByNombre(String nombre);
}
