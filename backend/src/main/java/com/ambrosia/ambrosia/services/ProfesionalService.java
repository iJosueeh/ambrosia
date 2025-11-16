package com.ambrosia.ambrosia.services;

import com.ambrosia.ambrosia.models.Profesional;
import com.ambrosia.ambrosia.models.Rol;
import com.ambrosia.ambrosia.models.Usuario;
import com.ambrosia.ambrosia.models.dto.ProfesionalDTO;
import com.ambrosia.ambrosia.repository.ProfesionalRepository;
import com.ambrosia.ambrosia.repository.RolRepository;
import com.ambrosia.ambrosia.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProfesionalService {

    private final ProfesionalRepository profesionalRepository;
    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;

    public ProfesionalDTO createProfesional(ProfesionalDTO profesionalDTO) {
        Usuario usuario = usuarioRepository.findById(profesionalDTO.getUsuarioId())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (usuario.getRol() != null && "PROFESSIONAL".equals(usuario.getRol().getNombre())) {
            throw new RuntimeException("El usuario ya tiene el rol PROFESSIONAL.");
        }

        Profesional profesional = Profesional.builder()
                .especialidad(profesionalDTO.getEspecialidad())
                .descripcion(profesionalDTO.getDescripcion())
                .telefono(profesionalDTO.getTelefono())
                .ubicacion(profesionalDTO.getUbicacion())
                .habilidades(profesionalDTO.getHabilidades())
                .usuario(usuario)
                .build();

        Profesional savedProfesional = profesionalRepository.save(profesional);

        Rol profesionalRol = rolRepository.findByNombre("PROFESSIONAL")
                .orElseThrow(() -> new RuntimeException("Rol 'PROFESSIONAL' no encontrado en la base de datos."));
        usuario.setRol(profesionalRol);
        usuarioRepository.save(usuario);

        return convertToDTO(savedProfesional);
    }

    public List<ProfesionalDTO> getAllProfesionales() {
        return profesionalRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Optional<ProfesionalDTO> getProfesionalById(Long id) {
        return profesionalRepository.findById(id)
                .map(this::convertToDTO);
    }

    public ProfesionalDTO updateProfesional(Long id, ProfesionalDTO profesionalDTO) {
        Profesional profesional = profesionalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Profesional no encontrado"));

        profesional.setEspecialidad(profesionalDTO.getEspecialidad());
        profesional.setDescripcion(profesionalDTO.getDescripcion());
        profesional.setTelefono(profesionalDTO.getTelefono());
        profesional.setUbicacion(profesionalDTO.getUbicacion());
        profesional.setHabilidades(profesionalDTO.getHabilidades());

        Profesional updatedProfesional = profesionalRepository.save(profesional);
        return convertToDTO(updatedProfesional);
    }

    public void deleteProfesional(Long id) {
        Profesional profesional = profesionalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Profesional no encontrado"));
        Usuario usuario = profesional.getUsuario();
        
        Rol userRol = rolRepository.findByNombre("USER")
                .orElseThrow(() -> new RuntimeException("Rol 'USER' no encontrado en la base de datos."));
        usuario.setRol(userRol);
        usuarioRepository.save(usuario);

        profesionalRepository.deleteById(id);
    }

    private ProfesionalDTO convertToDTO(Profesional profesional) {
        return ProfesionalDTO.builder()
                .id(profesional.getId())
                .especialidad(profesional.getEspecialidad())
                .descripcion(profesional.getDescripcion())
                .telefono(profesional.getTelefono())
                .ubicacion(profesional.getUbicacion())
                .habilidades(profesional.getHabilidades())
                .usuarioId(profesional.getUsuario().getId())
                .nombreUsuario(profesional.getUsuario().getNombre())
                .emailUsuario(profesional.getUsuario().getEmail())
                .build();
    }
}
