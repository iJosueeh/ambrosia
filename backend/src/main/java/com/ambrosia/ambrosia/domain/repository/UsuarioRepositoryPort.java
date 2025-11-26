package com.ambrosia.ambrosia.domain.repository;

import com.ambrosia.ambrosia.domain.model.Usuario;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UsuarioRepositoryPort {
    Usuario save(Usuario usuario);

    Optional<Usuario> findById(UUID id);

    void delete(Usuario usuario);

    void deleteById(UUID id);

    List<Usuario> findAll();

    Page<Usuario> findAll(Specification<Usuario> spec, Pageable pageable);

    long count();

    boolean existsById(UUID id);

    Optional<Usuario> findByEmail(String email);

    long countByFechaRegistroBetween(LocalDateTime start, LocalDateTime end);
}
