package com.ambrosia.ambrosia.models.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponseDTO {
    private Long id;
    private String nombre;
    private String correo;
    private List<String> roles;      // ✅ Lista de todos los roles
    private String rolPrincipal;      // ✅ Rol principal (ADMIN o USER)
    private String token;
}