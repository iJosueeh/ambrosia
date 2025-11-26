package com.ambrosia.ambrosia.infrastructure.adapter.out.persistence;

import com.ambrosia.ambrosia.domain.model.Foro;
import com.ambrosia.ambrosia.domain.repository.ForoRepositoryPort;
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
public class ForoRepositoryAdapter implements ForoRepositoryPort {

    private final SpringDataForoRepository springDataForoRepository;

    @Override
    public Foro save(Foro foro) {
        return springDataForoRepository.save(foro);
    }

    @Override
    public Optional<Foro> findById(UUID id) {
        return springDataForoRepository.findById(id);
    }

    @Override
    public void delete(Foro foro) {
        springDataForoRepository.delete(foro);
    }

    @Override
    public List<Foro> findAll() {
        return springDataForoRepository.findAll();
    }

    @Override
    public Page<Foro> findAll(Specification<Foro> spec, Pageable pageable) {
        return springDataForoRepository.findAll(spec, pageable);
    }

    @Override
    public List<Foro> findByCategoriaForoId(UUID categoriaForoId) {
        return springDataForoRepository.findByCategoriaForoId(categoriaForoId);
    }

    @Override
    public List<Foro> findByAutorId(UUID autorId) {
        return springDataForoRepository.findByAutorId(autorId);
    }

    @Override
    public long count() {
        return springDataForoRepository.count();
    }
}