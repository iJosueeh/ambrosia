package com.ambrosia.ambrosia.services;

import com.ambrosia.ambrosia.models.CategoriaRecurso;
import com.ambrosia.ambrosia.models.EstadoPublicado;
import com.ambrosia.ambrosia.models.RecursoEducativo;
import com.ambrosia.ambrosia.models.dto.CategoriaRecursoDTO;
import com.ambrosia.ambrosia.models.dto.RecursoDTO;
import com.ambrosia.ambrosia.repository.CategoriaRecursoRepository;
import com.ambrosia.ambrosia.repository.EstadoPublicadoRepository;
import com.ambrosia.ambrosia.repository.ProfesionalRepository;
import com.ambrosia.ambrosia.repository.RecursoRepository;
import com.google.common.base.Strings;
import com.ambrosia.ambrosia.mappers.RecursoMapper;
import lombok.RequiredArgsConstructor;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecursoService {

    private static final Logger logger = LoggerFactory.getLogger(RecursoService.class);

    private final RecursoRepository recursoRepository;
    private final CategoriaRecursoRepository categoriaRecursoRepository;
    private final EstadoPublicadoRepository estadoPublicadoRepository;
    private final ProfesionalRepository profesionalRepository;
    private final RecursoMapper recursoMapper;


    public RecursoDTO publicarRecurso(RecursoDTO dto) {
        if (Strings.isNullOrEmpty(dto.getTitulo()) || Strings.isNullOrEmpty(dto.getDescripcion())) {
            throw new IllegalArgumentException("El título y la descripción no pueden ser nulos o vacíos");
        }

        logger.info("Publicando recurso con título: {}", dto.getTitulo());

        CategoriaRecurso categoria = categoriaRecursoRepository.findByNombre(dto.getNombreCategoria())
                .orElseThrow(() -> new RuntimeException("Categoria no encontrada con el nombre: " + dto.getNombreCategoria()));

        EstadoPublicado estado = estadoPublicadoRepository.findByNombre(dto.getEstado())
                .orElseThrow(() -> new RuntimeException("Estado no encontrado con el nombre: " + dto.getEstado()));

        RecursoEducativo recurso = RecursoEducativo.builder()
                .titulo(dto.getTitulo())
                .descripcion(dto.getDescripcion())
                .enlace(dto.getEnlace())
                .urlimg(dto.getUrlimg())
                .categoria(categoria)
                .estado(estado)
                .fechaPublicacion(LocalDateTime.now())
                .build();

        RecursoEducativo recursoGuardado = recursoRepository.save(recurso);
        return recursoMapper.toDto(recursoGuardado);
    }

    public Page<RecursoDTO> listarTodosLosRecursos(Pageable pageable, String search) {
        logger.info("Listando todos los recursos con paginación y búsqueda");
        Page<RecursoEducativo> recursosPage;
        if (Strings.isNullOrEmpty(search)) {
            recursosPage = recursoRepository.findAll(pageable);
        } else {
            recursosPage = recursoRepository.findByTituloContainingIgnoreCaseOrDescripcionContainingIgnoreCase(search, search, pageable);
        }
        return recursosPage.map(recursoMapper::toDto);
    }

    public Page<RecursoDTO> listarRecursosPorCategoria(Long id, Pageable pageable, String search) {
        logger.info("Listando recursos para la categoría con id: {} con paginación y búsqueda", id);
        Page<RecursoEducativo> recursosPage;
        if (Strings.isNullOrEmpty(search)) {
            recursosPage = recursoRepository.findByCategoriaId(id, pageable);
        } else {
            recursosPage = recursoRepository.findByCategoriaIdAndTituloContainingIgnoreCaseOrCategoriaIdAndDescripcionContainingIgnoreCase(id, search, id, search, pageable);
        }
        return recursosPage.map(recursoMapper::toDto);
    }

    public RecursoDTO obtenerRecursoPorId(Long id) {
        logger.info("Obteniendo recurso con id: {}", id);
        RecursoEducativo recurso = recursoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Recurso no encontrado con el id: " + id));
        logger.debug("Mapping RecursoEducativo: {} with categoria: {}", recurso.getId(), recurso.getCategoria());
        return recursoMapper.toDto(recurso);
    }

    public void incrementarDescargas(Long id) {
        logger.info("Incrementando descargas para el recurso con id: {}", id);
        RecursoEducativo recurso = recursoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Recurso no encontrado con el id: " + id));
        if (recurso.getDownloads() == null) {
            recurso.setDownloads(0L);
        }
        recurso.setDownloads(recurso.getDownloads() + 1);
        recursoRepository.save(recurso);
    }

}