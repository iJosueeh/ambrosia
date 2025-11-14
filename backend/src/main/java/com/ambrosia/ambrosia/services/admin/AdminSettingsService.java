package com.ambrosia.ambrosia.services.admin;

import com.ambrosia.ambrosia.models.Administrador;
import com.ambrosia.ambrosia.models.Usuario;
import com.ambrosia.ambrosia.models.dto.AdminProfileDTO;
import com.ambrosia.ambrosia.repository.AdministradorRepository;
import com.ambrosia.ambrosia.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminSettingsService {

    private final UsuarioRepository usuarioRepository;
    private final AdministradorRepository administradorRepository;

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
        Administrador admin = administradorRepository.findByUsuarioId(currentUser.getId())
                .orElseThrow(() -> new RuntimeException("Admin profile not found for current user"));

        return AdminProfileDTO.builder()
                .id(currentUser.getId())
                .nombre(currentUser.getNombre())
                .email(currentUser.getEmail())
                .nivelAcceso(admin.getNivelAcceso())
                .build();
    }

    public AdminProfileDTO updateAdminProfile(AdminProfileDTO profileDTO) {
        Usuario currentUser = getCurrentAuthenticatedUser();
        Administrador admin = administradorRepository.findByUsuarioId(currentUser.getId())
                .orElseThrow(() -> new RuntimeException("Admin profile not found for current user"));

        currentUser.setNombre(profileDTO.getNombre());
        currentUser.setEmail(profileDTO.getEmail());
        // Password update would be a separate endpoint for security reasons
        usuarioRepository.save(currentUser);

        admin.setNivelAcceso(profileDTO.getNivelAcceso());
        administradorRepository.save(admin);

        return AdminProfileDTO.builder()
                .id(currentUser.getId())
                .nombre(currentUser.getNombre())
                .email(currentUser.getEmail())
                .nivelAcceso(admin.getNivelAcceso())
                .build();
    }

    // For now, assuming preferences are part of the profile or not explicitly defined.
    // If separate preferences are needed, a new entity/table and methods would be required.
    public void updateAdminPreferences() {
        // Placeholder for future preference updates
    }
}
