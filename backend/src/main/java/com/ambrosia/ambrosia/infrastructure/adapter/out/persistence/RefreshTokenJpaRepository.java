package com.ambrosia.ambrosia.infrastructure.adapter.out.persistence;

import com.ambrosia.ambrosia.domain.model.RefreshToken;
import com.ambrosia.ambrosia.domain.model.Usuario;
import com.ambrosia.ambrosia.domain.repository.RefreshTokenRepositoryPort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

/**
 * Adaptador JPA para RefreshToken.
 */
@Repository
public interface RefreshTokenJpaRepository extends JpaRepository<RefreshToken, UUID>, RefreshTokenRepositoryPort {

    Optional<RefreshToken> findByToken(String token);

    Optional<RefreshToken> findByUsuarioAndRevokedFalse(Usuario usuario);

    void deleteByUsuario(Usuario usuario);

    void deleteByExpiryDateBefore(LocalDateTime date);
}
