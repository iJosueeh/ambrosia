package com.ambrosia.ambrosia.repository;
import com.ambrosia.ambrosia.models.RecursoEducativo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RecursoRepository extends JpaRepository<RecursoEducativo, Long> {
    List<RecursoEducativo> findByCategoriaId(Long id);
}