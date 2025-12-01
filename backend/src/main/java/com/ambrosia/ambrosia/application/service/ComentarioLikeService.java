package com.ambrosia.ambrosia.application.service;

import com.ambrosia.ambrosia.domain.model.Comentario;
import com.ambrosia.ambrosia.domain.model.ComentarioLike;
import com.ambrosia.ambrosia.domain.model.Usuario;
import com.ambrosia.ambrosia.infrastructure.adapter.out.persistence.SpringDataComentarioLikeRepository;
import com.ambrosia.ambrosia.infrastructure.adapter.out.persistence.SpringDataComentarioRepository;
import com.ambrosia.ambrosia.infrastructure.adapter.out.persistence.SpringDataUsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ComentarioLikeService {

    private static final Logger logger = LoggerFactory.getLogger(ComentarioLikeService.class);

    private final SpringDataComentarioLikeRepository likeRepository;
    private final SpringDataComentarioRepository comentarioRepository;
    private final SpringDataUsuarioRepository usuarioRepository;

    /**
     * Toggle like: si el usuario ya dio like, lo elimina; si no, lo crea
     * 
     * @return true si se agregó like, false si se eliminó
     */
    @Transactional
    public boolean toggleLike(UUID comentarioId, UUID usuarioId) {
        logger.info("Toggle like - Comentario: {}, Usuario: {}", comentarioId, usuarioId);

        // Validar que el comentario existe
        Comentario comentario = comentarioRepository.findById(comentarioId)
                .orElseThrow(() -> new RuntimeException("Comentario no encontrado con ID: " + comentarioId));

        // Validar que el usuario existe
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + usuarioId));

        // Verificar si ya existe el like
        if (likeRepository.existsByComentarioIdAndUsuarioId(comentarioId, usuarioId)) {
            // Si existe, eliminarlo (unlike)
            likeRepository.deleteByComentarioIdAndUsuarioId(comentarioId, usuarioId);
            logger.info("Like eliminado - Comentario: {}, Usuario: {}", comentarioId, usuarioId);
            return false;
        } else {
            // Si no existe, crearlo
            ComentarioLike like = ComentarioLike.builder()
                    .comentario(comentario)
                    .usuario(usuario)
                    .build();
            likeRepository.save(like);
            logger.info("Like agregado - Comentario: {}, Usuario: {}", comentarioId, usuarioId);
            return true;
        }
    }

    /**
     * Verifica si un usuario ha dado like a un comentario
     */
    @Transactional(readOnly = true)
    public boolean hasUserLiked(UUID comentarioId, UUID usuarioId) {
        return likeRepository.existsByComentarioIdAndUsuarioId(comentarioId, usuarioId);
    }

    /**
     * Obtiene el total de likes de un comentario
     */
    @Transactional(readOnly = true)
    public long getLikesCount(UUID comentarioId) {
        return likeRepository.countByComentarioId(comentarioId);
    }
}
