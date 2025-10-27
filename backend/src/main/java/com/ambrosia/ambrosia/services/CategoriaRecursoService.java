package com.ambrosia.ambrosia.services;

import com.ambrosia.ambrosia.models.CategoriaRecurso;
import com.ambrosia.ambrosia.models.dto.CategoriaRecursoDTO;
import com.ambrosia.ambrosia.repository.CategoriaRecursoRepository;
import lombok.RequiredArgsConstructor;
import com.ambrosia.ambrosia.mappers.RecursoMapper;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoriaRecursoService {

    private final CategoriaRecursoRepository categoriaRecursoRepository;
    private final RecursoMapper recursoMapper;


    public List<CategoriaRecursoDTO> listarCategorias() {
        return categoriaRecursoRepository.findAll().stream()
                .map(recursoMapper::toDto)
                .collect(Collectors.toList());
    }

    public CategoriaRecursoDTO obtenerCategoriaPorId(Long id) {
        CategoriaRecurso categoria = categoriaRecursoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoría de recurso no encontrada con el id: " + id));
        return recursoMapper.toDto(categoria);
    }
}
