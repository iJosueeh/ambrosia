package com.ambrosia.ambrosia.services;

import com.ambrosia.ambrosia.models.Comentario;
import com.ambrosia.ambrosia.models.dto.ComentarioDTO;
import com.ambrosia.ambrosia.repository.ComentarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ComentarioService {

    @Autowired
    private ComentarioRepository comentarioRepository;

    public List<Comentario> getAllComentarios() {
        return comentarioRepository.findAll();
    }

    public Optional<Comentario> getComentarioById(Long id) {
        return comentarioRepository.findById(id);
    }

    public Comentario createComentario(Comentario comentario) {
        return comentarioRepository.save(comentario);
    }

    public Comentario updateComentario(Long id, Comentario comentarioDetails) {
        Comentario comentario = comentarioRepository.findById(id).orElseThrow(() -> new RuntimeException("Comentario no encontrado"));
        comentario.setContenido(comentarioDetails.getContenido());
        comentario.setFechaCreacion(comentarioDetails.getFechaCreacion());
        comentario.setAutor(comentarioDetails.getAutor());
        comentario.setForo(comentarioDetails.getForo());
        comentario.setModerador(comentarioDetails.getModerador());
        return comentarioRepository.save(comentario);
    }

    public void deleteComentario(Long id) {
        comentarioRepository.deleteById(id);
    }

    public ComentarioDTO convertToDTO(Comentario comentario) {
        return ComentarioDTO.builder()
                .id(comentario.getId())
                .contenido(comentario.getContenido())
                .fechaCreacion(comentario.getFechaCreacion())
                .autorId(comentario.getAutor() != null ? comentario.getAutor().getId() : null)
                .autorNombre(comentario.getAutor() != null ? comentario.getAutor().getNombre() : "Anónimo")
                .foroId(comentario.getForo() != null ? comentario.getForo().getId() : null)
                .build();
    }

    @Transactional(readOnly = true)
    public List<ComentarioDTO> getComentariosDTOByForoId(Long foroId) {
        // Assuming you have a method in ComentarioRepository to find by foroId
        // If not, you might need to fetch the Foro and then its comments
        // For now, let's assume we fetch the Foro and then map its comments
        return comentarioRepository.findByForoId(foroId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
}
