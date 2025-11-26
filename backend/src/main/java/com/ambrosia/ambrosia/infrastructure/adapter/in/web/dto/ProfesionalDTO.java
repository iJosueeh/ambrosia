package com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProfesionalDTO {
    private UUID id;
    private String especialidad;
    private String descripcion;
    private String telefono;
    private String ubicacion;
    private List<String> habilidades;
    private UUID usuarioId;
    private String nombreUsuario;
    private String emailUsuario;
    private String profileImageUrl;
}
