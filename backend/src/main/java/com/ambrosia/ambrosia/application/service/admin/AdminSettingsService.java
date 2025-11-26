package com.ambrosia.ambrosia.application.service.admin;

import com.ambrosia.ambrosia.domain.model.Usuario;
import com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto.AdminProfileDTO;
import com.ambrosia.ambrosia.domain.repository.UsuarioRepositoryPort;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminSettingsService {

    private final UsuarioRepositoryPort usuarioRepository;

    private Usuario getCurrentAuthenticatedUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username;
        if (principal instanceof UserDetails) {
            username = ((UserDetails) principal).getUsername();
        } else {
            username = principal.toString();
        }
        return usuarioRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));
    }

    public AdminProfileDTO getAdminProfile() {
        Usuario currentUser = getCurrentAuthenticatedUser();

        return AdminProfileDTO.builder()
                .id(currentUser.getId())
                .nombre(currentUser.getNombre())
                .email(currentUser.getEmail())
                .nivelAcceso(currentUser.getNivelAcceso())
                .build();
    }

    public AdminProfileDTO updateAdminProfile(AdminProfileDTO profileDTO) {
        Usuario currentUser = getCurrentAuthenticatedUser();

        currentUser.setNombre(profileDTO.getNombre());
        currentUser.setEmail(profileDTO.getEmail());
        currentUser.setNivelAcceso(profileDTO.getNivelAcceso());

        // Password update would be a separate endpoint for security reasons
        usuarioRepository.save(currentUser);

        return AdminProfileDTO.builder()
                .id(currentUser.getId())
                .nombre(currentUser.getNombre())
                .email(currentUser.getEmail())
                .nivelAcceso(currentUser.getNivelAcceso())
                .build();
    }

    // For now, assuming preferences are part of the profile or not explicitly
    // defined.
    // If separate preferences are needed, a new entity/table and methods would be
    // required.
    public void updateAdminPreferences() {
        // Placeholder for future preference updates
    }
}
