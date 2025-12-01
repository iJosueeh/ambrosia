package com.ambrosia.ambrosia.infrastructure.adapter.out.persistence;

import com.ambrosia.ambrosia.domain.model.ComentarioLike;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface SpringDataComentarioLikeRepository extends JpaRepository<ComentarioLike, UUID> {

    boolean existsByComentarioIdAndUsuarioId(UUID comentarioId, UUID usuarioId);
    Optional<ComentarioLike> findByComentarioIdAndUsuarioId(UUID comentarioId, UUID usuarioId);
    long countByComentarioId(UUID comentarioId);
    @Modifying
    void deleteByComentarioIdAndUsuarioId(UUID comentarioId, UUID usuarioId);
}
