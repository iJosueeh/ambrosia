package com.ambrosia.ambrosia.infrastructure.adapter.out.persistence;

import com.ambrosia.ambrosia.domain.model.RecursoEducativo;
import com.ambrosia.ambrosia.domain.repository.RecursoRepositoryPort;
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
public class RecursoRepositoryAdapter implements RecursoRepositoryPort {

    private final SpringDataRecursoRepository springDataRecursoRepository;

    @Override
    public RecursoEducativo save(RecursoEducativo recursoEducativo) {
        return springDataRecursoRepository.save(recursoEducativo);
    }

    @Override
    public Optional<RecursoEducativo> findById(UUID id) {
        return springDataRecursoRepository.findById(id);
    }

    @Override
    public void delete(RecursoEducativo recursoEducativo) {
        springDataRecursoRepository.delete(recursoEducativo);
    }

    @Override
    public boolean existsById(UUID id) {
        return springDataRecursoRepository.existsById(id);
    }

    @Override
    public Page<RecursoEducativo> findByCategoriaId(UUID id, Pageable pageable) {
        return springDataRecursoRepository.findByCategoriaId(id, pageable);
    }

    @Override
    public Page<RecursoEducativo> findByTituloContainingIgnoreCaseOrDescripcionContainingIgnoreCase(String titulo, String descripcion, Pageable pageable) {
        return springDataRecursoRepository.findByTituloContainingIgnoreCaseOrDescripcionContainingIgnoreCase(titulo, descripcion, pageable);
    }

    @Override
    public Page<RecursoEducativo> findByCategoriaIdAndTituloContainingIgnoreCaseOrCategoriaIdAndDescripcionContainingIgnoreCase(UUID categoriaId1, String titulo, UUID categoriaId2, String descripcion, Pageable pageable) {
        return springDataRecursoRepository.findByCategoriaIdAndTituloContainingIgnoreCaseOrCategoriaIdAndDescripcionContainingIgnoreCase(categoriaId1, titulo, categoriaId2, descripcion, pageable);
    }

    @Override
    public List<RecursoEducativo> findByCreadorId(UUID creadorId) {
        return springDataRecursoRepository.findByCreadorId(creadorId);
    }

    @Override
    public Page<RecursoEducativo> findByEstadoNombre(String estadoNombre, Pageable pageable) {
        return springDataRecursoRepository.findByEstadoNombre(estadoNombre, pageable);
    }

    @Override
    public Page<RecursoEducativo> findByEstadoNombreAndTituloContainingIgnoreCaseOrEstadoNombreAndDescripcionContainingIgnoreCase(String estadoNombre1, String titulo, String estadoNombre2, String descripcion, Pageable pageable) {
        return springDataRecursoRepository.findByEstadoNombreAndTituloContainingIgnoreCaseOrEstadoNombreAndDescripcionContainingIgnoreCase(estadoNombre1, titulo, estadoNombre2, descripcion, pageable);
    }

    @Override
    public Page<RecursoEducativo> findByCategoriaIdAndEstadoNombre(UUID id, String estadoNombre, Pageable pageable) {
        return springDataRecursoRepository.findByCategoriaIdAndEstadoNombre(id, estadoNombre, pageable);
    }

    @Override
    public Page<RecursoEducativo> findByCategoriaIdAndEstadoNombreAndTituloContainingIgnoreCaseOrCategoriaIdAndEstadoNombreAndDescripcionContainingIgnoreCase(UUID categoriaId1, String estadoNombre1, String titulo, UUID categoriaId2, String estadoNombre2, String descripcion, Pageable pageable) {
        return springDataRecursoRepository.findByCategoriaIdAndEstadoNombreAndTituloContainingIgnoreCaseOrCategoriaIdAndEstadoNombreAndDescripcionContainingIgnoreCase(categoriaId1, estadoNombre1, titulo, categoriaId2, estadoNombre2, descripcion, pageable);
    }

    @Override
    public Page<RecursoEducativo> findAll(Pageable pageable) {
        return springDataRecursoRepository.findAll(pageable);
    }

    @Override
    public Page<RecursoEducativo> findAll(Specification<RecursoEducativo> spec, Pageable pageable) {
        return springDataRecursoRepository.findAll(spec, pageable);
    }

    @Override
    public long count() {
        return springDataRecursoRepository.count();
    }
}
