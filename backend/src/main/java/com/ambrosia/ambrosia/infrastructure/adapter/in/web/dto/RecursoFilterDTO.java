package com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

/**
 * DTO para encapsular los filtros de búsqueda de recursos educativos.
 * Todos los campos son opcionales para permitir combinaciones flexibles.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecursoFilterDTO {

    /**
     * Búsqueda por palabra clave en título y descripción
     */
    private String searchQuery;

    /**
     * Filtrar por categoría específica
     */
    private UUID categoriaId;

    /**
     * Filtrar por tipo de recurso (Artículo, Video, Podcast, etc.)
     */
    private String tipoRecurso;

    /**
     * Filtrar recursos publicados desde esta fecha
     */
    private LocalDate fechaDesde;

    /**
     * Filtrar recursos publicados hasta esta fecha
     */
    private LocalDate fechaHasta;

    /**
     * Campo por el cual ordenar: "fecha", "titulo", "downloads"
     * Por defecto: "fecha"
     */
    @Builder.Default
    private String ordenarPor = "fecha";

    /**
     * Dirección del ordenamiento: "ASC" o "DESC"
     * Por defecto: "DESC"
     */
    @Builder.Default
    private String direccion = "DESC";
}
