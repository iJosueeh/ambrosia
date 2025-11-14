package com.ambrosia.ambrosia.models.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminProfileDTO {
    private Long id;
    private String nombre;
    private String email;
    private Integer nivelAcceso;
}
