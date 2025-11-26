package com.ambrosia.ambrosia.domain.repository;

import com.ambrosia.ambrosia.domain.model.Comentario;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ComentarioRepositoryPort {
    Comentario save(Comentario comentario);

    Optional<Comentario> findById(UUID id);

    void delete(Comentario comentario);

    List<Comentario> findByForoId(UUID foroId);

    List<Comentario> findAll();

    Page<Comentario> findAll(Specification<Comentario> spec, Pageable pageable);

    long count();
}
