package com.ambrosia.ambrosia.infrastructure.adapter.in.web.controller;

import com.ambrosia.ambrosia.application.port.in.auth.AutenticarUsuarioCommand;
import com.ambrosia.ambrosia.application.service.AuthService;
import com.ambrosia.ambrosia.application.service.RefreshTokenService;
import com.ambrosia.ambrosia.domain.model.RefreshToken;
import com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto.LoginRequest;
import com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto.LoginResponseDTO;
import com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto.RefreshTokenRequest;
import com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto.RefreshTokenResponse;
import com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto.CurrentUserDTO;
import com.ambrosia.ambrosia.infrastructure.util.security.CookieUtil;
import com.ambrosia.ambrosia.infrastructure.util.security.JwtUtil;
import com.ambrosia.ambrosia.application.service.MyUserDetails;
import com.ambrosia.ambrosia.domain.model.Usuario;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
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
    private final CookieUtil cookieUtil;

    @Value("${jwt.expiration.ms}")
    private long jwtExpirationMs;

    /**
     * Endpoint de login - Autentica usuario y retorna datos del usuario.
     * Los tokens se envían como cookies HttpOnly.
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> authenticateUser(
            @Valid @RequestBody LoginRequest loginRequest,
            HttpServletResponse response) {

        AutenticarUsuarioCommand command = new AutenticarUsuarioCommand(
                loginRequest.getCorreo(),
                loginRequest.getContrasena());

        LoginResponseDTO loginResponse = authService.autenticar(command);

        // Agregar tokens como cookies HttpOnly
        cookieUtil.addAuthCookies(response, loginResponse.getToken(), loginResponse.getRefreshToken());

        // Retornar solo datos del usuario (sin tokens en el body)
        return ResponseEntity.ok(loginResponse);
    }

    /**
     * Endpoint para renovar access token usando refresh token desde cookies.
     */
    @PostMapping("/refresh")
    public ResponseEntity<RefreshTokenResponse> refreshToken(
            HttpServletRequest request,
            HttpServletResponse response) {

        // Leer refresh token desde cookie
        String requestRefreshToken = cookieUtil.getRefreshToken(request)
                .orElseThrow(() -> new RuntimeException("Refresh token no encontrado en cookies"));

        // Buscar y validar refresh token
        RefreshToken refreshToken = refreshTokenService.findByToken(requestRefreshToken);
        refreshTokenService.verifyExpiration(refreshToken);

        // Generar nuevo access token
        UserDetails userDetails = usuarioService.loadUserByUsername(refreshToken.getUsuario().getEmail());
        String newAccessToken = jwtUtil.generateToken(userDetails);

        // Actualizar cookie de access token
        response.addCookie(cookieUtil.createAccessTokenCookie(newAccessToken));

        // Retornar respuesta (para compatibilidad, aunque el token está en la cookie)
        RefreshTokenResponse refreshResponse = RefreshTokenResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(requestRefreshToken)
                .tokenType("Bearer")
                .expiresIn(jwtExpirationMs / 1000)
                .build();

        return ResponseEntity.ok(refreshResponse);
    }

    /**
     * Endpoint para logout - Revoca el refresh token y elimina cookies.
     */
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(
            HttpServletRequest request,
            HttpServletResponse response) {

        // Leer refresh token desde cookie (si existe)
        cookieUtil.getRefreshToken(request).ifPresent(refreshToken -> {
            try {
                refreshTokenService.revokeToken(refreshToken);
            } catch (Exception e) {
                // Continuar con la eliminación de cookies aunque falle la revocación
            }
        });

        // Eliminar cookies de autenticación
        cookieUtil.deleteAuthCookies(response);

        return ResponseEntity.noContent().build();
    }

    /**
     * Endpoint para obtener información del usuario autenticado actual.
     * Lee el usuario desde el SecurityContext (establecido por
     * JwtAuthenticationFilter).
     */
    @GetMapping("/me")
    public ResponseEntity<CurrentUserDTO> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        // Obtener el usuario completo desde la base de datos
        Usuario usuario = usuarioService.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Obtener roles
        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(java.util.stream.Collectors.toList());

        // Determinar rol principal
        String rolPrincipal;
        if (roles.contains("ROLE_ADMIN")) {
            rolPrincipal = "ADMIN";
        } else if (roles.contains("ROLE_PROFESSIONAL")) {
            rolPrincipal = "PROFESSIONAL";
        } else {
            rolPrincipal = "USER";
        }

        // Obtener profesionalId si está disponible
        UUID profesionalId = null;
        if (userDetails instanceof MyUserDetails) {
            profesionalId = ((MyUserDetails) userDetails).getProfesionalId();
        }

        CurrentUserDTO currentUser = CurrentUserDTO.builder()
                .id(usuario.getId())
                .nombre(usuario.getNombre())
                .correo(usuario.getEmail())
                .roles(roles)
                .rol(rolPrincipal)
                .profesionalId(profesionalId)
                .build();

        return ResponseEntity.ok(currentUser);
    }
}