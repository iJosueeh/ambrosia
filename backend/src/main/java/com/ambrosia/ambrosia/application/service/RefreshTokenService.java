package com.ambrosia.ambrosia.application.service;

import com.ambrosia.ambrosia.domain.exception.BusinessException;
import com.ambrosia.ambrosia.domain.exception.ResourceNotFoundException;
import com.ambrosia.ambrosia.domain.model.RefreshToken;
import com.ambrosia.ambrosia.domain.model.Usuario;
import com.ambrosia.ambrosia.domain.repository.RefreshTokenRepositoryPort;
import com.ambrosia.ambrosia.domain.repository.UsuarioRepositoryPort;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Servicio para gestionar refresh tokens.
 * Permite generar, validar y revocar tokens de renovación.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class RefreshTokenService {

    private final RefreshTokenRepositoryPort refreshTokenRepository;
    private final UsuarioRepositoryPort usuarioRepository;

    @Value("${jwt.refresh.expiration.ms:604800000}") // 7 días por defecto
    private long refreshTokenDurationMs;

    /**
     * Crea un nuevo refresh token para un usuario.
     * Revoca cualquier refresh token anterior del usuario.
     */
    @Transactional
    public RefreshToken createRefreshToken(UUID usuarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", usuarioId));

        // Revocar tokens anteriores del usuario
        refreshTokenRepository.findByUsuarioAndRevokedFalse(usuario)
                .ifPresent(existingToken -> {
                    existingToken.setRevoked(true);
                    existingToken.setRevokedAt(LocalDateTime.now());
                    refreshTokenRepository.save(existingToken);
                    log.debug("Refresh token anterior revocado para usuario: {}", usuario.getEmail());
                });

        // Crear nuevo refresh token
        RefreshToken refreshToken = RefreshToken.builder()
                .token(UUID.randomUUID().toString())
                .usuario(usuario)
                .expiryDate(LocalDateTime.now().plusSeconds(refreshTokenDurationMs / 1000))
                .createdAt(LocalDateTime.now())
                .revoked(false)
                .build();

        RefreshToken savedToken = refreshTokenRepository.save(refreshToken);
        log.info("Nuevo refresh token creado para usuario: {}", usuario.getEmail());

        return savedToken;
    }

    /**
     * Verifica y valida un refresh token.
     * Lanza excepción si el token no existe, está expirado o revocado.
     */
    public RefreshToken verifyExpiration(RefreshToken token) {
        if (token.isExpired()) {
            refreshTokenRepository.deleteByUsuario(token.getUsuario());
            log.warn("Refresh token expirado eliminado para usuario: {}", token.getUsuario().getEmail());
            throw new BusinessException("El refresh token ha expirado. Por favor, inicia sesión nuevamente");
        }

        if (token.isRevoked()) {
            log.warn("Intento de uso de refresh token revocado para usuario: {}", token.getUsuario().getEmail());
            throw new BusinessException("El refresh token ha sido revocado. Por favor, inicia sesión nuevamente");
        }

        return token;
    }

    /**
     * Encuentra un refresh token por su valor.
     */
    public RefreshToken findByToken(String token) {
        return refreshTokenRepository.findByToken(token)
                .orElseThrow(() -> new ResourceNotFoundException("Refresh token no encontrado"));
    }

    /**
     * Revoca un refresh token específico.
     */
    @Transactional
    public void revokeToken(String token) {
        RefreshToken refreshToken = findByToken(token);
        refreshToken.setRevoked(true);
        refreshToken.setRevokedAt(LocalDateTime.now());
        refreshTokenRepository.save(refreshToken);
        log.info("Refresh token revocado para usuario: {}", refreshToken.getUsuario().getEmail());
    }

    /**
     * Revoca todos los refresh tokens de un usuario.
     */
    @Transactional
    public void revokeAllUserTokens(UUID usuarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", usuarioId));

        refreshTokenRepository.deleteByUsuario(usuario);
        log.info("Todos los refresh tokens revocados para usuario: {}", usuario.getEmail());
    }

    /**
     * Limpia tokens expirados de la base de datos.
     * Debe ejecutarse periódicamente (ej: cron job).
     */
    @Transactional
    public void deleteExpiredTokens() {
        refreshTokenRepository.deleteByExpiryDateBefore(LocalDateTime.now());
        log.info("Refresh tokens expirados eliminados");
    }
}
