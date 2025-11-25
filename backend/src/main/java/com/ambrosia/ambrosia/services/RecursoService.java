package com.ambrosia.ambrosia.services;

import com.ambrosia.ambrosia.models.CategoriaRecurso;
import com.ambrosia.ambrosia.models.EstadoPublicado;
import com.ambrosia.ambrosia.models.Profesional;
import com.ambrosia.ambrosia.models.RecursoEducativo;
import com.ambrosia.ambrosia.models.dto.RecursoDTO;
import com.ambrosia.ambrosia.repository.CategoriaRecursoRepository;
import com.ambrosia.ambrosia.repository.EstadoPublicadoRepository;
import com.ambrosia.ambrosia.repository.RecursoRepository;
import com.ambrosia.ambrosia.repository.ProfesionalRepository;
import com.google.common.base.Strings;

import jakarta.validation.constraints.NotNull;

import com.ambrosia.ambrosia.mappers.RecursoMapper;
import lombok.RequiredArgsConstructor;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    @Transactional
    public RecursoDTO createRecurso(@NotNull RecursoDTO dto, Long profesionalId) {
        if (Strings.isNullOrEmpty(dto.getTitulo()) || Strings.isNullOrEmpty(dto.getContenido())) {
            throw new IllegalArgumentException("El título y el contenido no pueden ser nulos o vacíos");
        }

        Profesional creador = profesionalRepository.findById(profesionalId)
                .orElseThrow(() -> new RuntimeException("Profesional no encontrado con el ID: " + profesionalId));

        CategoriaRecurso categoria = categoriaRecursoRepository.findByNombre(dto.getNombreCategoria())
                .orElseThrow(() -> new RuntimeException(
                        "Categoria no encontrada con el nombre: " + dto.getNombreCategoria()));

        EstadoPublicado estadoBorrador = estadoPublicadoRepository.findByNombre("BORRADOR")
                .orElseThrow(() -> new RuntimeException("Estado 'BORRADOR' no encontrado."));

        RecursoEducativo recurso = RecursoEducativo.builder()
                .titulo(dto.getTitulo())
                .descripcion(dto.getDescripcion())
                .enlace(dto.getEnlace())
                .urlimg(dto.getUrlimg())
                .contenido(dto.getContenido())
                .size(dto.getSize())
                .downloads(0L)
                .fechaPublicacion(LocalDateTime.now())
                .creador(creador)
                .categoria(categoria)
                .estado(estadoBorrador)
                .build();

        RecursoEducativo recursoGuardado = recursoRepository.save(recurso);
        return recursoMapper.toDto(recursoGuardado);
    }

    @Transactional
    public RecursoDTO updateRecurso(Long recursoId, RecursoDTO dto, Long profesionalId) {
        RecursoEducativo existingRecurso = recursoRepository.findById(recursoId)
                .orElseThrow(() -> new RuntimeException("Recurso no encontrado con el ID: " + recursoId));

        if (!existingRecurso.getCreador().getId().equals(profesionalId)) {
            throw new SecurityException("El profesional no tiene permisos para editar este recurso.");
        }

        if (Strings.isNullOrEmpty(dto.getTitulo()) || Strings.isNullOrEmpty(dto.getContenido())) {
            throw new IllegalArgumentException("El título y el contenido no pueden ser nulos o vacíos");
        }

        CategoriaRecurso categoria = categoriaRecursoRepository.findByNombre(dto.getNombreCategoria())
                .orElseThrow(() -> new RuntimeException(
                        "Categoria no encontrada con el nombre: " + dto.getNombreCategoria()));

        EstadoPublicado estado = estadoPublicadoRepository.findByNombre(dto.getEstado())
                .orElseThrow(() -> new RuntimeException("Estado no encontrado con el nombre: " + dto.getEstado()));

        existingRecurso.setTitulo(dto.getTitulo());
        existingRecurso.setDescripcion(dto.getDescripcion());
        existingRecurso.setEnlace(dto.getEnlace());
        existingRecurso.setUrlimg(dto.getUrlimg());
        existingRecurso.setContenido(dto.getContenido());
        existingRecurso.setSize(dto.getSize());
        existingRecurso.setCategoria(categoria);
        existingRecurso.setEstado(estado);

        RecursoEducativo updatedRecurso = recursoRepository.save(existingRecurso);
        return recursoMapper.toDto(updatedRecurso);
    }

    @Transactional
    public void deleteRecurso(Long recursoId, Long profesionalId) {
        RecursoEducativo existingRecurso = recursoRepository.findById(recursoId)
                .orElseThrow(() -> new RuntimeException("Recurso no encontrado con el ID: " + recursoId));

        if (!existingRecurso.getCreador().getId().equals(profesionalId)) {
            throw new SecurityException("El profesional no tiene permisos para eliminar este recurso.");
        }

        recursoRepository.delete(existingRecurso);
    }

    public List<RecursoDTO> getRecursosByProfesionalId(Long profesionalId) {
        return recursoRepository.findByCreadorId(profesionalId).stream()
                .map(recursoMapper::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Page<RecursoDTO> listarTodosLosRecursos(Pageable pageable, String search) {
        logger.info("Listando todos los recursos con paginación y búsqueda");
        Page<RecursoEducativo> recursosPage;
        if (Strings.isNullOrEmpty(search)) {
            recursosPage = recursoRepository.findByEstadoNombre("PUBLICADO", pageable);
        } else {
            recursosPage = recursoRepository
                    .findByEstadoNombreAndTituloContainingIgnoreCaseOrEstadoNombreAndDescripcionContainingIgnoreCase(
                            "PUBLICADO", search, "PUBLICADO", search, pageable);
        }
        return recursosPage.map(recursoMapper::toDto);
    }

    @Transactional(readOnly = true)
    public Page<RecursoDTO> listarRecursosPorCategoria(Long id, Pageable pageable, String search) {
        logger.info("Listando recursos para la categoría con id: {} con paginación y búsqueda", id);
        Page<RecursoEducativo> recursosPage;
        if (Strings.isNullOrEmpty(search)) {
            recursosPage = recursoRepository.findByCategoriaIdAndEstadoNombre(id, "PUBLICADO", pageable);
        } else {
            recursosPage = recursoRepository
                    .findByCategoriaIdAndEstadoNombreAndTituloContainingIgnoreCaseOrCategoriaIdAndEstadoNombreAndDescripcionContainingIgnoreCase(
                            id, "PUBLICADO", search, id, "PUBLICADO", search, pageable);
        }
        return recursosPage.map(recursoMapper::toDto);
    }

    @Transactional(readOnly = true)
    public RecursoDTO obtenerRecursoPorId(Long id) {
        logger.info("Obteniendo recurso con id: {}", id);
        RecursoEducativo recurso = recursoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Recurso no encontrado con el id: " + id));
        logger.debug("Mapping RecursoEducativo: {} with categoria: {}", recurso.getId(), recurso.getCategoria());
        return recursoMapper.toDto(recurso);
    }

    @Transactional
    public void incrementarDescargas(Long id) {
        logger.info("Incrementando descargas para el recurso con id: {}", id);
        RecursoEducativo recurso = recursoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Recurso no encontrado con el id: " + id));
        if (recurso.getDownloads() == null) {
            recurso.setDownloads(0L);
        }
        recurso.setDownloads(recurso.getDownloads() + 1);
    }

}