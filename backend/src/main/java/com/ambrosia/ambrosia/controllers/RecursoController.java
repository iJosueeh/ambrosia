package com.ambrosia.ambrosia.controllers;

import com.ambrosia.ambrosia.models.dto.CategoriaRecursoDTO;
import com.ambrosia.ambrosia.models.dto.RecursoDTO;
import com.ambrosia.ambrosia.services.RecursoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recursos")
@RequiredArgsConstructor
public class RecursoController {

    private final RecursoService recursoService;

    @PostMapping
    public ResponseEntity<RecursoDTO> publicar(@RequestBody RecursoDTO dto) {
        RecursoDTO recursoPublicado = recursoService.publicarRecurso(dto);
        return  ResponseEntity.status(201).body(recursoPublicado);
    }

    @GetMapping
    public ResponseEntity<List<RecursoDTO>> listarTodos() {
        return ResponseEntity.ok(recursoService.listarTodosLosRecursos());
    }

    @GetMapping("/categoria/{id}")
    public ResponseEntity<List<RecursoDTO>> listarPorCategoria(@PathVariable Long id) {
        return ResponseEntity.ok(recursoService.listarRecursosPorCategoria(id));
    }

    @GetMapping("/categorias")
    public ResponseEntity<List<CategoriaRecursoDTO>> listarCategorias() {
        return ResponseEntity.ok(recursoService.listarCategorias());
    }
}