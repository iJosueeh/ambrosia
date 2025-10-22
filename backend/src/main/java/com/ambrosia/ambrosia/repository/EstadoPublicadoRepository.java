package com.ambrosia.ambrosia.repository;

import com.ambrosia.ambrosia.models.EstadoPublicado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EstadoPublicadoRepository extends JpaRepository<EstadoPublicado, Long> {
    Optional<EstadoPublicado> findByNombre(String nombre);
}
