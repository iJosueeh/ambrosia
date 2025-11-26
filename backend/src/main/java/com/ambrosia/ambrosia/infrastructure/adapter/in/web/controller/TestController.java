package com.ambrosia.ambrosia.infrastructure.adapter.in.web.controller;

import com.ambrosia.ambrosia.application.port.in.test.GuardarResultadoTestCommand;
import com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto.ResultadoDTO;
import com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto.TestDTO;
import com.ambrosia.ambrosia.application.service.TestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/tests")
@RequiredArgsConstructor
public class TestController {

    private final TestService testService;

    @GetMapping
    public ResponseEntity<List<TestDTO>> listarTests() {
        return ResponseEntity.ok(testService.listarTodos());
    }

    @PostMapping("/resultado")
    public ResponseEntity<Void> guardarResultado(@Valid @RequestBody GuardarResultadoTestCommand command) {
        testService.guardar(command);
        return ResponseEntity.status(201).build();
    }

    // Método legacy para compatibilidad
    @PostMapping("/resultado/legacy")
    public ResponseEntity<Void> guardarResultadoLegacy(@RequestBody ResultadoDTO dto) {
        testService.guardarResultado(dto);
        return ResponseEntity.status(201).build();
    }

    @GetMapping("/admin")
    public ResponseEntity<String> adminAccessTest() {
        return ResponseEntity.ok("Admin access granted");
    }
}
