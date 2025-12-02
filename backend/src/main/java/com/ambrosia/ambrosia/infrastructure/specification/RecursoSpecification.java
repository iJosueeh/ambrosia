package com.ambrosia.ambrosia.infrastructure.specification;

import com.ambrosia.ambrosia.domain.model.RecursoEducativo;
import com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto.RecursoFilterDTO;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Specification para construir queries dinámicas de búsqueda de recursos.
 * Implementa el patrón Specification de JPA para filtros flexibles y
 * combinables.
 */
public class RecursoSpecification {

    /**
     * Crea una Specification basada en los filtros proporcionados.
     * Todos los filtros son opcionales y se combinan con AND.
     */
    public static Specification<RecursoEducativo> withFilters(RecursoFilterDTO filters) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Filtro por búsqueda de texto (título o descripción)
            if (filters.getSearchQuery() != null && !filters.getSearchQuery().trim().isEmpty()) {
                String searchPattern = "%" + filters.getSearchQuery().toLowerCase() + "%";
                Predicate tituloMatch = criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("titulo")),
                        searchPattern);
                Predicate descripcionMatch = criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("descripcion")),
                        searchPattern);
                predicates.add(criteriaBuilder.or(tituloMatch, descripcionMatch));
            }

            // Filtro por categoría
            if (filters.getCategoriaId() != null) {
                predicates.add(criteriaBuilder.equal(
                        root.get("categoria").get("id"),
                        filters.getCategoriaId()));
            }

            // Filtro por tipo de recurso
            if (filters.getTipoRecurso() != null && !filters.getTipoRecurso().trim().isEmpty()) {
                // El campo "tipo" no existe en la entidad, se determina dinámicamente.
                // Por ahora, omitimos este filtro en la query o lo implementamos verificando el
                // enlace.
                // TODO: Implementar filtro por tipo basado en el enlace (Video, Podcast,
                // Artículo)
                String tipo = filters.getTipoRecurso().toLowerCase();
                if (tipo.equals("video")) {
                    Predicate youtube = criteriaBuilder.like(criteriaBuilder.lower(root.get("enlace")), "%youtube%");
                    Predicate video = criteriaBuilder.like(criteriaBuilder.lower(root.get("enlace")), "%video%");
                    predicates.add(criteriaBuilder.or(youtube, video));
                } else if (tipo.equals("podcast")) {
                    Predicate spotify = criteriaBuilder.like(criteriaBuilder.lower(root.get("enlace")), "%spotify%");
                    Predicate podcast = criteriaBuilder.like(criteriaBuilder.lower(root.get("enlace")), "%podcast%");
                    predicates.add(criteriaBuilder.or(spotify, podcast));
                } else if (tipo.equals("articulo")) {
                    // Articulo es cuando no es video ni podcast (aproximación)
                    // Esto es más complejo de filtrar por exclusión en criteria builder de forma
                    // sencilla sin afectar performance
                    // Por ahora lo dejamos sin filtrar o solo para video/podcast explícitos
                }
            }

            // Filtro por rango de fechas (desde)
            if (filters.getFechaDesde() != null) {
                LocalDateTime fechaDesdeTime = filters.getFechaDesde().atStartOfDay();
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(
                        root.get("fechaPublicacion"),
                        fechaDesdeTime));
            }

            // Filtro por rango de fechas (hasta)
            if (filters.getFechaHasta() != null) {
                LocalDateTime fechaHastaTime = filters.getFechaHasta().atTime(23, 59, 59);
                predicates.add(criteriaBuilder.lessThanOrEqualTo(
                        root.get("fechaPublicacion"),
                        fechaHastaTime));
            }

            // Solo recursos publicados (estado = "PUBLISHED")
            predicates.add(criteriaBuilder.equal(
                    criteriaBuilder.upper(root.get("estado").get("nombre")),
                    "PUBLISHED"));

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
