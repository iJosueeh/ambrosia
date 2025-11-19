package com.ambrosia.ambrosia.services;

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
import com.ambrosia.ambrosia.mappers.RecursoMapper;

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
    private final RecursoMapper recursoMapper;



    public List<TestDTO> listarTests() {
        logger.info("Listando todos los tests");
        List<TestEvaluacion> tests = testRepository.findAll();
        logger.info("Found {} tests in the database.", tests.size());
        return tests.stream()
                .map(recursoMapper::toDto)
                .collect(Collectors.toList());
    }

    public void guardarResultado(ResultadoDTO dto) {
        Preconditions.checkArgument(dto.usuarioId() != null, "El ID de usuario no puede ser nulo");
        Preconditions.checkArgument(dto.testId() != null, "El ID de test no puede ser nulo");

        logger.info("Guardando resultado de test para el usuario con id: {}", dto.usuarioId());

        Usuario usuario = usuarioRepository.findById(dto.usuarioId())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con el id: " + dto.usuarioId()));

        Integer testsCompletados = usuario.getTestsCompletados();
        usuario.setTestsCompletados((testsCompletados == null ? 0 : testsCompletados) + 1);
        Usuario usuarioGuardado = usuarioRepository.save(usuario);

        TestEvaluacion test = testRepository.findById(dto.testId())
                .orElseThrow(() -> new RuntimeException("Test no encontrado con el id: " + dto.testId()));

        ResultadoTest resultado = ResultadoTest.builder()
                .puntaje(dto.puntajeTotal())
                .cantidadTestsRespondidos(usuarioGuardado.getTestsCompletados())
                .usuario(usuarioGuardado)
                .test(test)
                .fechaRealizacion(LocalDateTime.now())
                .build();

        resultadoRepository.save(resultado);
    }
}