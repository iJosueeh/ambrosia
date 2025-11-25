package com.ambrosia.ambrosia.controllers;

import com.ambrosia.ambrosia.models.CategoriaForo;
import com.ambrosia.ambrosia.models.dto.CategoriaForoDTO;
import com.ambrosia.ambrosia.services.CategoriaForoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/categorias-foro")
public class CategoriaForoController {

    @Autowired
    private CategoriaForoService categoriaForoService;

    @GetMapping
    public List<CategoriaForoDTO> getAllCategoriasForo() {
        return categoriaForoService.getAllCategoriasForoDTO();
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoriaForoDTO> getCategoriaForoById(@PathVariable Long id) {
        return categoriaForoService.getCategoriaForoDTOById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public CategoriaForo createCategoriaForo(@RequestBody CategoriaForo categoriaForo) {
        return categoriaForoService.createCategoriaForo(categoriaForo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoriaForo> updateCategoriaForo(@PathVariable Long id, @RequestBody CategoriaForo categoriaForoDetails) {
        try {
            CategoriaForo updatedCategoriaForo = categoriaForoService.updateCategoriaForo(id, categoriaForoDetails);
            return ResponseEntity.ok(updatedCategoriaForo);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategoriaForo(@PathVariable Long id) {
        try {
            categoriaForoService.deleteCategoriaForo(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
