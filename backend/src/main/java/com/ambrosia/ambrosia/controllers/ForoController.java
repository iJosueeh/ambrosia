package com.ambrosia.ambrosia.controllers;

import com.ambrosia.ambrosia.models.Comentario;
import com.ambrosia.ambrosia.models.Foro;
import com.ambrosia.ambrosia.models.dto.ComentarioDTO;
import com.ambrosia.ambrosia.models.dto.ForoDTO;
import com.ambrosia.ambrosia.services.ForoService;
import com.ambrosia.ambrosia.services.ComentarioService; // Assuming a ComentarioService exists or will be created
import com.ambrosia.ambrosia.models.Usuario; // Import Usuario model
import com.ambrosia.ambrosia.repository.UsuarioRepository; // Import UsuarioRepository
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/foros")
@RequiredArgsConstructor
public class ForoController {

    @Autowired
    private ForoService foroService;

    @Autowired
    private ComentarioService comentarioService; // Inject ComentarioService

    @Autowired
    private UsuarioRepository usuarioRepository; // Inject UsuarioRepository to fetch user for comment

    @GetMapping
    public List<ForoDTO> getAllForos() {
        return foroService.getAllForos().stream()
                .map(foroService::convertToDTO)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ForoDTO> getForoById(@PathVariable Long id) {
        return foroService.getForoDTOById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ForoDTO> createForo(@RequestBody Foro foro) {
        // In a real application, you would get the authenticated user here
        // For now, let's assume the autor is passed in the request body or a default user is used
        Foro createdForo = foroService.createForo(foro);
        return ResponseEntity.status(HttpStatus.CREATED).body(foroService.convertToDTO(createdForo));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ForoDTO> updateForo(@PathVariable Long id, @RequestBody Foro foroDetails) {
        try {
            Foro updatedForo = foroService.updateForo(id, foroDetails);
            return ResponseEntity.ok(foroService.convertToDTO(updatedForo));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteForo(@PathVariable Long id) {
        try {
            foroService.deleteForo(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/categoria/{categoriaForoId}")
    public List<ForoDTO> getForosByCategoriaForoId(@PathVariable Long categoriaForoId) {
        return foroService.getForosDTOByCategoriaForoId(categoriaForoId);
    }

    @GetMapping("/autor/{autorId}")
    public List<ForoDTO> getForosByAutorId(@PathVariable Long autorId) {
        return foroService.getForosByAutorId(autorId).stream()
                .map(foroService::convertToDTO)
                .collect(Collectors.toList());
    }

    @GetMapping("/{foroId}/comentarios")
    public List<ComentarioDTO> getComentariosByForoId(@PathVariable Long foroId) {
        return comentarioService.getComentariosDTOByForoId(foroId);
    }

    @PostMapping("/{foroId}/comentarios")
    public ResponseEntity<Comentario> addComentarioToForo(@PathVariable Long foroId, @RequestBody Comentario comentario) {
        Foro foro = foroService.getForoById(foroId).orElseThrow(() -> new RuntimeException("Foro no encontrado"));

        // Fetch the actual User entity if only autorId is provided in the request
        if (comentario.getAutor() != null && comentario.getAutor().getId() != null) {
            Usuario autor = usuarioRepository.findById(comentario.getAutor().getId())
                    .orElseThrow(() -> new RuntimeException("Autor no encontrado"));
            comentario.setAutor(autor);
        } else {
            // Handle case where autor is not provided or invalid
            // For now, throwing an exception or setting a default user
            throw new RuntimeException("Autor del comentario no proporcionado o inválido");
        }

        comentario.setForo(foro);
        comentario.setFechaCreacion(LocalDateTime.now());
        Comentario savedComentario = comentarioService.createComentario(comentario); // Use ComentarioService to save
        return ResponseEntity.status(HttpStatus.CREATED).body(savedComentario);
    }
}
