package com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

/**
 * DTO para la respuesta del endpoint /auth/me
 * Retorna información del usuario autenticado actual
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CurrentUserDTO {
    private UUID id;
    private String nombre;
    private String correo;
    private List<String> roles;
    private String rol; // Rol principal
    private UUID profesionalId; // Opcional, solo si el usuario es profesional
}
