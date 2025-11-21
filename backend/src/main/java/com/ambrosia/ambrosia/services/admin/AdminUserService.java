package com.ambrosia.ambrosia.services.admin;

import com.ambrosia.ambrosia.models.Administrador;
import com.ambrosia.ambrosia.models.Usuario;
import com.ambrosia.ambrosia.models.dto.UsuarioDTO;
import com.ambrosia.ambrosia.repository.AdministradorRepository;
import com.ambrosia.ambrosia.repository.UsuarioRepository;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Subquery;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminUserService {

    private final UsuarioRepository usuarioRepository;
    private final AdministradorRepository administradorRepository;

    public Page<UsuarioDTO> getAllUsers(Pageable pageable, String searchTerm, String role) {
        Specification<Usuario> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Search Term Predicate (nombre or email)
            if (StringUtils.hasText(searchTerm)) {
                String likePattern = "%" + searchTerm.toLowerCase() + "%";
                Predicate searchPredicate = cb.or(
                        cb.like(cb.lower(root.get("nombre")), likePattern),
                        cb.like(cb.lower(root.get("email")), likePattern)
                );
                predicates.add(searchPredicate);
            }

            // Role Predicate (ADMIN or USER)
            if (StringUtils.hasText(role)) {
                Subquery<Long> adminSubquery = query.subquery(Long.class);
                adminSubquery.select(adminSubquery.from(Administrador.class).get("id"));

                if ("ADMIN".equalsIgnoreCase(role)) {
                    predicates.add(root.get("id").in(adminSubquery));
                } else if ("USER".equalsIgnoreCase(role)) {
                    predicates.add(cb.not(root.get("id").in(adminSubquery)));
                }
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<Usuario> usuariosPage = usuarioRepository.findAll(spec, pageable);
        return usuariosPage.map(this::mapToUsuarioDTO);
    }

    public UsuarioDTO getUserById(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        return mapToUsuarioDTO(usuario);
    }

    public UsuarioDTO updateUser(Long id, UsuarioDTO usuarioDTO) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        usuario.setNombre(usuarioDTO.getNombre());
        usuario.setEmail(usuarioDTO.getCorreo());

        // Handle Role Change
        boolean isCurrentlyAdmin = administradorRepository.existsById(id);
        boolean wantsToBeAdmin = "ADMIN".equalsIgnoreCase(usuarioDTO.getRol());

        if (wantsToBeAdmin && !isCurrentlyAdmin) {
            // Promote to Admin
            Administrador admin = new Administrador();
            admin.setUsuario(usuario);
            admin.setNivelAcceso(1); // Set a default access level
            administradorRepository.save(admin);
        } else if (!wantsToBeAdmin && isCurrentlyAdmin) {
            // Demote from Admin
            administradorRepository.deleteById(id);
        }

        Usuario updatedUsuario = usuarioRepository.save(usuario);
        return mapToUsuarioDTO(updatedUsuario);
    }

    public void deleteUser(Long id) {
        if (!usuarioRepository.existsById(id)) {
            throw new RuntimeException("User not found with id: " + id);
        }
        // The CascadeType.ALL on the Usuario's 'administrador' field will handle deleting the admin record.
        usuarioRepository.deleteById(id);
    }

    private UsuarioDTO mapToUsuarioDTO(Usuario usuario) {
        String userRole = administradorRepository.existsById(usuario.getId()) ? "ADMIN" : "USER";
        return new UsuarioDTO(
                usuario.getId(),
                usuario.getNombre(),
                usuario.getEmail(),
                null, // Password should not be sent
                userRole,
                usuario.getFechaRegistro() != null ? usuario.getFechaRegistro().toLocalDate() : null
        );
    }
}
