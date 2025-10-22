package com.ambrosia.ambrosia.models.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PreguntaDTO {
    private Long id;
    private String texto;
    private List<OpcionDTO> opciones;
}