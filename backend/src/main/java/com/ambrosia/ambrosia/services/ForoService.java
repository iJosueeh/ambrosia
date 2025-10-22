package com.ambrosia.ambrosia.services;


import com.ambrosia.ambrosia.models.Foro;
import com.ambrosia.ambrosia.models.Usuario;
import com.ambrosia.ambrosia.models.EstadoPublicado;
import com.ambrosia.ambrosia.models.dto.ForoDTO;
import com.ambrosia.ambrosia.repository.EstadoPublicadoRepository;
import com.ambrosia.ambrosia.repository.ForoRepository;
import com.ambrosia.ambrosia.repository.UsuarioRepository;
import com.google.common.base.Strings;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ForoService {

    private final ForoRepository foroRepository;
    private final UsuarioRepository usuarioRepository;
    private final EstadoPublicadoRepository estadoPublicadoRepository;
    private final ModelMapper modelMapper;
    private static final Logger logger = LoggerFactory.getLogger(ForoService.class);

    public ForoDTO crearForo(ForoDTO dto) {
        if (Strings.isNullOrEmpty(dto.titulo()) || Strings.isNullOrEmpty(dto.contenido())) {
            throw new IllegalArgumentException("El título y el contenido no pueden ser nulos o vacíos");
        }

        logger.info("Creando foro con título: {}", dto.titulo());

        Usuario autor = usuarioRepository.findByEmail(dto.autor())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con el correo: " + dto.autor()));

        EstadoPublicado estado = estadoPublicadoRepository.findByNombre(dto.estado())
                .orElseThrow(() -> new RuntimeException("Estado no encontrado con el nombre: " + dto.estado()));

        Foro foro = Foro.builder()
                .titulo(dto.titulo())
                .contenido(dto.contenido())
                .autor(autor)
                .estado(estado)
                .fechaCreacion(LocalDateTime.now())
                .build();

        Foro foroGuardado = foroRepository.save(foro);
        return modelMapper.map(foroGuardado, ForoDTO.class);
    }

    public List<ForoDTO> listarForos() {
        logger.info("Listando todos los foros");
        return foroRepository.findAll().stream()
                .map(foro -> modelMapper.map(foro, ForoDTO.class))
                .collect(Collectors.toList());
    }

}