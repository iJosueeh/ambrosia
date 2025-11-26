package com.ambrosia.ambrosia.infrastructure.adapter.out.persistence;

import com.ambrosia.ambrosia.domain.model.Usuario;
import com.ambrosia.ambrosia.domain.repository.UsuarioRepositoryPort;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class UsuarioRepositoryAdapter implements UsuarioRepositoryPort {

    private final SpringDataUsuarioRepository springDataUsuarioRepository;

    @Override
    public Usuario save(Usuario usuario) {
        return springDataUsuarioRepository.save(usuario);
    }

    @Override
    public Optional<Usuario> findById(UUID id) {
        return springDataUsuarioRepository.findById(id);
    }

    @Override
    public void delete(Usuario usuario) {
        springDataUsuarioRepository.delete(usuario);
    }

    @Override
    public void deleteById(UUID id) {
        springDataUsuarioRepository.deleteById(id);
    }

    @Override
    public List<Usuario> findAll() {
        return springDataUsuarioRepository.findAll();
    }

    @Override
    public Page<Usuario> findAll(Specification<Usuario> spec, Pageable pageable) {
        return springDataUsuarioRepository.findAll(spec, pageable);
    }

    @Override
    public long count() {
        return springDataUsuarioRepository.count();
    }

    @Override
    public boolean existsById(UUID id) {
        return springDataUsuarioRepository.existsById(id);
    }

    @Override
    public Optional<Usuario> findByEmail(String email) {
        return springDataUsuarioRepository.findByEmail(email);
    }

    @Override
    public long countByFechaRegistroBetween(LocalDateTime start, LocalDateTime end) {
        return springDataUsuarioRepository.countByFechaRegistroBetween(start, end);
    }
}
