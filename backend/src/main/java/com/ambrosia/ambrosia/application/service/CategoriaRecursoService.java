package com.ambrosia.ambrosia.application.service;

import com.ambrosia.ambrosia.domain.model.CategoriaRecurso;
import com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto.CategoriaRecursoDTO;
import com.ambrosia.ambrosia.domain.repository.CategoriaRecursoRepositoryPort;
import lombok.RequiredArgsConstructor;
import com.ambrosia.ambrosia.infrastructure.util.mapper.RecursoMapper;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoriaRecursoService {

    private final CategoriaRecursoRepositoryPort categoriaRecursoRepository;
    private final RecursoMapper recursoMapper;

    public List<CategoriaRecursoDTO> listarCategorias() {
        return categoriaRecursoRepository.findAll().stream()
                .map(recursoMapper::toDto)
                .collect(Collectors.toList());
    }

    public CategoriaRecursoDTO obtenerCategoriaPorId(UUID id) {
        CategoriaRecurso categoria = categoriaRecursoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoría de recurso no encontrada con el id: " + id));
        return recursoMapper.toDto(categoria);
    }
}
