package com.ambrosia.ambrosia.repository;

import com.ambrosia.ambrosia.models.Comentario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComentarioRepository extends JpaRepository<Comentario, Long>, JpaSpecificationExecutor<Comentario> {
    List<Comentario> findByForoId(Long foroId);
}
