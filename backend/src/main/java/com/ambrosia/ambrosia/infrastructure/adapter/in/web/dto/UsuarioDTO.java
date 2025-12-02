package com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto;

import lombok.Builder;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UsuarioDTO {
   private UUID id;
   private String nombre;
   private String correo;
   private String telefono;
   private String password;
   private String rol;
   private LocalDate fechaRegistro;
}
