package com.ambrosia.ambrosia.services;

import com.ambrosia.ambrosia.exceptions.ResourceNotFoundException;
import com.ambrosia.ambrosia.models.Foro;
import com.ambrosia.ambrosia.models.Usuario;
import com.ambrosia.ambrosia.models.EstadoPublicado;
import com.ambrosia.ambrosia.models.dto.ForoDTO;
import com.ambrosia.ambrosia.repository.EstadoPublicadoRepository;
import com.ambrosia.ambrosia.repository.ForoRepository;
import com.ambrosia.ambrosia.repository.UsuarioRepository;
import com.google.common.base.Strings;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ForoService {

    private final ForoRepository foroRepository;
    private final UsuarioRepository usuarioRepository;
    private final EstadoPublicadoRepository estadoPublicadoRepository;
    private final ModelMapper modelMapper;

    public ForoDTO crearForo(ForoDTO dto) {
        if (Strings.isNullOrEmpty(dto.titulo()) || Strings.isNullOrEmpty(dto.contenido())) {
            throw new IllegalArgumentException("El título y el contenido no pueden ser nulos o vacíos");
        }

        log.info("Creando foro con título: {}", dto.titulo());

        Foro foro = modelMapper.map(dto, Foro.class);

        Usuario autor = usuarioRepository.findByEmail(dto.autor())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con el correo: " + dto.autor()));
        foro.setAutor(autor);

        EstadoPublicado estado = estadoPublicadoRepository.findByNombre(dto.estado())
                .orElseThrow(() -> new ResourceNotFoundException("Estado no encontrado con el nombre: " + dto.estado()));
        foro.setEstado(estado);

        foro.setFechaCreacion(LocalDateTime.now());

        Foro foroGuardado = foroRepository.save(foro);
        return modelMapper.map(foroGuardado, ForoDTO.class);
    }

    public List<ForoDTO> listarForos() {
        log.info("Listando todos los foros");
        return foroRepository.findAll().stream()
                .map(foro -> modelMapper.map(foro, ForoDTO.class))
                .collect(Collectors.toList());
    }

}