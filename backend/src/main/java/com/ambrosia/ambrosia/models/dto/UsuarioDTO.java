package com.ambrosia.ambrosia.models.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioDTO {
   private String nombre;
   private String correo;
   private String password;
   private String rol;
}