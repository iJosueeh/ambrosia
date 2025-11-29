package com.ambrosia.ambrosia.domain.repository;

import com.ambrosia.ambrosia.domain.model.RecursoEducativo;
import com.ambrosia.ambrosia.domain.model.RecursoLeido;
import com.ambrosia.ambrosia.domain.model.Usuario;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface RecursoLeidoRepositoryPort {
    RecursoLeido save(RecursoLeido recursoLeido);

    Optional<RecursoLeido> findByUsuarioAndRecurso(Usuario usuario, RecursoEducativo recurso);

    List<RecursoLeido> findByUsuario(Usuario usuario);

    long countByUsuario(Usuario usuario);

    boolean existsByUsuarioAndRecurso(Usuario usuario, RecursoEducativo recurso);

    List<UUID> findRecursoIdsByUsuario(Usuario usuario);
}
