package com.ambrosia.ambrosia.controllers;

import com.ambrosia.ambrosia.models.dto.UsuarioDTO;
import com.ambrosia.ambrosia.services.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<UsuarioDTO> obtenerPorCorreo(@PathVariable String correo) {
        return ResponseEntity.ok(usuarioService.buscarPorCorreo(correo));
    }

    @GetMapping("/exportar")
    public ResponseEntity<InputStreamResource> exportarUsuarios() {
        java.io.ByteArrayInputStream in = usuarioService.exportUsersToExcel();

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=usuarios.xlsx");

        return ResponseEntity
                .ok()
                .headers(headers)
                .contentType(org.springframework.http.MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(new InputStreamResource(in));
    }
}