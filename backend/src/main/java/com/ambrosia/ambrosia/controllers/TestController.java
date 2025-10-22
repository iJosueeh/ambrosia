package com.ambrosia.ambrosia.controllers;

import com.ambrosia.ambrosia.models.dto.ResultadoDTO;
import com.ambrosia.ambrosia.models.dto.TestDTO;
import com.ambrosia.ambrosia.services.TestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tests")
@RequiredArgsConstructor
public class TestController {

    private final TestService testService;

    @GetMapping
    public ResponseEntity<List<TestDTO>> listarTests() {
        return ResponseEntity.ok(testService.listarTests());
    }

    @PostMapping("/resultado")
    public ResponseEntity<Void> guardarResultado(@RequestBody ResultadoDTO dto) {
        testService.guardarResultado(dto);
        return ResponseEntity.status(201).build();
    }

}