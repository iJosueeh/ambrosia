package com.ambrosia.ambrosia.repository;

import com.ambrosia.ambrosia.models.Administrador;
import com.ambrosia.ambrosia.models.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AdministradorRepository extends JpaRepository<Administrador, Long> {
    boolean existsByUsuario(Usuario usuario);
    Optional<Administrador> findByUsuarioId(Long usuarioId);
}
