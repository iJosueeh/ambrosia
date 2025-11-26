package com.ambrosia.ambrosia.infrastructure.adapter.out.persistence;

import com.ambrosia.ambrosia.domain.model.Actividad;
import com.ambrosia.ambrosia.domain.model.Usuario;
import com.ambrosia.ambrosia.domain.repository.ActividadRepositoryPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class ActividadRepositoryAdapter implements ActividadRepositoryPort {

    private final SpringDataActividadRepository springDataActividadRepository;

    @Override
    public Actividad save(Actividad actividad) {
        return springDataActividadRepository.save(actividad);
    }

    @Override
    public Optional<Actividad> findById(UUID id) {
        return springDataActividadRepository.findById(id);
    }

    @Override
    public void delete(Actividad actividad) {
        springDataActividadRepository.delete(actividad);
    }

    @Override
    public List<Actividad> findTop5ByUsuarioOrderByFechaDesc(Usuario usuario) {
        return springDataActividadRepository.findTop5ByUsuarioOrderByFechaDesc(usuario);
    }

    @Override
    public List<Actividad> findAll() {
        return springDataActividadRepository.findAll();
    }
}
