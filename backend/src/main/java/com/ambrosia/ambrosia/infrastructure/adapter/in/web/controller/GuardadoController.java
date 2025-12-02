package com.ambrosia.ambrosia.infrastructure.adapter.in.web.controller;

import com.ambrosia.ambrosia.application.service.GuardadoService;
import com.ambrosia.ambrosia.domain.model.Guardado;
import com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto.CrearGuardadoRequest;
import com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto.GuardadoDTO;
import com.ambrosia.ambrosia.application.service.MyUserDetails;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/guardados")
@RequiredArgsConstructor
public class GuardadoController {

    private final GuardadoService guardadoService;

    @PostMapping
    public ResponseEntity<GuardadoDTO> guardar(@Valid @RequestBody CrearGuardadoRequest request) {
        UUID usuarioId = getAuthenticatedUserId();
        return ResponseEntity.ok(guardadoService.guardar(usuarioId, request));
    }

    @GetMapping
    public ResponseEntity<Page<GuardadoDTO>> listar(
            @PageableDefault(size = 10) Pageable pageable) {
        UUID usuarioId = getAuthenticatedUserId();
        return ResponseEntity.ok(guardadoService.listarPorUsuario(usuarioId, pageable));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable UUID id) {
        UUID usuarioId = getAuthenticatedUserId();
        guardadoService.eliminar(usuarioId, id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/item")
    public ResponseEntity<Void> eliminarPorItem(
            @RequestParam Guardado.TipoContenido tipo,
            @RequestParam UUID itemId) {
        UUID usuarioId = getAuthenticatedUserId();
        guardadoService.eliminarPorItem(usuarioId, tipo, itemId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/check")
    public ResponseEntity<Boolean> verificarGuardado(
            @RequestParam Guardado.TipoContenido tipo,
            @RequestParam UUID itemId) {
        UUID usuarioId = getAuthenticatedUserId();
        return ResponseEntity.ok(guardadoService.verificarGuardado(usuarioId, tipo, itemId));
    }

    private UUID getAuthenticatedUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof MyUserDetails) {
            return ((MyUserDetails) authentication.getPrincipal()).getId();
        }
        throw new RuntimeException("Usuario no autenticado");
    }
}
