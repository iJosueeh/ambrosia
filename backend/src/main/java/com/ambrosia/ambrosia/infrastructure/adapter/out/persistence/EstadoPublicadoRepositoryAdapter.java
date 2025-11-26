package com.ambrosia.ambrosia.infrastructure.adapter.out.persistence;

import com.ambrosia.ambrosia.domain.model.EstadoPublicado;
import com.ambrosia.ambrosia.domain.repository.EstadoPublicadoRepositoryPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class EstadoPublicadoRepositoryAdapter implements EstadoPublicadoRepositoryPort {

    private final SpringDataEstadoPublicadoRepository springDataEstadoPublicadoRepository;

    @Override
    public EstadoPublicado save(EstadoPublicado estadoPublicado) {
        return springDataEstadoPublicadoRepository.save(estadoPublicado);
    }

    @Override
    public Optional<EstadoPublicado> findById(UUID id) {
        return springDataEstadoPublicadoRepository.findById(id);
    }

    @Override
    public void delete(EstadoPublicado estadoPublicado) {
        springDataEstadoPublicadoRepository.delete(estadoPublicado);
    }

    @Override
    public List<EstadoPublicado> findAll() {
        return springDataEstadoPublicadoRepository.findAll();
    }

    @Override
    public Optional<EstadoPublicado> findByNombre(String nombre) {
        return springDataEstadoPublicadoRepository.findByNombre(nombre);
    }
}