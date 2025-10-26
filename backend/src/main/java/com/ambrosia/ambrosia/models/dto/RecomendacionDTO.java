package com.ambrosia.ambrosia.models.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RecomendacionDTO {
    private String title;
    private String description;
    private String link;
    private String tipo; // e.g., "TEST", "ARTICULO", "RECURSO"
}
