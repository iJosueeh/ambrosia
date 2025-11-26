package com.ambrosia.ambrosia.infrastructure.adapter.out.persistence;

import com.ambrosia.ambrosia.domain.model.Profesional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID; // Importar UUID

@Repository
public interface SpringDataProfesionalRepository extends JpaRepository<Profesional, UUID> {
    Optional<Profesional> findByUsuarioId(UUID usuarioId);
}
