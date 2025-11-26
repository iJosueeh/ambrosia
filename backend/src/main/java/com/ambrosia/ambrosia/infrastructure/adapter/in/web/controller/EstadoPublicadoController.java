package com.ambrosia.ambrosia.infrastructure.adapter.in.web.controller;

import com.ambrosia.ambrosia.domain.model.EstadoPublicado;
import com.ambrosia.ambrosia.domain.repository.EstadoPublicadoRepositoryPort;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/resource-statuses")
@RequiredArgsConstructor
public class EstadoPublicadoController {

    private final EstadoPublicadoRepositoryPort estadoPublicadoRepository;

    @GetMapping
    public ResponseEntity<List<EstadoPublicado>> getAllStatuses() {
        return ResponseEntity.ok(estadoPublicadoRepository.findAll());
    }
}
