package com.ambrosia.ambrosia.infrastructure.adapter.out.persistence;

import com.ambrosia.ambrosia.domain.model.Rol;
import com.ambrosia.ambrosia.domain.repository.RolRepositoryPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class RolRepositoryAdapter implements RolRepositoryPort {

    private final SpringDataRolRepository springDataRolRepository;

    @Override
    public Rol save(Rol rol) {
        return springDataRolRepository.save(rol);
    }

    @Override
    public Optional<Rol> findById(UUID id) {
        return springDataRolRepository.findById(id);
    }

    @Override
    public void delete(Rol rol) {
        springDataRolRepository.delete(rol);
    }

    @Override
    public List<Rol> findAll() {
        return springDataRolRepository.findAll();
    }

    @Override
    public Optional<Rol> findByNombre(String nombre) {
        return springDataRolRepository.findByNombre(nombre);
    }
}
