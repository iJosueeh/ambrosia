package com.ambrosia.ambrosia.models.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResourceUpdateDTO {
    private String titulo;
    private String descripcion;
    private String enlace;
    private String urlimg;
    private String contenido;
    private Long categoriaId;
    private Long estadoId;
    // We might need creatorId and approverId as well, but let's keep it simple for now
    // and assume the logged-in admin is the approver.
}
