package com.ambrosia.ambrosia.models.dto;

public record UsuarioDTO(
   String nombre,
   String correo,
   String password,
   String rol
) {}
