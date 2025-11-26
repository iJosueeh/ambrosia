package com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginResponseDTO {
    private UUID id;
    private String nombre;
    private String correo;
    private List<String> roles;
    private String rol; // Rol principal
    private String token; // Access token
    private String refreshToken; // Refresh token
}