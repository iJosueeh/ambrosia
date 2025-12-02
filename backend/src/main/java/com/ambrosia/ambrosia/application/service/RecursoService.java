package com.ambrosia.ambrosia.application.service;

import com.ambrosia.ambrosia.application.port.in.recurso.*;
import com.ambrosia.ambrosia.domain.model.CategoriaRecurso;
import com.ambrosia.ambrosia.domain.model.EstadoPublicado;
import com.ambrosia.ambrosia.domain.model.Profesional;
import com.ambrosia.ambrosia.domain.model.RecursoEducativo;
import com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto.RecursoDTO;
import com.ambrosia.ambrosia.domain.repository.CategoriaRecursoRepositoryPort;
import com.ambrosia.ambrosia.domain.repository.EstadoPublicadoRepositoryPort;
import com.ambrosia.ambrosia.domain.repository.RecursoRepositoryPort;
import com.ambrosia.ambrosia.domain.repository.UsuarioRepositoryPort;
import com.ambrosia.ambrosia.domain.repository.ProfesionalRepositoryPort;
import com.google.common.base.Strings;
import com.ambrosia.ambrosia.infrastructure.util.mapper.RecursoMapper;
import lombok.RequiredArgsConstructor;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecursoService implements
        CrearRecursoUseCase,
        ListarRecursosUseCase,
        ObtenerRecursoUseCase {

    private static final Logger logger = LoggerFactory.getLogger(RecursoService.class);

    private final RecursoRepositoryPort recursoRepository;
    private final CategoriaRecursoRepositoryPort categoriaRecursoRepository;
    private final EstadoPublicadoRepositoryPort estadoPublicadoRepository;
    private final ProfesionalRepositoryPort profesionalRepository;
    private final RecursoMapper recursoMapper;
    private final RecursoLeidoService recursoLeidoService;
    private final UsuarioRepositoryPort usuarioRepository;

    @Override
    @Transactional
    public RecursoDTO crear(CrearRecursoCommand command) {
        logger.info("Creando recurso: {}", command.getTitulo());

        Profesional creador = profesionalRepository.findById(command.getProfesionalId())
                .orElseThrow(() -> new RuntimeException(
                        "Profesional no encontrado con el ID: " + command.getProfesionalId()));

        CategoriaRecurso categoria = categoriaRecursoRepository.findByNombre(command.getNombreCategoria())
                .orElseThrow(() -> new RuntimeException(
                        "Categoria no encontrada con el nombre: " + command.getNombreCategoria()));

        EstadoPublicado estadoBorrador = estadoPublicadoRepository.findByNombre("DRAFT")
                .orElseThrow(() -> new RuntimeException("Estado 'DRAFT' no encontrado."));

        RecursoEducativo recurso = RecursoEducativo.builder()
                .titulo(command.getTitulo())
                .descripcion(command.getDescripcion())
                .enlace(command.getEnlace())
                .urlimg(command.getUrlimg())
                .contenido(command.getContenido())
                .size(command.getSize())
                .downloads(0L)
                .fechaPublicacion(LocalDateTime.now())
                .creador(creador)
                .categoria(categoria)
                .estado(estadoBorrador)
                .build();

        RecursoEducativo recursoGuardado = recursoRepository.save(recurso);
        return recursoMapper.toDto(recursoGuardado);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<RecursoDTO> listarTodos(Pageable pageable, String search) {
        logger.info("Listando todos los recursos - search: {}", search);

        if (Strings.isNullOrEmpty(search)) {
            return recursoRepository.findAll(pageable).map(recursoMapper::toDto);
        } else {
            return recursoRepository
                    .findByTituloContainingIgnoreCaseOrDescripcionContainingIgnoreCase(search, search, pageable)
                    .map(recursoMapper::toDto);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Page<RecursoDTO> listarPorCategoria(UUID categoriaId, Pageable pageable, String search) {
        logger.info("Listando recursos por categoría: {} - search: {}", categoriaId, search);

        if (Strings.isNullOrEmpty(search)) {
            return recursoRepository.findByCategoriaId(categoriaId, pageable).map(recursoMapper::toDto);
        } else {
            return recursoRepository
                    .findByCategoriaIdAndTituloContainingIgnoreCaseOrCategoriaIdAndDescripcionContainingIgnoreCase(
                            categoriaId, search, categoriaId, search, pageable)
                    .map(recursoMapper::toDto);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public RecursoDTO obtenerPorId(UUID id) {
        logger.info("Obteniendo recurso por ID: {}", id);
        RecursoEducativo recurso = recursoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Recurso no encontrado con el ID: " + id));
        return recursoMapper.toDto(recurso);
    }

    @Transactional(readOnly = true)
    public RecursoDTO obtenerPorSlug(String slug) {
        logger.info("Obteniendo recurso por slug: {}", slug);
        RecursoEducativo recurso = recursoRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Recurso no encontrado con el slug: " + slug));
        return recursoMapper.toDto(recurso);
    }

    @Transactional(readOnly = true)
    public List<RecursoDTO> getRecursosByProfesionalId(UUID profesionalId) {
        return recursoRepository.findByCreadorId(profesionalId).stream()
                .map(recursoMapper::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public RecursoDTO updateRecurso(UUID id, RecursoDTO dto, UUID profesionalId) {
        RecursoEducativo recurso = recursoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Recurso no encontrado con el ID: " + id));

        if (!recurso.getCreador().getId().equals(profesionalId)) {
            throw new RuntimeException("No tienes permiso para editar este recurso");
        }

        recurso.setTitulo(dto.getTitulo());
        recurso.setDescripcion(dto.getDescripcion());
        recurso.setEnlace(dto.getEnlace());
        recurso.setUrlimg(dto.getUrlimg());
        recurso.setContenido(dto.getContenido());
        recurso.setSize(dto.getSize());

        if (!Strings.isNullOrEmpty(dto.getNombreCategoria())) {
            CategoriaRecurso categoria = categoriaRecursoRepository.findByNombre(dto.getNombreCategoria())
                    .orElseThrow(() -> new RuntimeException(
                            "Categoria no encontrada con el nombre: " + dto.getNombreCategoria()));
            recurso.setCategoria(categoria);
        }

        RecursoEducativo recursoActualizado = recursoRepository.save(recurso);
        return recursoMapper.toDto(recursoActualizado);
    }

    @Transactional
    public void deleteRecurso(UUID id, UUID profesionalId) {
        RecursoEducativo recurso = recursoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Recurso no encontrado con el ID: " + id));

        if (!recurso.getCreador().getId().equals(profesionalId)) {
            throw new RuntimeException("No tienes permiso para eliminar este recurso");
        }

        recursoRepository.delete(recurso);
    }

    @Transactional
    public void incrementarDescargas(UUID id) {
        RecursoEducativo recurso = recursoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Recurso no encontrado con el ID: " + id));
        recurso.setDownloads(recurso.getDownloads() + 1);
        recursoRepository.save(recurso);
    }

    @Transactional
    public RecursoDTO createRecurso(RecursoDTO dto, UUID profesionalId) {
        CrearRecursoCommand command = new CrearRecursoCommand(
                dto.getTitulo(),
                dto.getDescripcion(),
                dto.getEnlace(),
                dto.getUrlimg(),
                dto.getContenido(),
                dto.getSize(),
                dto.getNombreCategoria(),
                profesionalId);
        return crear(command);
    }

    @Transactional(readOnly = true)
    public Page<RecursoDTO> listarTodosLosRecursos(Pageable pageable, String search) {
        return listarTodos(pageable, search);
    }

    @Transactional(readOnly = true)
    public Page<RecursoDTO> listarRecursosPorCategoria(UUID categoriaId, Pageable pageable, String search) {
        return listarPorCategoria(categoriaId, pageable, search);
    }

    @Transactional(readOnly = true)
    public RecursoDTO obtenerRecursoPorId(UUID id) {
        return obtenerPorId(id);
    }

    @Transactional(readOnly = true)
    public List<com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto.RecursoRelacionadoDTO> obtenerRecursosRelacionados(
            UUID recursoId, int limit) {
        RecursoEducativo recurso = recursoRepository.findById(recursoId)
                .orElseThrow(() -> new RuntimeException("Recurso no encontrado con el ID: " + recursoId));

        Page<RecursoEducativo> relacionados = recursoRepository.findByCategoriaIdAndEstadoNombre(
                recurso.getCategoria().getId(),
                "PUBLISHED",
                org.springframework.data.domain.PageRequest.of(0, limit + 10));

        return relacionados.stream()
                .filter(r -> !r.getId().equals(recursoId))
                .limit(limit)
                .map(r -> com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto.RecursoRelacionadoDTO.builder()
                        .id(r.getId())
                        .titulo(r.getTitulo())
                        .descripcion(r.getDescripcion())
                        .slug(r.getSlug())
                        .urlimg(r.getUrlimg())
                        .tipoRecurso(determinarTipoRecurso(r))
                        .nombreCategoria(r.getCategoria().getNombre())
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional
    public void marcarRecursoComoLeido(UUID recursoId, UUID usuarioId, Integer tiempoLecturaSegundos) {
        RecursoEducativo recurso = recursoRepository.findById(recursoId)
                .orElseThrow(() -> new RuntimeException("Recurso no encontrado con el ID: " + recursoId));

        com.ambrosia.ambrosia.domain.model.Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con el ID: " + usuarioId));

        // Verificar si ya estaba marcado como leído
        boolean yaLeido = recursoLeidoService.estaLeido(usuario, recurso);

        recursoLeidoService.marcarComoLeido(usuario, recurso, tiempoLecturaSegundos);

        // Solo incrementar contador si es la primera vez
        if (!yaLeido) {
            usuario.setArticulosLeidos((usuario.getArticulosLeidos() != null ? usuario.getArticulosLeidos() : 0) + 1);
            usuarioRepository.save(usuario);
        }
    }

    @Transactional(readOnly = true)
    public com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto.ProgresoUsuarioDTO obtenerProgresoUsuario(
            UUID usuarioId) {
        com.ambrosia.ambrosia.domain.model.Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con el ID: " + usuarioId));

        long recursosLeidos = recursoLeidoService.contarRecursosLeidos(usuario);
        long totalRecursos = recursoRepository
                .findByEstadoNombre("PUBLISHED", org.springframework.data.domain.Pageable.unpaged()).getTotalElements();
        List<UUID> recursosLeidosIds = recursoLeidoService.obtenerIdsRecursosLeidos(usuario);
        int porcentaje = totalRecursos > 0 ? (int) ((recursosLeidos * 100) / totalRecursos) : 0;

        return com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto.ProgresoUsuarioDTO.builder()
                .articulosLeidos((int) recursosLeidos)
                .totalArticulosRecomendados((int) totalRecursos)
                .porcentaje(porcentaje)
                .recursosLeidosIds(recursosLeidosIds)
                .build();
    }

    private String determinarTipoRecurso(RecursoEducativo recurso) {
        if (recurso.getEnlace() != null) {
            String enlace = recurso.getEnlace().toLowerCase();
            if (enlace.contains("youtube") || enlace.contains("video")) {
                return "Video";
            } else if (enlace.contains("podcast") || enlace.contains("spotify")) {
                return "Podcast";
            }
        }
        return "Artículo";
    }

    /**
     * Busca recursos aplicando filtros dinámicos y ordenamiento.
     * Utiliza JPA Specifications para construir queries flexibles.
     */
    @Transactional(readOnly = true)
    public Page<RecursoDTO> buscarConFiltros(
            com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto.RecursoFilterDTO filtros,
            Pageable pageable) {

        logger.info("Buscando recursos con filtros: {}", filtros);

        // Construir Specification basada en filtros
        org.springframework.data.jpa.domain.Specification<RecursoEducativo> spec = com.ambrosia.ambrosia.infrastructure.specification.RecursoSpecification
                .withFilters(filtros);

        // Aplicar ordenamiento dinámico
        org.springframework.data.domain.Sort sort = construirOrdenamiento(
                filtros.getOrdenarPor(),
                filtros.getDireccion());

        Pageable pageableConOrden = org.springframework.data.domain.PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                sort);

        // Ejecutar query con Specification usando el adapter
        // NO hacer cast a SpringDataRecursoRepository, usar el método del adapter
        Page<RecursoEducativo> recursos = recursoRepository.findAll(spec, pageableConOrden);

        return recursos.map(recursoMapper::toDto);
    }

    /**
     * Construye el objeto Sort basado en el campo y dirección especificados.
     */
    private Sort construirOrdenamiento(String ordenarPor, String direccion) {
        // Mapeo de nombres de campos a nombres de columnas en la entidad
        String campoOrden = switch (ordenarPor != null ? ordenarPor.toLowerCase() : "fecha") {
            case "titulo" -> "titulo";
            case "downloads", "popularidad" -> "downloads";
            case "fecha" -> "fechaPublicacion";
            default -> "fechaPublicacion";
        };

        org.springframework.data.domain.Sort.Direction dir = "ASC".equalsIgnoreCase(direccion)
                ? org.springframework.data.domain.Sort.Direction.ASC
                : org.springframework.data.domain.Sort.Direction.DESC;

        return org.springframework.data.domain.Sort.by(dir, campoOrden);
    }
}