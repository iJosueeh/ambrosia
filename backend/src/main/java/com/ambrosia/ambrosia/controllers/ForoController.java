package com.ambrosia.ambrosia.controllers;

import com.ambrosia.ambrosia.models.dto.ForoDTO;
import com.ambrosia.ambrosia.services.ForoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/foros")
@RequiredArgsConstructor
public class ForoController {

    private final ForoService foroService;

    @PostMapping
    public ResponseEntity<ForoDTO> crear(@RequestBody ForoDTO dto) {
        ForoDTO foroCreado = foroService.crearForo(dto);
        return ResponseEntity.status(201).body(foroCreado);
    }

    @GetMapping
    public ResponseEntity<List<ForoDTO>> listar() {
        return ResponseEntity.ok(foroService.listarForos());
    }

}
