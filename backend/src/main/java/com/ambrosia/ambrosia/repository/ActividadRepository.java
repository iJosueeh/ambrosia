package com.ambrosia.ambrosia.repository;

import com.ambrosia.ambrosia.models.Actividad;
import com.ambrosia.ambrosia.models.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ActividadRepository extends JpaRepository<Actividad, Long> {
    List<Actividad> findTop5ByUsuarioOrderByFechaDesc(Usuario usuario);
}
