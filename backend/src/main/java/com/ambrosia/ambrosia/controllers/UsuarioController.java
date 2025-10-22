package com.ambrosia.ambrosia.controllers;

import com.ambrosia.ambrosia.models.dto.UsuarioDTO;
import com.ambrosia.ambrosia.services.UsuarioService;
import lombok.RequiredArgsConstructor;
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

}