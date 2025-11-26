package com.ambrosia.ambrosia.application.service.admin;

import com.ambrosia.ambrosia.domain.model.Usuario;
import com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto.UsuarioDTO;
import com.ambrosia.ambrosia.domain.repository.UsuarioRepositoryPort;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AdminUserService {

    private final UsuarioRepositoryPort usuarioRepository;
    private final com.ambrosia.ambrosia.domain.repository.RolRepositoryPort rolRepository;

    public Page<UsuarioDTO> getAllUsers(Pageable pageable, String searchTerm, String role) {
        Specification<Usuario> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Search Term Predicate (nombre or email)
            if (StringUtils.hasText(searchTerm)) {
                String likePattern = "%" + searchTerm.toLowerCase() + "%";
                Predicate searchPredicate = cb.or(
                        cb.like(cb.lower(root.get("nombre")), likePattern),
                        cb.like(cb.lower(root.get("email")), likePattern));
                predicates.add(searchPredicate);
            }

            // Role Predicate (ADMIN or USER)
            if (StringUtils.hasText(role)) {
                predicates.add(cb.equal(root.get("rol").get("nombre"), role.toUpperCase()));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<Usuario> usuariosPage = usuarioRepository.findAll(spec, pageable);
        return usuariosPage.map(this::mapToUsuarioDTO);
    }

    public UsuarioDTO getUserById(UUID id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        return mapToUsuarioDTO(usuario);
    }

    public UsuarioDTO updateUser(UUID id, UsuarioDTO usuarioDTO) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        usuario.setNombre(usuarioDTO.getNombre());
        usuario.setEmail(usuarioDTO.getCorreo());

        // Handle Role Change
        if (StringUtils.hasText(usuarioDTO.getRol())) {
            com.ambrosia.ambrosia.domain.model.Rol newRole = rolRepository
                    .findByNombre(usuarioDTO.getRol().toUpperCase())
                    .orElseThrow(() -> new RuntimeException("Role not found: " + usuarioDTO.getRol()));
            usuario.setRol(newRole);

            // Si es admin, asignar nivel de acceso por defecto si es nulo
            if ("ADMIN".equals(newRole.getNombre()) && usuario.getNivelAcceso() == null) {
                usuario.setNivelAcceso(1);
            }
        }

        Usuario updatedUsuario = usuarioRepository.save(usuario);
        return mapToUsuarioDTO(updatedUsuario);
    }

    public void deleteUser(UUID id) {
        if (!usuarioRepository.existsById(id)) {
            throw new RuntimeException("User not found with id: " + id);
        }
        usuarioRepository.deleteById(id);
    }

    private UsuarioDTO mapToUsuarioDTO(Usuario usuario) {
        return new UsuarioDTO(
                usuario.getId(),
                usuario.getNombre(),
                usuario.getEmail(),
                null, // Password should not be sent
                usuario.getRol().getNombre(),
                usuario.getFechaRegistro() != null ? usuario.getFechaRegistro().toLocalDate() : null);
    }
}
