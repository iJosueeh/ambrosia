package com.ambrosia.ambrosia.controllers;

import com.ambrosia.ambrosia.models.Usuario;
import com.ambrosia.ambrosia.models.dto.LoginRequest;
import com.ambrosia.ambrosia.models.dto.LoginResponseDTO;
import com.ambrosia.ambrosia.services.UsuarioService;
import com.ambrosia.ambrosia.utils.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UsuarioService usuarioService;
    private final JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> authenticateUser(@RequestBody LoginRequest loginRequest) {
        // 1. Autenticar credenciales
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getCorreo(), loginRequest.getContrasena())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        // 2. Obtener el Principal (que es de tipo Spring UserDetails)
        UserDetails principal = (UserDetails) authentication.getPrincipal();
        String email = principal.getUsername();

        // 3. Buscar la entidad completa de Usuario
        Usuario authenticatedUser = usuarioService.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado en la base de datos después de la autenticación."));

        // 4. Generar el token
        String token = jwtUtil.generateToken(authenticatedUser);

        // 5. ✅ OBTENER TODOS LOS ROLES (no solo uno)
        List<String> roles = principal.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        // 6. ✅ DETERMINAR EL ROL PRINCIPAL (priorizar ADMIN, luego PROFESSIONAL)
        String rolPrincipal;
        if (roles.contains("ROLE_ADMIN")) {
            rolPrincipal = "ADMIN";
        } else if (roles.contains("ROLE_PROFESSIONAL")) {
            rolPrincipal = "PROFESSIONAL";
        } else {
            rolPrincipal = "USER";
        }

        // 7. Construir la respuesta DTO
        LoginResponseDTO responseDTO = new LoginResponseDTO(
                authenticatedUser.getId(),
                authenticatedUser.getNombre(),
                authenticatedUser.getEmail(),
                roles,
                rolPrincipal,
                token
        );

        return ResponseEntity.ok(responseDTO);
    }
}