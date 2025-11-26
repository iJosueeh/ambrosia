package com.ambrosia.ambrosia.application.service.admin;

import com.ambrosia.ambrosia.domain.model.CategoriaRecurso;
import com.ambrosia.ambrosia.domain.model.EstadoPublicado;
import com.ambrosia.ambrosia.domain.model.RecursoEducativo;
import com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto.ResourceAdminDTO;
import com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto.ResourceUpdateDTO;
import com.ambrosia.ambrosia.domain.repository.CategoriaRecursoRepositoryPort;
import com.ambrosia.ambrosia.domain.repository.EstadoPublicadoRepositoryPort;
import com.ambrosia.ambrosia.domain.repository.RecursoRepositoryPort;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AdminResourceService {

    private final RecursoRepositoryPort recursoRepository;
    private final CategoriaRecursoRepositoryPort categoriaRecursoRepository;
    private final EstadoPublicadoRepositoryPort estadoPublicadoRepository;

    public Page<ResourceAdminDTO> getAllResources(Pageable pageable, String searchTerm, UUID categoryId,
            UUID statusId) {
        Specification<RecursoEducativo> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (StringUtils.hasText(searchTerm)) {
                predicates.add(cb.like(cb.lower(root.get("titulo")), "%" + searchTerm.toLowerCase() + "%"));
            }
            if (categoryId != null) {
                predicates.add(cb.equal(root.get("categoria").get("id"), categoryId));
            }
            if (statusId != null) {
                predicates.add(cb.equal(root.get("estado").get("id"), statusId));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<RecursoEducativo> resourcesPage = recursoRepository.findAll(spec, pageable);
        return resourcesPage.map(this::mapToResourceAdminDTO);
    }

    public ResourceAdminDTO getResourceById(UUID id) {
        RecursoEducativo resource = recursoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resource not found with id: " + id));
        return mapToResourceAdminDTO(resource);
    }

    public RecursoEducativo createResource(ResourceUpdateDTO dto) {
        CategoriaRecurso categoria = categoriaRecursoRepository.findById(dto.getCategoriaId())
                .orElseThrow(() -> new RuntimeException("Category not found"));
        EstadoPublicado estado = estadoPublicadoRepository.findById(dto.getEstadoId())
                .orElseThrow(() -> new RuntimeException("Status not found"));

        RecursoEducativo resource = RecursoEducativo.builder()
                .titulo(dto.getTitulo())
                .descripcion(dto.getDescripcion())
                .enlace(dto.getEnlace())
                .urlimg(dto.getUrlimg())
                .contenido(dto.getContenido())
                .categoria(categoria)
                .estado(estado)
                .fechaPublicacion(LocalDateTime.now())
                .build();

        return recursoRepository.save(resource);
    }

    public RecursoEducativo updateResource(UUID id, ResourceUpdateDTO dto) {
        RecursoEducativo resource = recursoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resource not found with id: " + id));

        CategoriaRecurso categoria = categoriaRecursoRepository.findById(dto.getCategoriaId())
                .orElseThrow(() -> new RuntimeException("Category not found"));
        EstadoPublicado estado = estadoPublicadoRepository.findById(dto.getEstadoId())
                .orElseThrow(() -> new RuntimeException("Status not found"));

        resource.setTitulo(dto.getTitulo());
        resource.setDescripcion(dto.getDescripcion());
        resource.setEnlace(dto.getEnlace());
        resource.setUrlimg(dto.getUrlimg());
        resource.setContenido(dto.getContenido());
        resource.setCategoria(categoria);
        resource.setEstado(estado);

        return recursoRepository.save(resource);
    }

    public void deleteResource(UUID id) {
        recursoRepository.findById(id).ifPresent(recursoRepository::delete);
    }

    private ResourceAdminDTO mapToResourceAdminDTO(RecursoEducativo resource) {
        return ResourceAdminDTO.builder()
                .id(resource.getId())
                .titulo(resource.getTitulo())
                .categoriaNombre(resource.getCategoria() != null ? resource.getCategoria().getNombre() : "N/A")
                .estadoNombre(resource.getEstado() != null ? resource.getEstado().getNombre() : "N/A")
                .fechaPublicacion(resource.getFechaPublicacion())
                .creadorNombre(resource.getCreador() != null ? resource.getCreador().getUsuario().getNombre() : "N/A")
                .build();
    }
}
