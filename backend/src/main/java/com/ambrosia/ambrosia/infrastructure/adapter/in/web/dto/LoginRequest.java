package com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto;

import lombok.Data;

@Data
public class LoginRequest {
    private String correo;
    private String contrasena;
}
