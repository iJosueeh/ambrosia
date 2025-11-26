package com.ambrosia.ambrosia.domain.repository;

import com.ambrosia.ambrosia.domain.model.Profesional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProfesionalRepositoryPort {
    Profesional save(Profesional profesional);

    Optional<Profesional> findById(UUID id);

    void delete(Profesional profesional);

    void deleteById(UUID id);

    List<Profesional> findAll();

    Optional<Profesional> findByUsuarioId(UUID usuarioId);
}