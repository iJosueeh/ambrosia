package com.ambrosia.ambrosia.services;

import com.ambrosia.ambrosia.models.Rol;
import com.ambrosia.ambrosia.models.Usuario;
import com.ambrosia.ambrosia.models.dto.UsuarioDTO;
import com.ambrosia.ambrosia.repository.RolRepository;
import com.ambrosia.ambrosia.repository.UsuarioRepository;
import com.ambrosia.ambrosia.strategies.ExportStrategy;
import com.google.common.base.Strings;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private static final Logger logger = LoggerFactory.getLogger(UsuarioService.class);

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final ModelMapper modelMapper;
    private final java.util.Map<String, ExportStrategy<Usuario>> exportStrategies;

    public UsuarioDTO registrar(UsuarioDTO dto) {
        if (Strings.isNullOrEmpty(dto.correo()) || Strings.isNullOrEmpty(dto.rol()) || Strings.isNullOrEmpty(dto.password())) {
            throw new IllegalArgumentException("El correo, el rol y la contraseña no pueden ser nulos o vacíos");
        }

        logger.info("Registrando usuario con correo: {}", dto.correo());

        Rol rol = rolRepository.findByNombre(dto.rol())
                .orElseThrow(() -> new RuntimeException("Rol no encontrado con el nombre: " + dto.rol()));

        Usuario usuario = Usuario.builder()
                .nombre(dto.nombre())
                .email(dto.correo())
                .password(dto.password())
                .rol(rol)
                .fecha_registro(LocalDateTime.now())
                .build();

        Usuario usuarioGuardado = usuarioRepository.save(usuario);
        return modelMapper.map(usuarioGuardado, UsuarioDTO.class);
    }

    public UsuarioDTO buscarPorCorreo(String correo) {
        if (Strings.isNullOrEmpty(correo)) {
            throw new IllegalArgumentException("El correo no puede ser nulo o vacío");
        }
        logger.info("Buscando usuario con correo: {}", correo);
        Usuario usuario = usuarioRepository.findByEmail(correo)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con el correo: " + correo));
        return modelMapper.map(usuario, UsuarioDTO.class);
    }

    public ByteArrayInputStream exportUsers(String format) {
        ExportStrategy<Usuario> strategy = exportStrategies.get(format.toLowerCase());
        if (strategy == null) {
            throw new IllegalArgumentException("Formato de exportación no soportado: " + format);
        }
        List<Usuario> usuarios = usuarioRepository.findAllWithRoles();
        return strategy.export(usuarios);
    }

    public String getContentType(String format) {
        ExportStrategy<Usuario> strategy = exportStrategies.get(format.toLowerCase());
        if (strategy == null) {
            throw new IllegalArgumentException("Formato de exportación no soportado: " + format);
        }
        return strategy.getContentType();
    }

    public String getFileExtension(String format) {
        ExportStrategy<Usuario> strategy = exportStrategies.get(format.toLowerCase());
        if (strategy == null) {
            throw new IllegalArgumentException("Formato de exportación no soportado: " + format);
        }
        return strategy.getFileExtension();
    }
}