package com.ambrosia.ambrosia.services;

import com.ambrosia.ambrosia.models.CategoriaRecurso;
import com.ambrosia.ambrosia.models.EstadoPublicado;
import com.ambrosia.ambrosia.models.RecursoEducativo;
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
        if (Strings.isNullOrEmpty(dto.titulo()) || Strings.isNullOrEmpty(dto.descripcion())) {
            throw new IllegalArgumentException("El título y la descripción no pueden ser nulos o vacíos");
        }

        logger.info("Publicando recurso con título: {}", dto.titulo());

        CategoriaRecurso categoria = categoriaRecursoRepository.findByNombre(dto.categoria())
                .orElseThrow(() -> new RuntimeException("Categoria no encontrada con el nombre: " + dto.categoria()));

        EstadoPublicado estado = estadoPublicadoRepository.findByNombre(dto.estado())
                .orElseThrow(() -> new RuntimeException("Estado no encontrado con el nombre: " + dto.estado()));

        RecursoEducativo recurso = RecursoEducativo.builder()
                .titulo(dto.titulo())
                .descripcion(dto.descripcion())
                .categoria(categoria)
                .estado(estado)
                .fechaPublicacion(LocalDateTime.now())
                .build();

        RecursoEducativo recursoGuardado = recursoRepository.save(recurso);
        return modelMapper.map(recursoGuardado, RecursoDTO.class);
    }

    public List<RecursoDTO> listarRecursosPorCategoria(Long id) {
        logger.info("Listando recursos para la categoría con id: {}", id);
        return recursoRepository.findByCategoriaId(id).stream()
                .map(recurso -> modelMapper.map(recurso, RecursoDTO.class))
                .collect(Collectors.toList());
    }

}