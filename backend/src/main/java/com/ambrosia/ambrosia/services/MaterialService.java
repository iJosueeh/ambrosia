package com.ambrosia.ambrosia.services;

import com.ambrosia.ambrosia.models.Material;
import com.ambrosia.ambrosia.models.Profesional;
import com.ambrosia.ambrosia.models.dto.MaterialDTO;
import com.ambrosia.ambrosia.repository.MaterialRepository;
import com.ambrosia.ambrosia.repository.ProfesionalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MaterialService {

    private final MaterialRepository materialRepository;
    private final ProfesionalRepository profesionalRepository;

    public MaterialDTO createMaterial(MaterialDTO materialDTO) {
        Profesional profesional = profesionalRepository.findById(materialDTO.getProfesionalId())
                .orElseThrow(() -> new RuntimeException("Profesional no encontrado"));

        Material material = Material.builder()
                .titulo(materialDTO.getTitulo())
                .contenidoHtml(materialDTO.getContenidoHtml())
                .tipo(materialDTO.getTipo())
                .profesional(profesional)
                .build();

        Material savedMaterial = materialRepository.save(material);
        return convertToDTO(savedMaterial);
    }

    public List<MaterialDTO> getAllMaterials() {
        return materialRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<MaterialDTO> getMaterialsByProfesionalId(Long profesionalId) {
        return materialRepository.findByProfesionalId(profesionalId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Optional<MaterialDTO> getMaterialById(Long id) {
        return materialRepository.findById(id)
                .map(this::convertToDTO);
    }

    public MaterialDTO updateMaterial(Long id, MaterialDTO materialDTO) {
        Material material = materialRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Material no encontrado"));

        material.setTitulo(materialDTO.getTitulo());
        material.setContenidoHtml(materialDTO.getContenidoHtml());
        material.setTipo(materialDTO.getTipo());

        Material updatedMaterial = materialRepository.save(material);
        return convertToDTO(updatedMaterial);
    }

    public void deleteMaterial(Long id) {
        materialRepository.deleteById(id);
    }

    private MaterialDTO convertToDTO(Material material) {
        return MaterialDTO.builder()
                .id(material.getId())
                .titulo(material.getTitulo())
                .contenidoHtml(material.getContenidoHtml())
                .tipo(material.getTipo())
                .fechaCreacion(material.getFechaCreacion())
                .profesionalId(material.getProfesional().getId())
                .nombreProfesional(material.getProfesional().getUsuario().getNombre())
                .build();
    }
}
