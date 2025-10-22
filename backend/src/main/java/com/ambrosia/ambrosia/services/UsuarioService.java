package com.ambrosia.ambrosia.services;

import com.ambrosia.ambrosia.exceptions.ResourceNotFoundException;
import com.ambrosia.ambrosia.models.Rol;
import com.ambrosia.ambrosia.models.Usuario;
import com.ambrosia.ambrosia.models.dto.UsuarioDTO;
import com.ambrosia.ambrosia.repository.RolRepository;
import com.ambrosia.ambrosia.repository.UsuarioRepository;
import com.google.common.base.Strings;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private static final Logger logger = LoggerFactory.getLogger(UsuarioService.class);

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final ModelMapper modelMapper;

    public UsuarioDTO registrar(UsuarioDTO dto) {
        if (Strings.isNullOrEmpty(dto.correo()) || Strings.isNullOrEmpty(dto.rol())) {
            throw new IllegalArgumentException("El correo y el rol no pueden ser nulos o vacíos");
        }

        logger.info("Registrando usuario con correo: {}", dto.correo());

        Usuario usuario = modelMapper.map(dto, Usuario.class);

        Rol rol = rolRepository.findByNombre(dto.rol())
                .orElseThrow(() -> new ResourceNotFoundException("Rol no encontrado con el nombre: " + dto.rol()));
        usuario.setRol(rol);

        usuario.setFecha_registro(LocalDateTime.now());

        Usuario usuarioGuardado = usuarioRepository.save(usuario);
        return modelMapper.map(usuarioGuardado, UsuarioDTO.class);
    }

    public UsuarioDTO buscarPorCorreo(String correo) {
        if (Strings.isNullOrEmpty(correo)) {
            throw new IllegalArgumentException("El correo no puede ser nulo o vacío");
        }
        logger.info("Buscando usuario con correo: {}", correo);
        Usuario usuario = usuarioRepository.findByEmail(correo)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con el correo: " + correo));
        return modelMapper.map(usuario, UsuarioDTO.class);
    }
}