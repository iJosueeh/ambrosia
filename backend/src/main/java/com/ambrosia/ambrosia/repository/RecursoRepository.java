package com.ambrosia.ambrosia.repository;
import com.ambrosia.ambrosia.models.RecursoEducativo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RecursoRepository extends JpaRepository<RecursoEducativo, Long>, JpaSpecificationExecutor<RecursoEducativo> {
    Page<RecursoEducativo> findByCategoriaId(Long id, Pageable pageable);
    Page<RecursoEducativo> findByTituloContainingIgnoreCaseOrDescripcionContainingIgnoreCase(String titulo, String descripcion, Pageable pageable);
    Page<RecursoEducativo> findByCategoriaIdAndTituloContainingIgnoreCaseOrCategoriaIdAndDescripcionContainingIgnoreCase(Long categoriaId1, String titulo, Long categoriaId2, String descripcion, Pageable pageable);
}