package com.ambrosia.ambrosia.controllers;

import com.ambrosia.ambrosia.models.Usuario;
import com.ambrosia.ambrosia.models.dto.LoginRequest;
import com.ambrosia.ambrosia.models.dto.LoginResponseDTO;
import com.ambrosia.ambrosia.services.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UsuarioService usuarioService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> authenticateUser(@RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getCorreo(), loginRequest.getContrasena())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        Usuario authenticatedUser = (Usuario) authentication.getPrincipal();

        LoginResponseDTO responseDTO = new LoginResponseDTO(
                authenticatedUser.getId(),
                authenticatedUser.getNombre(),
                authenticatedUser.getEmail(),
                authenticatedUser.getRol().getNombre()
        );

        return ResponseEntity.ok(responseDTO);
    }
}