package com.ambrosia.ambrosia.controllers;

import com.ambrosia.ambrosia.models.dto.ProfesionalDTO;
import com.ambrosia.ambrosia.models.dto.ProfesionalEstadisticasDTO;
import com.ambrosia.ambrosia.services.ProfesionalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/profesionales")
@RequiredArgsConstructor
public class ProfesionalController {

    private final ProfesionalService profesionalService;

    @PostMapping
    public ResponseEntity<ProfesionalDTO> createProfesional(@RequestBody ProfesionalDTO profesionalDTO) {
        ProfesionalDTO createdProfesional = profesionalService.createProfesional(profesionalDTO);
        return new ResponseEntity<>(createdProfesional, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<ProfesionalDTO>> getAllProfesionales() {
        List<ProfesionalDTO> profesionales = profesionalService.getAllProfesionales();
        return ResponseEntity.ok(profesionales);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProfesionalDTO> getProfesionalById(@PathVariable Long id) {
        return profesionalService.getProfesionalById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProfesionalDTO> updateProfesional(@PathVariable Long id, @RequestBody ProfesionalDTO profesionalDTO) {
        ProfesionalDTO updatedProfesional = profesionalService.updateProfesional(id, profesionalDTO);
        return ResponseEntity.ok(updatedProfesional);
    }

    @PutMapping("/{id}/profile-image-url")
    public ResponseEntity<ProfesionalDTO> updateProfesionalProfileImageUrl(@PathVariable Long id, @RequestBody String profileImageUrl) {
        ProfesionalDTO profesionalDTO = profesionalService.getProfesionalById(id)
                .orElseThrow(() -> new RuntimeException("Profesional no encontrado"));
        profesionalDTO.setProfileImageUrl(profileImageUrl);
        ProfesionalDTO updatedProfesional = profesionalService.updateProfesional(id, profesionalDTO);
        return ResponseEntity.ok(updatedProfesional);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProfesional(@PathVariable Long id) {
        profesionalService.deleteProfesional(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/upload-profile-picture")
    public ResponseEntity<ProfesionalDTO> uploadProfilePicture(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) {
        ProfesionalDTO updatedProfesional = profesionalService.uploadProfilePicture(id, file);
        return ResponseEntity.ok(updatedProfesional);
    }

    @PutMapping("/{id}/delete-profile-picture")
    public ResponseEntity<Void> deleteProfilePicture(@PathVariable Long id) {
        profesionalService.deleteProfilePicture(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/statistics")
    public ResponseEntity<ProfesionalEstadisticasDTO> getProfesionalStatistics(@PathVariable Long id) {
        ProfesionalEstadisticasDTO statistics = profesionalService.getProfesionalStatistics(id);
        return ResponseEntity.ok(statistics);
    }

    @GetMapping("/{id}/statistics/export/excel")
    public ResponseEntity<org.springframework.core.io.Resource> exportStatisticsToExcel(@PathVariable Long id) {
        java.io.ByteArrayInputStream in = profesionalService.exportStatisticsToExcel(id);
        org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
        headers.add(org.springframework.http.HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=estadisticas.xlsx");

        return ResponseEntity
                .ok()
                .headers(headers)
                .body(new org.springframework.core.io.InputStreamResource(in));
    }
}
