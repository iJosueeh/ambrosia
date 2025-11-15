package com.ambrosia.ambrosia.services.admin;

import com.ambrosia.ambrosia.models.CategoriaRecurso;
import com.ambrosia.ambrosia.models.EstadoPublicado;
import com.ambrosia.ambrosia.models.RecursoEducativo;
import com.ambrosia.ambrosia.models.dto.ResourceAdminDTO;
import com.ambrosia.ambrosia.models.dto.ResourceUpdateDTO;
import com.ambrosia.ambrosia.repository.CategoriaRecursoRepository;
import com.ambrosia.ambrosia.repository.EstadoPublicadoRepository;
import com.ambrosia.ambrosia.repository.RecursoRepository;
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

@Service
@RequiredArgsConstructor
public class AdminResourceService {

    private final RecursoRepository recursoRepository;
    private final CategoriaRecursoRepository categoriaRecursoRepository;
    private final EstadoPublicadoRepository estadoPublicadoRepository;

    public Page<ResourceAdminDTO> getAllResources(Pageable pageable, String searchTerm, Long categoryId, Long statusId) {
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

    public ResourceAdminDTO getResourceById(Long id) {
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

    public RecursoEducativo updateResource(Long id, ResourceUpdateDTO dto) {
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

    public void deleteResource(Long id) {
        if (!recursoRepository.existsById(id)) {
            throw new RuntimeException("Resource not found with id: " + id);
        }
        recursoRepository.deleteById(id);
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
