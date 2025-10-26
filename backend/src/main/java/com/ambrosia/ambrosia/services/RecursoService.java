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
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
    private final ModelMapper modelMapper;

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
                .categoria(categoria)
                .estado(estado)
                .fechaPublicacion(LocalDateTime.now())
                .build();

        RecursoEducativo recursoGuardado = recursoRepository.save(recurso);
        return modelMapper.map(recursoGuardado, RecursoDTO.class);
    }

    public List<RecursoDTO> listarTodosLosRecursos() {
        logger.info("Listando todos los recursos");
        return recursoRepository.findAll().stream()
                .map(recurso -> modelMapper.map(recurso, RecursoDTO.class))
                .collect(Collectors.toList());
    }

    public List<RecursoDTO> listarRecursosPorCategoria(Long id) {
        logger.info("Listando recursos para la categoría con id: {}", id);
        return recursoRepository.findByCategoriaId(id).stream()
                .map(recurso -> modelMapper.map(recurso, RecursoDTO.class))
                .collect(Collectors.toList());
    }

    public List<CategoriaRecursoDTO> listarCategorias() {
        logger.info("Listando todas las categorias");
        return categoriaRecursoRepository.findAll().stream()
                .map(categoria -> modelMapper.map(categoria, CategoriaRecursoDTO.class))
                .collect(Collectors.toList());
    }

    public RecursoDTO obtenerRecursoPorId(Long id) {
        logger.info("Obteniendo recurso con id: {}", id);
        RecursoEducativo recurso = recursoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Recurso no encontrado con el id: " + id));
        return modelMapper.map(recurso, RecursoDTO.class);
    }

}