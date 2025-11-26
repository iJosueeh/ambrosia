package com.ambrosia.ambrosia.infrastructure.adapter.out.security;

import com.ambrosia.ambrosia.application.port.out.TokenGeneratorPort;
import com.ambrosia.ambrosia.domain.model.Usuario;
import com.ambrosia.ambrosia.infrastructure.util.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.util.ArrayList;

@Component
@RequiredArgsConstructor
public class JwtTokenGeneratorAdapter implements TokenGeneratorPort {

    private final JwtUtil jwtUtil;

    @Override
    public String generarToken(Usuario usuario) {
        // Crear UserDetails temporal para generar el token
        UserDetails userDetails = User.builder()
                .username(usuario.getEmail())
                .password(usuario.getPassword())
                .authorities(new ArrayList<>())
                .build();
        return jwtUtil.generateToken(userDetails);
    }

    @Override
    public String extraerEmail(String token) {
        return jwtUtil.extractUsername(token);
    }

    @Override
    public boolean validarToken(String token) {
        try {
            String email = jwtUtil.extractUsername(token);
            // Verificar que el token tenga un email válido y no esté expirado
            // Como isTokenExpired es privado, usamos extractExpiration
            return email != null && jwtUtil.extractExpiration(token).after(new java.util.Date());
        } catch (Exception e) {
            return false;
        }
    }
}
