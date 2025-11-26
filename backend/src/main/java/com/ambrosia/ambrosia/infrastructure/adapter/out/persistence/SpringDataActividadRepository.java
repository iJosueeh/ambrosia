package com.ambrosia.ambrosia.infrastructure.adapter.out.persistence;

import com.ambrosia.ambrosia.domain.model.Actividad;
import com.ambrosia.ambrosia.domain.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID; // Importar UUID

public interface SpringDataActividadRepository extends JpaRepository<Actividad, UUID> {
    List<Actividad> findTop5ByUsuarioOrderByFechaDesc(Usuario usuario);
}
