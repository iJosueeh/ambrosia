package com.ambrosia.ambrosia.models.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ForumAdminDTO {
    private Long id;
    private String titulo;
    private String autorNombre;
    private String categoriaForoNombre;
    private LocalDateTime fechaCreacion;
    private String status;
    private int commentCount;
}
