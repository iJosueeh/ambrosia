package com.ambrosia.ambrosia.controllers;

import com.ambrosia.ambrosia.models.dto.CategoriaRecursoDTO;
import com.ambrosia.ambrosia.models.dto.RecursoDTO;
import com.ambrosia.ambrosia.services.CategoriaRecursoService;
import com.ambrosia.ambrosia.services.RecursoService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/recursos")
@RequiredArgsConstructor
public class RecursoController {

    private final RecursoService recursoService;
    private final CategoriaRecursoService categoriaRecursoService;

    @PostMapping
    public ResponseEntity<RecursoDTO> publicar(@RequestBody RecursoDTO dto) {
        RecursoDTO recursoPublicado = recursoService.publicarRecurso(dto);
        return  ResponseEntity.status(201).body(recursoPublicado);
    }

    @GetMapping
    public ResponseEntity<Page<RecursoDTO>> listarTodos(Pageable pageable, @RequestParam(required = false) String search) {
        return ResponseEntity.ok(recursoService.listarTodosLosRecursos(pageable, search));
    }

    @GetMapping("/categoria/{id}")
    public ResponseEntity<Page<RecursoDTO>> listarPorCategoria(@PathVariable Long id, Pageable pageable, @RequestParam(required = false) String search) {
        return ResponseEntity.ok(recursoService.listarRecursosPorCategoria(id, pageable, search));
    }

    @GetMapping("/categorias")
    public ResponseEntity<List<CategoriaRecursoDTO>> listarCategorias() {
        return ResponseEntity.ok(categoriaRecursoService.listarCategorias());
    }

    @GetMapping("/{id}")
    public ResponseEntity<RecursoDTO> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(recursoService.obtenerRecursoPorId(id));
    }

    @PutMapping("/{id}/descargar")
    public ResponseEntity<Void> incrementarDescargas(@PathVariable Long id) {
        recursoService.incrementarDescargas(id);
        return ResponseEntity.ok().build();
    }
}