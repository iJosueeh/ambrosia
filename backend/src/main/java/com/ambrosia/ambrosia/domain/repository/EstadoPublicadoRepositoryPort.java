package com.ambrosia.ambrosia.domain.repository;

import com.ambrosia.ambrosia.domain.model.EstadoPublicado;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface EstadoPublicadoRepositoryPort {
    EstadoPublicado save(EstadoPublicado estadoPublicado);
    Optional<EstadoPublicado> findById(UUID id);
    void delete(EstadoPublicado estadoPublicado);
    List<EstadoPublicado> findAll();
    Optional<EstadoPublicado> findByNombre(String nombre);
}
