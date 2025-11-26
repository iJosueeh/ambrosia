package com.ambrosia.ambrosia.domain.repository;

import com.ambrosia.ambrosia.domain.model.Rol;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface RolRepositoryPort {
    Rol save(Rol rol);
    Optional<Rol> findById(UUID id);
    void delete(Rol rol);
    List<Rol> findAll();
    Optional<Rol> findByNombre(String nombre);
}
