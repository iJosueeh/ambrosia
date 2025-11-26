package com.ambrosia.ambrosia.domain.repository;

import com.ambrosia.ambrosia.domain.model.Actividad;
import com.ambrosia.ambrosia.domain.model.Usuario;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ActividadRepositoryPort {
    Actividad save(Actividad actividad);

    Optional<Actividad> findById(UUID id);

    void delete(Actividad actividad);

    List<Actividad> findTop5ByUsuarioOrderByFechaDesc(Usuario usuario);

    List<Actividad> findAll();
}
