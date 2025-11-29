package com.ambrosia.ambrosia.infrastructure.adapter.out.persistence;

import com.ambrosia.ambrosia.domain.model.RecursoEducativo;
import com.ambrosia.ambrosia.domain.model.RecursoLeido;
import com.ambrosia.ambrosia.domain.model.Usuario;
import com.ambrosia.ambrosia.domain.repository.RecursoLeidoRepositoryPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
@RequiredArgsConstructor
public class RecursoLeidoRepositoryAdapter implements RecursoLeidoRepositoryPort {

    private final SpringDataRecursoLeidoRepository springDataRecursoLeidoRepository;

    @Override
    public RecursoLeido save(RecursoLeido recursoLeido) {
        return springDataRecursoLeidoRepository.save(recursoLeido);
    }

    @Override
    public Optional<RecursoLeido> findByUsuarioAndRecurso(Usuario usuario, RecursoEducativo recurso) {
        return springDataRecursoLeidoRepository.findByUsuarioAndRecurso(usuario, recurso);
    }

    @Override
    public List<RecursoLeido> findByUsuario(Usuario usuario) {
        return springDataRecursoLeidoRepository.findByUsuario(usuario);
    }

    @Override
    public long countByUsuario(Usuario usuario) {
        return springDataRecursoLeidoRepository.countByUsuario(usuario);
    }

    @Override
    public boolean existsByUsuarioAndRecurso(Usuario usuario, RecursoEducativo recurso) {
        return springDataRecursoLeidoRepository.existsByUsuarioAndRecurso(usuario, recurso);
    }

    @Override
    public List<UUID> findRecursoIdsByUsuario(Usuario usuario) {
        return springDataRecursoLeidoRepository.findRecursoIdsByUsuario(usuario);
    }
}
