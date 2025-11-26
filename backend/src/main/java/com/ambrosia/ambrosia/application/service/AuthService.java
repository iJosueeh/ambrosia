package com.ambrosia.ambrosia.application.service;

import com.ambrosia.ambrosia.application.port.in.auth.AutenticarUsuarioCommand;
import com.ambrosia.ambrosia.application.port.in.auth.AutenticarUsuarioUseCase;
import com.ambrosia.ambrosia.domain.model.Usuario;
import com.ambrosia.ambrosia.domain.repository.UsuarioRepositoryPort;
import com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto.LoginResponseDTO;
import com.ambrosia.ambrosia.infrastructure.util.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthService implements AutenticarUsuarioUseCase {

    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    private final AuthenticationManager authenticationManager;
    private final UsuarioRepositoryPort usuarioRepository;
    private final JwtUtil jwtUtil;
    private final RefreshTokenService refreshTokenService;

    @Override
    public LoginResponseDTO autenticar(AutenticarUsuarioCommand command) {
        logger.info("Autenticando usuario: {}", command.getCorreo());

        // 1. Autenticar credenciales
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(command.getCorreo(), command.getContrasena()));

        SecurityContextHolder.getContext().setAuthentication(authentication);

        // 2. Obtener el Principal (que es de tipo Spring UserDetails)
        UserDetails principal = (UserDetails) authentication.getPrincipal();
        String email = principal.getUsername();

        // 3. Buscar la entidad completa de Usuario
        Usuario authenticatedUser = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException(
                        "Usuario no encontrado en la base de datos después de la autenticación."));

        // 4. Generar el access token
        String accessToken = jwtUtil.generateToken(principal);

        // 5. Generar el refresh token
        String refreshToken = refreshTokenService.createRefreshToken(authenticatedUser.getId()).getToken();

        // 6. Obtener todos los roles
        List<String> roles = principal.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        // 7. Determinar el rol principal (priorizar ADMIN, luego PROFESSIONAL)
        String rolPrincipal;
        if (roles.contains("ROLE_ADMIN")) {
            rolPrincipal = "ADMIN";
        } else if (roles.contains("ROLE_PROFESSIONAL")) {
            rolPrincipal = "PROFESSIONAL";
        } else {
            rolPrincipal = "USER";
        }

        logger.info("Usuario autenticado exitosamente: {}", email);

        // 8. Construir la respuesta DTO con refresh token
        return LoginResponseDTO.builder()
                .id(authenticatedUser.getId())
                .nombre(authenticatedUser.getNombre())
                .correo(authenticatedUser.getEmail())
                .roles(roles)
                .rol(rolPrincipal)
                .token(accessToken)
                .refreshToken(refreshToken)
                .build();
    }
}
