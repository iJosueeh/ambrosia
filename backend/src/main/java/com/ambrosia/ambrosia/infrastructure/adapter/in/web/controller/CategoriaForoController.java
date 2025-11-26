package com.ambrosia.ambrosia.infrastructure.adapter.in.web.controller;

import com.ambrosia.ambrosia.domain.model.CategoriaForo;
import com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto.CategoriaForoDTO;
import com.ambrosia.ambrosia.application.service.CategoriaForoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/categorias-foro")
@RequiredArgsConstructor
public class CategoriaForoController {

    private final CategoriaForoService categoriaForoService;

    @GetMapping
    public ResponseEntity<List<CategoriaForoDTO>> getAllCategoriasForo() {
        return ResponseEntity.ok(categoriaForoService.getAllCategoriasForoDTO());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoriaForoDTO> getCategoriaForoById(@PathVariable UUID id) {
        return categoriaForoService.getCategoriaForoDTOById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<CategoriaForo> createCategoriaForo(@RequestBody CategoriaForo categoriaForo) {
        CategoriaForo created = categoriaForoService.createCategoriaForo(categoriaForo);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoriaForo> updateCategoriaForo(
            @PathVariable UUID id,
            @RequestBody CategoriaForo categoriaForoDetails) {
        try {
            CategoriaForo updated = categoriaForoService.updateCategoriaForo(id, categoriaForoDetails);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategoriaForo(@PathVariable UUID id) {
        try {
            categoriaForoService.deleteCategoriaForo(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
