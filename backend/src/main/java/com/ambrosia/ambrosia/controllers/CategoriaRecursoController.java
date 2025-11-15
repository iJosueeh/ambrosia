package com.ambrosia.ambrosia.controllers;

import com.ambrosia.ambrosia.models.CategoriaRecurso;
import com.ambrosia.ambrosia.repository.CategoriaRecursoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/resource-categories")
@RequiredArgsConstructor
public class CategoriaRecursoController {

    private final CategoriaRecursoRepository categoriaRecursoRepository;

    @GetMapping
    public ResponseEntity<List<CategoriaRecurso>> getAllCategories() {
        return ResponseEntity.ok(categoriaRecursoRepository.findAll());
    }
}
