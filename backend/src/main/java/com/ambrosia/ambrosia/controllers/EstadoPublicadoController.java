package com.ambrosia.ambrosia.controllers;

import com.ambrosia.ambrosia.models.EstadoPublicado;
import com.ambrosia.ambrosia.repository.EstadoPublicadoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/resource-statuses")
@RequiredArgsConstructor
public class EstadoPublicadoController {

    private final EstadoPublicadoRepository estadoPublicadoRepository;

    @GetMapping
    public ResponseEntity<List<EstadoPublicado>> getAllStatuses() {
        return ResponseEntity.ok(estadoPublicadoRepository.findAll());
    }
}
