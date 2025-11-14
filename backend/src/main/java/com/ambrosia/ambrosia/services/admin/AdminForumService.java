package com.ambrosia.ambrosia.services.admin;

import com.ambrosia.ambrosia.models.Comentario;
import com.ambrosia.ambrosia.models.Foro;
import com.ambrosia.ambrosia.models.dto.CommentAdminDTO;
import com.ambrosia.ambrosia.models.dto.ForumAdminDTO;
import com.ambrosia.ambrosia.repository.ComentarioRepository;
import com.ambrosia.ambrosia.repository.ForoRepository;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminForumService {

    private final ForoRepository foroRepository;
    private final ComentarioRepository comentarioRepository;

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

    public ForumAdminDTO getForumById(Long id) {
        Foro forum = foroRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Forum topic not found with id: " + id));
        return mapToForumAdminDTO(forum);
    }

    public ForumAdminDTO updateForumStatus(Long id, String newStatus) {
        Foro forum = foroRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Forum topic not found with id: " + id));
        forum.setStatus(newStatus.toUpperCase());
        Foro updatedForum = foroRepository.save(forum);
        return mapToForumAdminDTO(updatedForum);
    }

    public void deleteForum(Long id) {
        if (!foroRepository.existsById(id)) {
            throw new RuntimeException("Forum topic not found with id: " + id);
        }
        foroRepository.deleteById(id);
    }

    private ForumAdminDTO mapToForumAdminDTO(Foro forum) {
        return ForumAdminDTO.builder()
                .id(forum.getId())
                .titulo(forum.getTitulo())
                .autorNombre(forum.getAutor() != null ? forum.getAutor().getNombre() : "N/A")
                .categoriaForoNombre(forum.getCategoriaForo() != null ? forum.getCategoriaForo().getTitulo() : "N/A")
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

    public CommentAdminDTO getCommentById(Long id) {
        Comentario comment = comentarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comment not found with id: " + id));
        return mapToCommentAdminDTO(comment);
    }

    public CommentAdminDTO updateCommentStatus(Long id, String newStatus) {
        Comentario comment = comentarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comment not found with id: " + id));
        comment.setStatus(newStatus.toUpperCase());
        Comentario updatedComment = comentarioRepository.save(comment);
        return mapToCommentAdminDTO(updatedComment);
    }

    public void deleteComment(Long id) {
        if (!comentarioRepository.existsById(id)) {
            throw new RuntimeException("Comment not found with id: " + id);
        }
        comentarioRepository.deleteById(id);
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
