package com.ambrosia.ambrosia.infrastructure.adapter.in.web.controller;

import com.ambrosia.ambrosia.application.port.in.usuario.*;
import com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto.UsuarioDTO;
import com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto.UsuarioDashboardDTO;
import com.ambrosia.ambrosia.application.service.UsuarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/usuarios")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioService usuarioService;

    @PostMapping("/registrar")
    public ResponseEntity<UsuarioDTO> registrar(@Valid @RequestBody RegistrarUsuarioCommand command) {
        UsuarioDTO usuario = usuarioService.registrar(command);
        return ResponseEntity.status(201).body(usuario);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioDTO> obtenerPorId(@PathVariable UUID id) {
        UsuarioDTO usuario = usuarioService.obtenerPorId(id);
        return ResponseEntity.ok(usuario);
    }

    @GetMapping("/email/{correo}")
    public ResponseEntity<UsuarioDashboardDTO> obtenerPorCorreo(@PathVariable String correo) {
        return ResponseEntity.ok(usuarioService.getUsuarioDashboardByEmail(correo));
    }

    @GetMapping
    public ResponseEntity<Page<UsuarioDTO>> listar(
            Pageable pageable,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String rol) {
        Page<UsuarioDTO> usuarios = usuarioService.listar(pageable, search, rol);
        return ResponseEntity.ok(usuarios);
    }

    @GetMapping("/admin")
    public ResponseEntity<List<UsuarioDTO>> getAllUsersForAdmin() {
        List<UsuarioDTO> usuarios = usuarioService.findAllUsersForAdmin();
        return ResponseEntity.ok(usuarios);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UsuarioDTO> actualizar(
            @PathVariable UUID id,
            @Valid @RequestBody ActualizarUsuarioCommand command) {
        UsuarioDTO usuario = usuarioService.actualizar(id, command);
        return ResponseEntity.ok(usuario);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable UUID id) {
        usuarioService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/cambiar-contrasena")
    public ResponseEntity<Void> cambiarContrasena(
            @PathVariable UUID id,
            @Valid @RequestBody CambiarContrasenaCommand command) {
        usuarioService.cambiarContrasena(id, command);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/exportar")
    public ResponseEntity<InputStreamResource> exportarUsuarios(@RequestParam(defaultValue = "xlsx") String format) {
        ByteArrayInputStream in = usuarioService.exportUsers(format);

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=usuarios." + usuarioService.getFileExtension(format));

        return ResponseEntity
                .ok()
                .headers(headers)
                .contentType(org.springframework.http.MediaType.parseMediaType(usuarioService.getContentType(format)))
                .body(new InputStreamResource(in));
    }
}
