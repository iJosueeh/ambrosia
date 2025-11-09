package com.ambrosia.ambrosia.models.dto;
import lombok.Builder;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UsuarioDTO {
   private Long id; // Nuevo campo: ID del usuario
   private String nombre;
   private String correo;
   private String password;
   private String rol;
   private LocalDate fechaRegistro; // Nuevo campo: Fecha de registro (solo la fecha)
}
