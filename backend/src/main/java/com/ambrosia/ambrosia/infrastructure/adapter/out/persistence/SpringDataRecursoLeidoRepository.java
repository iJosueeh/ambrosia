package com.ambrosia.ambrosia.infrastructure.adapter.out.persistence;

import com.ambrosia.ambrosia.domain.model.RecursoEducativo;
import com.ambrosia.ambrosia.domain.model.RecursoLeido;
import com.ambrosia.ambrosia.domain.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface SpringDataRecursoLeidoRepository extends JpaRepository<RecursoLeido, UUID> {
    Optional<RecursoLeido> findByUsuarioAndRecurso(Usuario usuario, RecursoEducativo recurso);

    List<RecursoLeido> findByUsuario(Usuario usuario);

    long countByUsuario(Usuario usuario);

    boolean existsByUsuarioAndRecurso(Usuario usuario, RecursoEducativo recurso);

    @Query("SELECT rl.recurso.id FROM RecursoLeido rl WHERE rl.usuario = :usuario")
    List<UUID> findRecursoIdsByUsuario(@Param("usuario") Usuario usuario);
}
