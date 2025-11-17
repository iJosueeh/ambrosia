package com.ambrosia.ambrosia.repository;

import com.ambrosia.ambrosia.models.Profesional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProfesionalRepository extends JpaRepository<Profesional, Long> {
    Optional<Profesional> findByUsuarioId(Long usuarioId);
}
