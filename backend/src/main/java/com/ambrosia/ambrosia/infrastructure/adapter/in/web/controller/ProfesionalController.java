package com.ambrosia.ambrosia.infrastructure.adapter.in.web.controller;

import com.ambrosia.ambrosia.application.port.in.profesional.RegistrarProfesionalCommand;
import com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto.ProfesionalDTO;
import com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto.ProfesionalEstadisticasDTO;
import com.ambrosia.ambrosia.application.service.ProfesionalService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/profesionales")
@RequiredArgsConstructor
public class ProfesionalController {

    private final ProfesionalService profesionalService;

    @PostMapping
    public ResponseEntity<ProfesionalDTO> createProfesional(@Valid @RequestBody RegistrarProfesionalCommand command) {
        ProfesionalDTO createdProfesional = profesionalService.registrar(command);
        return new ResponseEntity<>(createdProfesional, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<ProfesionalDTO>> getAllProfesionales() {
        List<ProfesionalDTO> profesionales = profesionalService.getAllProfesionales();
        return ResponseEntity.ok(profesionales);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProfesionalDTO> getProfesionalById(@PathVariable UUID id) {
        ProfesionalDTO profesional = profesionalService.obtenerPorId(id);
        return ResponseEntity.ok(profesional);
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<ProfesionalDTO> getProfesionalByUsuarioId(@PathVariable UUID usuarioId) {
        ProfesionalDTO profesional = profesionalService.obtenerPorUsuarioId(usuarioId);
        return ResponseEntity.ok(profesional);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProfesionalDTO> updateProfesional(
            @PathVariable UUID id,
            @RequestBody ProfesionalDTO profesionalDTO) {
        ProfesionalDTO updatedProfesional = profesionalService.updateProfesional(id, profesionalDTO);
        return ResponseEntity.ok(updatedProfesional);
    }

    @PutMapping("/{id}/profile-image-url")
    public ResponseEntity<ProfesionalDTO> updateProfesionalProfileImageUrl(
            @PathVariable UUID id,
            @RequestBody String profileImageUrl) {
        ProfesionalDTO profesionalDTO = profesionalService.obtenerPorId(id);
        profesionalDTO.setProfileImageUrl(profileImageUrl);
        ProfesionalDTO updatedProfesional = profesionalService.updateProfesional(id, profesionalDTO);
        return ResponseEntity.ok(updatedProfesional);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProfesional(@PathVariable UUID id) {
        profesionalService.deleteProfesional(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/upload-profile-picture")
    public ResponseEntity<ProfesionalDTO> uploadProfilePicture(
            @PathVariable UUID id,
            @RequestParam("file") MultipartFile file) {
        ProfesionalDTO updatedProfesional = profesionalService.uploadProfilePicture(id, file);
        return ResponseEntity.ok(updatedProfesional);
    }

    @PutMapping("/{id}/delete-profile-picture")
    public ResponseEntity<Void> deleteProfilePicture(@PathVariable UUID id) {
        profesionalService.deleteProfilePicture(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/statistics")
    public ResponseEntity<ProfesionalEstadisticasDTO> getProfesionalStatistics(@PathVariable UUID id) {
        ProfesionalEstadisticasDTO statistics = profesionalService.getProfesionalStatistics(id);
        return ResponseEntity.ok(statistics);
    }

    @GetMapping("/{id}/statistics/export/excel")
    public ResponseEntity<org.springframework.core.io.Resource> exportStatisticsToExcel(@PathVariable UUID id) {
        ByteArrayInputStream in = profesionalService.exportStatisticsToExcel(id);
        HttpHeaders headers = new org.springframework.http.HttpHeaders();
        headers.add(org.springframework.http.HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=estadisticas.xlsx");

        return ResponseEntity
                .ok()
                .headers(headers)
                .body(new org.springframework.core.io.InputStreamResource(in));
    }
}
