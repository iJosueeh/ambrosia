package com.ambrosia.ambrosia.application.service;

import com.ambrosia.ambrosia.application.port.in.comentario.*;
import com.ambrosia.ambrosia.domain.model.Comentario;
import com.ambrosia.ambrosia.domain.model.Foro;
import com.ambrosia.ambrosia.domain.model.Usuario;
import com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto.ComentarioDTO;
import com.ambrosia.ambrosia.domain.repository.ComentarioRepositoryPort;
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
public class ComentarioService implements
        CrearComentarioUseCase,
        ListarComentariosUseCase {

    private static final Logger logger = LoggerFactory.getLogger(ComentarioService.class);

    private final ComentarioRepositoryPort comentarioRepository;
    private final UsuarioRepositoryPort usuarioRepository;
    private final ForoRepositoryPort foroRepository;
    private final ComentarioLikeService likeService;

    @Override
    @Transactional
    public ComentarioDTO crear(CrearComentarioCommand command) {
        logger.info("Creando comentario en foro: {}", command.getForoId());

        Usuario autor = usuarioRepository.findById(command.getAutorId())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + command.getAutorId()));

        Foro foro = foroRepository.findById(command.getForoId())
                .orElseThrow(() -> new RuntimeException("Foro no encontrado con ID: " + command.getForoId()));

        Comentario comentario = Comentario.builder()
                .contenido(command.getContenido())
                .autor(autor)
                .foro(foro)
                .fechaCreacion(LocalDateTime.now())
                .build();

        Comentario comentarioGuardado = comentarioRepository.save(comentario);
        return convertToDTO(comentarioGuardado);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ComentarioDTO> listarPorForo(UUID foroId, Pageable pageable) {
        logger.info("Listando comentarios del foro: {}", foroId);

        List<Comentario> comentarios = comentarioRepository.findByForoId(foroId);
        List<ComentarioDTO> comentarioDTOs = comentarios.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());

        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), comentarioDTOs.size());

        return new PageImpl<>(
                comentarioDTOs.subList(start, end),
                pageable,
                comentarioDTOs.size());
    }

    // ========== MÉTODOS ADICIONALES ==========

    public List<Comentario> getAllComentarios() {
        return comentarioRepository.findAll();
    }

    public Optional<Comentario> getComentarioById(UUID id) {
        return comentarioRepository.findById(id);
    }

    public Comentario createComentario(Comentario comentario) {
        return comentarioRepository.save(comentario);
    }

    public Comentario updateComentario(UUID id, Comentario comentarioDetails) {
        Comentario comentario = comentarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comentario no encontrado"));
        comentario.setContenido(comentarioDetails.getContenido());
        comentario.setFechaCreacion(comentarioDetails.getFechaCreacion());
        comentario.setAutor(comentarioDetails.getAutor());
        comentario.setForo(comentarioDetails.getForo());
        comentario.setModerador(comentarioDetails.getModerador());
        return comentarioRepository.save(comentario);
    }

    public void deleteComentario(UUID id) {
        comentarioRepository.findById(id).ifPresent(comentarioRepository::delete);
    }

    @Transactional(readOnly = true)
    public List<ComentarioDTO> getComentariosDTOByForoId(UUID foroId) {
        return comentarioRepository.findByForoId(foroId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public ComentarioDTO convertToDTO(Comentario comentario) {
        return ComentarioDTO.builder()
                .id(comentario.getId())
                .contenido(comentario.getContenido())
                .fechaCreacion(comentario.getFechaCreacion())
                .autorId(comentario.getAutor() != null ? comentario.getAutor().getId() : null)
                .autorNombre(comentario.getAutor() != null ? comentario.getAutor().getNombre() : "Anónimo")
                .foroId(comentario.getForo() != null ? comentario.getForo().getId() : null)
                .status(comentario.getStatus())
                .likesCount(likeService.getLikesCount(comentario.getId()))
                .build();
    }
}
