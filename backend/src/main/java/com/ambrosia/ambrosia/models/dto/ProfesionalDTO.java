package com.ambrosia.ambrosia.models.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProfesionalDTO {
    private Long id;
    private String especialidad;
    private String descripcion;
    private String telefono;
    private String ubicacion;
    private List<String> habilidades;
    private Long usuarioId;
    private String nombreUsuario;
    private String emailUsuario;
    private String profileImageUrl;
}
