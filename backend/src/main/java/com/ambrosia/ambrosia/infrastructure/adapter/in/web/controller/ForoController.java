package com.ambrosia.ambrosia.infrastructure.adapter.in.web.controller;

import com.ambrosia.ambrosia.application.port.in.foro.CrearForoCommand;
import com.ambrosia.ambrosia.application.port.in.comentario.CrearComentarioCommand;
import com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto.ComentarioDTO;
import com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto.ForoDTO;
import com.ambrosia.ambrosia.application.service.ForoService;
import com.ambrosia.ambrosia.application.service.ComentarioService;
import com.ambrosia.ambrosia.application.service.ComentarioLikeService;
import com.ambrosia.ambrosia.application.service.MyUserDetails;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/foros")
@RequiredArgsConstructor
public class ForoController {

    private final ForoService foroService;
    private final ComentarioService comentarioService;
    private final ComentarioLikeService likeService;

    @GetMapping
    public ResponseEntity<Page<ForoDTO>> getAllForos(
            Pageable pageable,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) UUID categoriaId) {
        return ResponseEntity.ok(foroService.listar(pageable, search, categoriaId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ForoDTO> getForoById(@PathVariable UUID id) {
        return foroService.getForoDTOById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ForoDTO> createForo(@Valid @RequestBody CrearForoCommand command) {
        ForoDTO createdForo = foroService.crear(command);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdForo);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteForo(@PathVariable UUID id) {
        try {
            foroService.deleteForo(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/categoria/{categoriaForoId}")
    public ResponseEntity<List<ForoDTO>> getForosByCategoriaForoId(@PathVariable UUID categoriaForoId) {
        return ResponseEntity.ok(foroService.getForosDTOByCategoriaForoId(categoriaForoId));
    }

    @GetMapping("/autor/{autorId}")
    public ResponseEntity<List<ForoDTO>> getForosByAutorId(@PathVariable UUID autorId) {
        List<ForoDTO> foros = foroService.getForosByAutorId(autorId).stream()
                .map(foroService::convertToDTO)
                .toList();
        return ResponseEntity.ok(foros);
    }

    @GetMapping("/{foroId}/comentarios")
    public ResponseEntity<Page<ComentarioDTO>> getComentariosByForoId(
            @PathVariable UUID foroId,
            Pageable pageable) {
        return ResponseEntity.ok(comentarioService.listarPorForo(foroId, pageable));
    }

    @PostMapping("/{foroId}/comentarios")
    public ResponseEntity<ComentarioDTO> addComentarioToForo(
            @PathVariable UUID foroId,
            @Valid @RequestBody CrearComentarioCommand command) {

        // Crear nuevo command con el foroId de la URL
        CrearComentarioCommand commandWithForo = new CrearComentarioCommand(
                command.getContenido(),
                command.getAutorId(),
                foroId);

        ComentarioDTO savedComentario = comentarioService.crear(commandWithForo);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedComentario);
    }

    // ========== ENDPOINTS DE LIKES ==========

    @PostMapping("/{foroId}/comentarios/{comentarioId}/like")
    public ResponseEntity<Void> toggleLike(
            @PathVariable UUID foroId,
            @PathVariable UUID comentarioId,
            Authentication authentication) {

        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        MyUserDetails userDetails = (MyUserDetails) authentication.getPrincipal();
        likeService.toggleLike(comentarioId, userDetails.getId());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{foroId}/comentarios/{comentarioId}/likes/count")
    public ResponseEntity<Long> getLikesCount(
            @PathVariable UUID foroId,
            @PathVariable UUID comentarioId) {
        long count = likeService.getLikesCount(comentarioId);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/{foroId}/comentarios/{comentarioId}/likes/me")
    public ResponseEntity<Boolean> hasUserLiked(
            @PathVariable UUID foroId,
            @PathVariable UUID comentarioId,
            Authentication authentication) {

        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.ok(false);
        }

        MyUserDetails userDetails = (MyUserDetails) authentication.getPrincipal();
        boolean hasLiked = likeService.hasUserLiked(comentarioId, userDetails.getId());
        return ResponseEntity.ok(hasLiked);
    }
}
