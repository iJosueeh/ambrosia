package com.ambrosia.ambrosia.infrastructure.adapter.out.persistence;

import com.ambrosia.ambrosia.domain.model.Guardado;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface SpringDataGuardadoRepository extends JpaRepository<Guardado, UUID> {

    Page<Guardado> findByUsuarioId(UUID usuarioId, Pageable pageable);

    Page<Guardado> findByUsuarioIdAndTipo(UUID usuarioId, Guardado.TipoContenido tipo, Pageable pageable);

    boolean existsByUsuarioIdAndTipoAndItemId(UUID usuarioId, Guardado.TipoContenido tipo, UUID itemId);

    Optional<Guardado> findByUsuarioIdAndTipoAndItemId(UUID usuarioId, Guardado.TipoContenido tipo, UUID itemId);

    void deleteByUsuarioIdAndTipoAndItemId(UUID usuarioId, Guardado.TipoContenido tipo, UUID itemId);
}
