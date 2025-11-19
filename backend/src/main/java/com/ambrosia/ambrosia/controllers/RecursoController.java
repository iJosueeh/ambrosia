package com.ambrosia.ambrosia.controllers;

import com.ambrosia.ambrosia.models.dto.CategoriaRecursoDTO;
import com.ambrosia.ambrosia.models.dto.RecursoDTO;
import com.ambrosia.ambrosia.services.CategoriaRecursoService;
import com.ambrosia.ambrosia.services.RecursoService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import com.ambrosia.ambrosia.services.MyUserDetails;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/recursos")
@RequiredArgsConstructor
public class RecursoController {

    private final RecursoService recursoService;
    private final CategoriaRecursoService categoriaRecursoService;

    @PostMapping
    public ResponseEntity<RecursoDTO> createRecurso(@RequestBody RecursoDTO dto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        MyUserDetails userDetails = (MyUserDetails) authentication.getPrincipal();
        Long profesionalId = userDetails.getProfesionalId();

        if (profesionalId == null) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN); // Or throw an exception
        }

        RecursoDTO createdRecurso = recursoService.createRecurso(dto, profesionalId);
        return new ResponseEntity<>(createdRecurso, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<Page<RecursoDTO>> listarTodos(Pageable pageable, @RequestParam(required = false) String search) {
        return ResponseEntity.ok(recursoService.listarTodosLosRecursos(pageable, search));
    }

    @GetMapping("/profesional/{profesionalId}")
    public ResponseEntity<List<RecursoDTO>> getRecursosByProfesionalId(@PathVariable Long profesionalId) {
        List<RecursoDTO> recursos = recursoService.getRecursosByProfesionalId(profesionalId);
        return ResponseEntity.ok(recursos);
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

    @PutMapping("/{id}")
    public ResponseEntity<RecursoDTO> updateRecurso(@PathVariable Long id, @RequestBody RecursoDTO dto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        MyUserDetails userDetails = (MyUserDetails) authentication.getPrincipal();
        Long profesionalId = userDetails.getProfesionalId();

        if (profesionalId == null) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN); // Or throw an exception
        }

        RecursoDTO updatedRecurso = recursoService.updateRecurso(id, dto, profesionalId);
        return ResponseEntity.ok(updatedRecurso);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRecurso(@PathVariable Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        MyUserDetails userDetails = (MyUserDetails) authentication.getPrincipal();
        Long profesionalId = userDetails.getProfesionalId();

        if (profesionalId == null) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN); // Or throw an exception
        }

        recursoService.deleteRecurso(id, profesionalId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/descargar")
    public ResponseEntity<Void> incrementarDescargas(@PathVariable Long id) {
        recursoService.incrementarDescargas(id);
        return ResponseEntity.ok().build();
    }
}