package com.ambrosia.ambrosia.domain.repository;

import com.ambrosia.ambrosia.domain.model.RefreshToken;
import com.ambrosia.ambrosia.domain.model.Usuario;

import java.util.Optional;
import java.util.UUID;

/**
 * Puerto de salida para operaciones de RefreshToken.
 */
public interface RefreshTokenRepositoryPort {

    RefreshToken save(RefreshToken refreshToken);

    Optional<RefreshToken> findByToken(String token);

    Optional<RefreshToken> findByUsuarioAndRevokedFalse(Usuario usuario);

    void deleteByUsuario(Usuario usuario);

    void deleteByExpiryDateBefore(java.time.LocalDateTime date);
}
