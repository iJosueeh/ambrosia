package com.ambrosia.ambrosia.application.service;

import com.ambrosia.ambrosia.domain.model.CategoriaForo;
import com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto.CategoriaForoDTO;
import com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto.ForoDTO;
import com.ambrosia.ambrosia.domain.repository.CategoriaForoRepositoryPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoriaForoService {

    private final CategoriaForoRepositoryPort categoriaForoRepository;
    private final ForoService foroService;

    public List<CategoriaForo> getAllCategoriasForo() {
        return categoriaForoRepository.findAll();
    }

    public Optional<CategoriaForo> getCategoriaForoById(UUID id) {
        return categoriaForoRepository.findById(id);
    }

    public CategoriaForo createCategoriaForo(CategoriaForo categoriaForo) {
        return categoriaForoRepository.save(categoriaForo);
    }

    public CategoriaForo updateCategoriaForo(UUID id, CategoriaForo categoriaForoDetails) {
        CategoriaForo categoriaForo = categoriaForoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoría de foro no encontrada"));
        categoriaForo.setNombre(categoriaForoDetails.getNombre());
        categoriaForo.setDescripcion(categoriaForoDetails.getDescripcion());
        return categoriaForoRepository.save(categoriaForo);
    }

    public void deleteCategoriaForo(UUID id) {
        categoriaForoRepository.findById(id).ifPresent(categoriaForoRepository::delete);
    }

    @Transactional(readOnly = true)
    public List<CategoriaForoDTO> getAllCategoriasForoDTO() {
        return categoriaForoRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Optional<CategoriaForoDTO> getCategoriaForoDTOById(UUID id) {
        return categoriaForoRepository.findById(id)
                .map(this::convertToDTO);
    }

    private CategoriaForoDTO convertToDTO(CategoriaForo categoriaForo) {
        List<ForoDTO> foroDTOs = categoriaForo.getForos().stream()
                .map(foroService::convertToDTO)
                .collect(Collectors.toList());

        return CategoriaForoDTO.builder()
                .id(categoriaForo.getId())
                .titulo(categoriaForo.getNombre())
                .descripcion(categoriaForo.getDescripcion())
                .foros(foroDTOs)
                .build();
    }
}
