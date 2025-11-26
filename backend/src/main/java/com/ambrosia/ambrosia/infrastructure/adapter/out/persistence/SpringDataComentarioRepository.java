package com.ambrosia.ambrosia.infrastructure.adapter.out.persistence;

import com.ambrosia.ambrosia.domain.model.Comentario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID; // Importar UUID

@Repository
public interface SpringDataComentarioRepository extends JpaRepository<Comentario, UUID>, JpaSpecificationExecutor<Comentario> {
    List<Comentario> findByForoId(UUID foroId);
}
