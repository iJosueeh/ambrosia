package com.ambrosia.ambrosia.infrastructure.adapter.in.web.controller;

import com.ambrosia.ambrosia.application.port.in.recurso.CrearRecursoCommand;
import com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto.CategoriaRecursoDTO;
import com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto.ProgresoUsuarioDTO;
import com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto.RecursoDTO;
import com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto.RecursoFilterDTO;
import com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto.RecursoRelacionadoDTO;
import com.ambrosia.ambrosia.application.service.CategoriaRecursoService;
import com.ambrosia.ambrosia.application.service.RecursoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import com.ambrosia.ambrosia.application.service.MyUserDetails;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/recursos")
@RequiredArgsConstructor
public class RecursoController {

    private final RecursoService recursoService;
    private final CategoriaRecursoService categoriaRecursoService;

    @PostMapping
    public ResponseEntity<RecursoDTO> createRecurso(@Valid @RequestBody CrearRecursoCommand command) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        MyUserDetails userDetails = (MyUserDetails) authentication.getPrincipal();
        UUID profesionalId = userDetails.getProfesionalId();

        if (profesionalId == null) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }

        // Crear nuevo command con el profesionalId del usuario autenticado
        CrearRecursoCommand commandWithProfesional = new CrearRecursoCommand(
                command.getTitulo(),
                command.getDescripcion(),
                command.getEnlace(),
                command.getUrlimg(),
                command.getContenido(),
                command.getSize(),
                command.getNombreCategoria(),
                profesionalId);

        RecursoDTO createdRecurso = recursoService.crear(commandWithProfesional);
        return new ResponseEntity<>(createdRecurso, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<Page<RecursoDTO>> listarTodos(
            Pageable pageable,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(recursoService.listarTodos(pageable, search));
    }

    @GetMapping("/profesional/{profesionalId}")
    public ResponseEntity<List<RecursoDTO>> getRecursosByProfesionalId(@PathVariable UUID profesionalId) {
        List<RecursoDTO> recursos = recursoService.getRecursosByProfesionalId(profesionalId);
        return ResponseEntity.ok(recursos);
    }

    @GetMapping("/categoria/{id}")
    public ResponseEntity<Page<RecursoDTO>> listarPorCategoria(
            @PathVariable UUID id,
            Pageable pageable,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(recursoService.listarPorCategoria(id, pageable, search));
    }

    @GetMapping("/categorias")
    public ResponseEntity<List<CategoriaRecursoDTO>> listarCategorias() {
        return ResponseEntity.ok(categoriaRecursoService.listarCategorias());
    }

    /**
     * Endpoint de búsqueda avanzada con filtros dinámicos.
     * Permite combinar múltiples criterios de búsqueda y ordenamiento.
     */
    @GetMapping("/buscar")
    public ResponseEntity<Page<RecursoDTO>> buscarConFiltros(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) UUID categoriaId,
            @RequestParam(required = false) String tipo,
            @RequestParam(required = false) @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE) java.time.LocalDate fechaDesde,
            @RequestParam(required = false) @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE) java.time.LocalDate fechaHasta,
            @RequestParam(defaultValue = "fecha") String ordenarPor,
            @RequestParam(defaultValue = "DESC") String direccion,
            Pageable pageable) {

        RecursoFilterDTO filtros = RecursoFilterDTO.builder()
                .searchQuery(query)
                .categoriaId(categoriaId)
                .tipoRecurso(tipo)
                .fechaDesde(fechaDesde)
                .fechaHasta(fechaHasta)
                .ordenarPor(ordenarPor)
                .direccion(direccion)
                .build();

        return ResponseEntity.ok(recursoService.buscarConFiltros(filtros, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<RecursoDTO> obtenerPorId(@PathVariable UUID id) {
        return ResponseEntity.ok(recursoService.obtenerPorId(id));
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<RecursoDTO> obtenerPorSlug(@PathVariable String slug) {
        return ResponseEntity.ok(recursoService.obtenerPorSlug(slug));
    }

    @PutMapping("/{id}")
    public ResponseEntity<RecursoDTO> updateRecurso(@PathVariable UUID id, @RequestBody RecursoDTO dto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        MyUserDetails userDetails = (MyUserDetails) authentication.getPrincipal();
        UUID profesionalId = userDetails.getProfesionalId();

        if (profesionalId == null) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }

        RecursoDTO updatedRecurso = recursoService.updateRecurso(id, dto, profesionalId);
        return ResponseEntity.ok(updatedRecurso);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRecurso(@PathVariable UUID id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        MyUserDetails userDetails = (MyUserDetails) authentication.getPrincipal();
        UUID profesionalId = userDetails.getProfesionalId();

        if (profesionalId == null) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }

        recursoService.deleteRecurso(id, profesionalId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/descargar")
    public ResponseEntity<Void> incrementarDescargas(@PathVariable UUID id) {
        recursoService.incrementarDescargas(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}/relacionados")
    public ResponseEntity<List<RecursoRelacionadoDTO>> obtenerRecursosRelacionados(
            @PathVariable UUID id,
            @RequestParam(defaultValue = "3") int limit) {
        List<RecursoRelacionadoDTO> relacionados = recursoService
                .obtenerRecursosRelacionados(id, limit);
        return ResponseEntity.ok(relacionados);
    }

    @PostMapping("/{id}/marcar-leido")
    public ResponseEntity<Void> marcarComoLeido(
            @PathVariable UUID id,
            @RequestParam(required = false) Integer tiempoLecturaSegundos) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // Verificar si el usuario está autenticado
        if (authentication == null || !authentication.isAuthenticated() ||
                "anonymousUser".equals(authentication.getPrincipal())) {
            return ResponseEntity.status(401).build();
        }

        // Verificar que el principal sea del tipo correcto
        if (!(authentication.getPrincipal() instanceof MyUserDetails)) {
            return ResponseEntity.status(403).build();
        }

        MyUserDetails userDetails = (MyUserDetails) authentication.getPrincipal();
        UUID usuarioId = userDetails.getId();

        recursoService.marcarRecursoComoLeido(id, usuarioId, tiempoLecturaSegundos);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/progreso")
    public ResponseEntity<ProgresoUsuarioDTO> obtenerProgreso() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // Verificar si el usuario está autenticado
        if (authentication == null || !authentication.isAuthenticated() ||
                "anonymousUser".equals(authentication.getPrincipal())) {
            return ResponseEntity.status(401).build();
        }

        // Verificar que el principal sea del tipo correcto
        if (!(authentication.getPrincipal() instanceof MyUserDetails)) {
            return ResponseEntity.status(403).build();
        }

        MyUserDetails userDetails = (MyUserDetails) authentication.getPrincipal();
        UUID usuarioId = userDetails.getId();

        ProgresoUsuarioDTO progreso = recursoService
                .obtenerProgresoUsuario(usuarioId);
        return ResponseEntity.ok(progreso);
    }
}
