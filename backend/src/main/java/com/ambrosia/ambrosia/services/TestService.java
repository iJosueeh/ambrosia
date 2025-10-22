package com.ambrosia.ambrosia.services;

import com.ambrosia.ambrosia.exceptions.ResourceNotFoundException;
import com.ambrosia.ambrosia.models.ResultadoTest;
import com.ambrosia.ambrosia.models.TestEvaluacion;
import com.ambrosia.ambrosia.models.Usuario;
import com.ambrosia.ambrosia.models.dto.ResultadoDTO;
import com.ambrosia.ambrosia.models.dto.TestDTO;
import com.ambrosia.ambrosia.repository.ResultadoRepository;
import com.ambrosia.ambrosia.repository.TestRepository;
import com.ambrosia.ambrosia.repository.UsuarioRepository;
import com.google.common.base.Preconditions;
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
public class TestService {

    private static final Logger logger = LoggerFactory.getLogger(TestService.class);

    private final TestRepository testRepository;
    private final ResultadoRepository resultadoRepository;
    private final UsuarioRepository usuarioRepository;
    private final ModelMapper modelMapper;

    public List<TestDTO> listarTests() {
        logger.info("Listando todos los tests");
        return testRepository.findAll().stream()
                .map(test -> modelMapper.map(test, TestDTO.class))
                .collect(Collectors.toList());
    }

    public void guardarResultado(ResultadoDTO dto) {
        Preconditions.checkArgument(dto.usuarioId() != null, "El ID de usuario no puede ser nulo");
        Preconditions.checkArgument(dto.testId() != null, "El ID de test no puede ser nulo");

        logger.info("Guardando resultado de test para el usuario con id: {}", dto.usuarioId());

        ResultadoTest resultado = modelMapper.map(dto, ResultadoTest.class);

        Usuario usuario = usuarioRepository.findById(dto.usuarioId())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con el id: " + dto.usuarioId()));
        resultado.setUsuario(usuario);

        TestEvaluacion test = testRepository.findById(dto.testId())
                .orElseThrow(() -> new ResourceNotFoundException("Test no encontrado con el id: " + dto.testId()));
        resultado.setTest(test);

        resultado.setFechaRealizacion(LocalDateTime.now());

        resultadoRepository.save(resultado);
    }

}