package com.ambrosia.ambrosia.infrastructure.adapter.out.persistence;

import com.ambrosia.ambrosia.domain.model.Comentario;
import com.ambrosia.ambrosia.domain.repository.ComentarioRepositoryPort;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class ComentarioRepositoryAdapter implements ComentarioRepositoryPort {

    private final SpringDataComentarioRepository springDataComentarioRepository;

    @Override
    public Comentario save(Comentario comentario) {
        return springDataComentarioRepository.save(comentario);
    }

    @Override
    public Optional<Comentario> findById(UUID id) {
        return springDataComentarioRepository.findById(id);
    }

    @Override
    public void delete(Comentario comentario) {
        springDataComentarioRepository.delete(comentario);
    }

    @Override
    public List<Comentario> findByForoId(UUID foroId) {
        return springDataComentarioRepository.findByForoId(foroId);
    }

    @Override
    public List<Comentario> findAll() {
        return springDataComentarioRepository.findAll();
    }

    @Override
    public Page<Comentario> findAll(Specification<Comentario> spec, Pageable pageable) {
        return springDataComentarioRepository.findAll(spec, pageable);
    }

    @Override
    public long count() {
        return springDataComentarioRepository.count();
    }
}
