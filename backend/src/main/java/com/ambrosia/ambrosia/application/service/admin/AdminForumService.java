package com.ambrosia.ambrosia.application.service.admin;

import com.ambrosia.ambrosia.domain.model.Comentario;
import com.ambrosia.ambrosia.domain.model.Foro;
import com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto.CommentAdminDTO;
import com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto.ForumAdminDTO;
import com.ambrosia.ambrosia.domain.repository.ComentarioRepositoryPort;
import com.ambrosia.ambrosia.domain.repository.ForoRepositoryPort;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AdminForumService {

    private final ForoRepositoryPort foroRepository;
    private final ComentarioRepositoryPort comentarioRepository;

    // --- Forum Topics ---

    public Page<ForumAdminDTO> getAllForums(Pageable pageable, String status) {
        Specification<Foro> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (StringUtils.hasText(status) && !"ALL".equalsIgnoreCase(status)) {
                predicates.add(cb.equal(root.get("status"), status.toUpperCase()));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<Foro> forumsPage = foroRepository.findAll(spec, pageable);
        return forumsPage.map(this::mapToForumAdminDTO);
    }

    public ForumAdminDTO getForumById(UUID id) {
        Foro forum = foroRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Forum topic not found with id: " + id));
        return mapToForumAdminDTO(forum);
    }

    public ForumAdminDTO updateForumStatus(UUID id, String newStatus) {
        Foro forum = foroRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Forum topic not found with id: " + id));
        forum.setStatus(newStatus.toUpperCase());
        Foro updatedForum = foroRepository.save(forum);
        return mapToForumAdminDTO(updatedForum);
    }

    public void deleteForum(UUID id) {
        foroRepository.findById(id).ifPresent(foroRepository::delete);
    }

    private ForumAdminDTO mapToForumAdminDTO(Foro forum) {
        return ForumAdminDTO.builder()
                .id(forum.getId())
                .titulo(forum.getTitulo())
                .autorNombre(forum.getAutor() != null ? forum.getAutor().getNombre() : "N/A")
                .categoriaForoNombre(forum.getCategoriaForo() != null ? forum.getCategoriaForo().getNombre() : "N/A")
                .fechaCreacion(forum.getFechaCreacion())
                .status(forum.getStatus())
                .commentCount(forum.getComentarios().size())
                .build();
    }

    // --- Comments ---

    public Page<CommentAdminDTO> getAllComments(Pageable pageable, String status) {
        Specification<Comentario> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (StringUtils.hasText(status) && !"ALL".equalsIgnoreCase(status)) {
                predicates.add(cb.equal(root.get("status"), status.toUpperCase()));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<Comentario> commentsPage = comentarioRepository.findAll(spec, pageable);
        return commentsPage.map(this::mapToCommentAdminDTO);
    }

    public CommentAdminDTO getCommentById(UUID id) {
        Comentario comment = comentarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comment not found with id: " + id));
        return mapToCommentAdminDTO(comment);
    }

    public CommentAdminDTO updateCommentStatus(UUID id, String newStatus) {
        Comentario comment = comentarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comment not found with id: " + id));
        comment.setStatus(newStatus.toUpperCase());
        Comentario updatedComment = comentarioRepository.save(comment);
        return mapToCommentAdminDTO(updatedComment);
    }

    public void deleteComment(UUID id) {
        comentarioRepository.findById(id).ifPresent(comentarioRepository::delete);
    }

    private CommentAdminDTO mapToCommentAdminDTO(Comentario comment) {
        return CommentAdminDTO.builder()
                .id(comment.getId())
                .contenido(comment.getContenido())
                .autorNombre(comment.getAutor() != null ? comment.getAutor().getNombre() : "N/A")
                .foroId(comment.getForo() != null ? comment.getForo().getId() : null)
                .foroTitulo(comment.getForo() != null ? comment.getForo().getTitulo() : "N/A")
                .fechaCreacion(comment.getFechaCreacion())
                .status(comment.getStatus())
                .build();
    }
}
