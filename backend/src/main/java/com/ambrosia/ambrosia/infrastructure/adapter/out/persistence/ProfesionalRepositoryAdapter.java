package com.ambrosia.ambrosia.infrastructure.adapter.out.persistence;

import com.ambrosia.ambrosia.domain.model.Profesional;
import com.ambrosia.ambrosia.domain.repository.ProfesionalRepositoryPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class ProfesionalRepositoryAdapter implements ProfesionalRepositoryPort {

    private final SpringDataProfesionalRepository springDataProfesionalRepository;

    @Override
    public Profesional save(Profesional profesional) {
        return springDataProfesionalRepository.save(profesional);
    }

    @Override
    public Optional<Profesional> findById(UUID id) {
        return springDataProfesionalRepository.findById(id);
    }

    @Override
    public void delete(Profesional profesional) {
        springDataProfesionalRepository.delete(profesional);
    }

    @Override
    public void deleteById(UUID id) {
        springDataProfesionalRepository.deleteById(id);
    }

    @Override
    public List<Profesional> findAll() {
        return springDataProfesionalRepository.findAll();
    }

    @Override
    public Optional<Profesional> findByUsuarioId(UUID usuarioId) {
        return springDataProfesionalRepository.findByUsuarioId(usuarioId);
    }
}