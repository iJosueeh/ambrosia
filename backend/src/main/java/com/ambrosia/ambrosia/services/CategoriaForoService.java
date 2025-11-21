package com.ambrosia.ambrosia.services;

import com.ambrosia.ambrosia.models.CategoriaForo;
import com.ambrosia.ambrosia.models.dto.CategoriaForoDTO;
import com.ambrosia.ambrosia.models.dto.ForoDTO;
import com.ambrosia.ambrosia.repository.CategoriaForoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CategoriaForoService {

    @Autowired
    private CategoriaForoRepository categoriaForoRepository;

    @Autowired
    private ForoService foroService;

    public List<CategoriaForo> getAllCategoriasForo() {
        return categoriaForoRepository.findAll();
    }

    public Optional<CategoriaForo> getCategoriaForoById(Long id) {
        return categoriaForoRepository.findById(id);
    }

    public CategoriaForo createCategoriaForo(CategoriaForo categoriaForo) {
        return categoriaForoRepository.save(categoriaForo);
    }

    public CategoriaForo updateCategoriaForo(Long id, CategoriaForo categoriaForoDetails) {
        CategoriaForo categoriaForo = categoriaForoRepository.findById(id).orElseThrow(() -> new RuntimeException("Categoría de foro no encontrada"));
        categoriaForo.setTitulo(categoriaForoDetails.getTitulo());
        categoriaForo.setDescripcion(categoriaForoDetails.getDescripcion());
        return categoriaForoRepository.save(categoriaForo);
    }

    public void deleteCategoriaForo(Long id) {
        categoriaForoRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<CategoriaForoDTO> getAllCategoriasForoDTO() {
        return categoriaForoRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Optional<CategoriaForoDTO> getCategoriaForoDTOById(Long id) {
        return categoriaForoRepository.findById(id)
                .map(this::convertToDTO);
    }

    private CategoriaForoDTO convertToDTO(CategoriaForo categoriaForo) {
        List<ForoDTO> foroDTOs = categoriaForo.getForos().stream()
                .map(foroService::convertToDTO)
                .collect(Collectors.toList());

        return CategoriaForoDTO.builder()
                .id(categoriaForo.getId())
                .titulo(categoriaForo.getTitulo())
                .descripcion(categoriaForo.getDescripcion())
                .foros(foroDTOs)
                .build();
    }
}