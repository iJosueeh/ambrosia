package com.ambrosia.ambrosia.infrastructure.adapter.in.web.controller;

import com.ambrosia.ambrosia.domain.model.CategoriaRecurso;
import com.ambrosia.ambrosia.domain.repository.CategoriaRecursoRepositoryPort;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/resource-categories")
@RequiredArgsConstructor
public class CategoriaRecursoController {

    private final CategoriaRecursoRepositoryPort categoriaRecursoRepository;

    @GetMapping
    public ResponseEntity<List<CategoriaRecurso>> getAllCategories() {
        return ResponseEntity.ok(categoriaRecursoRepository.findAll());
    }
}
