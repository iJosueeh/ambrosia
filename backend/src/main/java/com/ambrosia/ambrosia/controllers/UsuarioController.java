package com.ambrosia.ambrosia.controllers;

import com.ambrosia.ambrosia.models.dto.UsuarioDTO;
import com.ambrosia.ambrosia.models.dto.UsuarioDashboardDTO;
import com.ambrosia.ambrosia.services.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;
import java.util.List; // ¡Importante: Añadir esta importación!

@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioService usuarioService;

    @PostMapping("/registrar")
    public ResponseEntity<UsuarioDTO> registrar(@RequestBody UsuarioDTO usuario) {
        return ResponseEntity.status(201).body(usuarioService.registrar(usuario));
    }

    @GetMapping("/{correo}")
    public ResponseEntity<UsuarioDashboardDTO> obtenerPorCorreo(@PathVariable String correo) {
        return ResponseEntity.ok(usuarioService.getUsuarioDashboardByEmail(correo));
    }

    /**
     * Endpoint para obtener la lista de todos los usuarios (solo para ADMIN).
     * URL: /api/usuarios/admin
     */
    @GetMapping("/admin")
    public ResponseEntity<List<UsuarioDTO>> getAllUsersForAdmin() {
        // Llama al método del servicio que busca todos los usuarios y verifica el rol ADMIN
        List<UsuarioDTO> usuarios = usuarioService.findAllUsersForAdmin();
        return ResponseEntity.ok(usuarios);
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