package com.ambrosia.ambrosia.application.service;

import com.ambrosia.ambrosia.application.port.in.foro.*;
import com.ambrosia.ambrosia.domain.model.CategoriaForo;
import com.ambrosia.ambrosia.domain.model.Foro;
import com.ambrosia.ambrosia.domain.model.Usuario;
import com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto.ForoDTO;
import com.ambrosia.ambrosia.domain.repository.CategoriaForoRepositoryPort;
import com.ambrosia.ambrosia.domain.repository.ForoRepositoryPort;
import com.ambrosia.ambrosia.domain.repository.UsuarioRepositoryPort;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ForoService implements
        CrearForoUseCase,
        ListarForosUseCase {

    private static final Logger logger = LoggerFactory.getLogger(ForoService.class);

    private final ForoRepositoryPort foroRepository;
    private final UsuarioRepositoryPort usuarioRepository;
    private final CategoriaForoRepositoryPort categoriaForoRepository;

    @Override
    @Transactional
    public ForoDTO crear(CrearForoCommand command) {
        logger.info("Creando foro: {}", command.getTitulo());

        Usuario autor = usuarioRepository.findById(command.getAutorId())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + command.getAutorId()));

        CategoriaForo categoria = categoriaForoRepository.findById(command.getCategoriaForoId())
                .orElseThrow(
                        () -> new RuntimeException("Categoría no encontrada con ID: " + command.getCategoriaForoId()));

        Foro foro = Foro.builder()
                .titulo(command.getTitulo())
                .descripcion(command.getDescripcion())
                .autor(autor)
                .categoriaForo(categoria)
                .fechaCreacion(LocalDateTime.now())
                .build();

        Foro foroGuardado = foroRepository.save(foro);
        return convertToDTO(foroGuardado);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ForoDTO> listar(Pageable pageable, String search, UUID categoriaId) {
        logger.info("Listando foros - search: {}, categoriaId: {}", search, categoriaId);

        List<Foro> foros;
        if (categoriaId != null) {
            foros = foroRepository.findByCategoriaForoId(categoriaId);
        } else {
            foros = foroRepository.findAll();
        }

        List<ForoDTO> foroDTOs = foros.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());

        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), foroDTOs.size());

        return new PageImpl<>(
                foroDTOs.subList(start, end),
                pageable,
                foroDTOs.size());
    }

    // ========== MÉTODOS ADICIONALES ==========

    public List<Foro> getAllForos() {
        return foroRepository.findAll();
    }

    public Optional<Foro> getForoById(UUID id) {
        return foroRepository.findById(id);
    }

    public Foro createForo(Foro foro) {
        return foroRepository.save(foro);
    }

    public Foro updateForo(UUID id, Foro foroDetails) {
        Foro foro = foroRepository.findById(id).orElseThrow(() -> new RuntimeException("Foro no encontrado"));
        foro.setTitulo(foroDetails.getTitulo());
        foro.setDescripcion(foroDetails.getDescripcion());
        foro.setAutor(foroDetails.getAutor());
        foro.setCategoriaForo(foroDetails.getCategoriaForo());
        return foroRepository.save(foro);
    }

    public void deleteForo(UUID id) {
        foroRepository.findById(id).ifPresent(foroRepository::delete);
    }

    public List<Foro> getForosByCategoriaForoId(UUID categoriaForoId) {
        return foroRepository.findByCategoriaForoId(categoriaForoId);
    }

    public List<Foro> getForosByAutorId(UUID autorId) {
        return foroRepository.findByAutorId(autorId);
    }

    @Transactional(readOnly = true)
    public Optional<ForoDTO> getForoDTOById(UUID id) {
        return foroRepository.findById(id)
                .map(this::convertToDTO);
    }

    @Transactional(readOnly = true)
    public List<ForoDTO> getForosDTOByCategoriaForoId(UUID categoriaForoId) {
        return foroRepository.findByCategoriaForoId(categoriaForoId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
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
}
