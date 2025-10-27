package com.ambrosia.ambrosia.services;

import com.ambrosia.ambrosia.models.Foro;
import com.ambrosia.ambrosia.models.dto.ForoDTO;
import com.ambrosia.ambrosia.repository.ForoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ForoService {

    @Autowired
    private ForoRepository foroRepository;

    public List<Foro> getAllForos() {
        return foroRepository.findAll();
    }

    public Optional<Foro> getForoById(Long id) {
        return foroRepository.findById(id);
    }

    public Foro createForo(Foro foro) {
        return foroRepository.save(foro);
    }

    public Foro updateForo(Long id, Foro foroDetails) {
        Foro foro = foroRepository.findById(id).orElseThrow(() -> new RuntimeException("Foro no encontrado"));
        foro.setTitulo(foroDetails.getTitulo());
        foro.setDescripcion(foroDetails.getDescripcion());
        foro.setAutor(foroDetails.getAutor());
        foro.setCategoriaForo(foroDetails.getCategoriaForo());
        return foroRepository.save(foro);
    }

    public void deleteForo(Long id) {
        foroRepository.deleteById(id);
    }

    public List<Foro> getForosByCategoriaForoId(Long categoriaForoId) {
        return foroRepository.findByCategoriaForoId(categoriaForoId);
    }

    public List<Foro> getForosByAutorId(Long autorId) {
        return foroRepository.findByAutorId(autorId);
    }

    @Transactional(readOnly = true)
    public Optional<ForoDTO> getForoDTOById(Long id) {
        return foroRepository.findById(id)
                .map(this::convertToDTO);
    }

    public ForoDTO convertToDTO(Foro foro) {
        return ForoDTO.builder()
                .id(foro.getId())
                .titulo(foro.getTitulo())
                .descripcion(foro.getDescripcion())
                .autorId(foro.getAutor() != null ? foro.getAutor().getId() : null)
                .autorNombre(foro.getAutor() != null ? foro.getAutor().getNombre() : "Anónimo")
                .fechaCreacion(foro.getFechaCreacion())
                .numeroComentarios(foro.getComentarios() != null ? foro.getComentarios().size() : 0)
                .build();
    }

    @Transactional(readOnly = true)
    public List<ForoDTO> getForosDTOByCategoriaForoId(Long categoriaForoId) {
        return foroRepository.findByCategoriaForoId(categoriaForoId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
}
