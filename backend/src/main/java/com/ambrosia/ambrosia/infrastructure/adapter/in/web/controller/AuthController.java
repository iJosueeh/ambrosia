package com.ambrosia.ambrosia.infrastructure.adapter.in.web.controller;

import com.ambrosia.ambrosia.application.port.in.auth.AutenticarUsuarioCommand;
import com.ambrosia.ambrosia.application.service.AuthService;
import com.ambrosia.ambrosia.application.service.RefreshTokenService;
import com.ambrosia.ambrosia.domain.model.RefreshToken;
import com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto.LoginRequest;
import com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto.LoginResponseDTO;
import com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto.RefreshTokenRequest;
import com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto.RefreshTokenResponse;
import com.ambrosia.ambrosia.infrastructure.util.security.JwtUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

/**
 * Controlador para autenticación y gestión de tokens.
 */
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final RefreshTokenService refreshTokenService;
    private final com.ambrosia.ambrosia.application.service.UsuarioService usuarioService;
    private final JwtUtil jwtUtil;

    @Value("${jwt.expiration.ms}")
    private long jwtExpirationMs;

    /**
     * Endpoint de login - Autentica usuario y retorna access + refresh tokens.
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        AutenticarUsuarioCommand command = new AutenticarUsuarioCommand(
                loginRequest.getCorreo(),
                loginRequest.getContrasena());

        LoginResponseDTO response = authService.autenticar(command);
        return ResponseEntity.ok(response);
    }

    /**
     * Endpoint para renovar access token usando refresh token.
     */
    @PostMapping("/refresh")
    public ResponseEntity<RefreshTokenResponse> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
        String requestRefreshToken = request.getRefreshToken();

        // Buscar y validar refresh token
        RefreshToken refreshToken = refreshTokenService.findByToken(requestRefreshToken);
        refreshTokenService.verifyExpiration(refreshToken);

        // Generar nuevo access token
        UserDetails userDetails = usuarioService.loadUserByUsername(refreshToken.getUsuario().getEmail());
        String newAccessToken = jwtUtil.generateToken(userDetails);

        // Retornar nuevo access token (el refresh token sigue siendo el mismo)
        RefreshTokenResponse response = RefreshTokenResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(requestRefreshToken)
                .tokenType("Bearer")
                .expiresIn(jwtExpirationMs / 1000) // convertir a segundos
                .build();

        return ResponseEntity.ok(response);
    }

    /**
     * Endpoint para logout - Revoca el refresh token del usuario.
     */
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@Valid @RequestBody RefreshTokenRequest request) {
        refreshTokenService.revokeToken(request.getRefreshToken());
        return ResponseEntity.noContent().build();
    }
}
