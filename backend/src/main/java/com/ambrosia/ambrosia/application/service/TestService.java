package com.ambrosia.ambrosia.application.service;

import com.ambrosia.ambrosia.application.port.in.test.*;
import com.ambrosia.ambrosia.domain.model.ResultadoTest;
import com.ambrosia.ambrosia.domain.model.TestEvaluacion;
import com.ambrosia.ambrosia.domain.model.Usuario;
import com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto.ResultadoDTO;
import com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto.TestDTO;
import com.ambrosia.ambrosia.domain.repository.ResultadoTestRepositoryPort;
import com.ambrosia.ambrosia.domain.repository.TestEvaluacionRepositoryPort;
import com.ambrosia.ambrosia.domain.repository.UsuarioRepositoryPort;
import com.google.common.base.Preconditions;
import lombok.RequiredArgsConstructor;
import com.ambrosia.ambrosia.infrastructure.util.mapper.RecursoMapper;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TestService implements
                ListarTestsUseCase,
                GuardarResultadoTestUseCase {

        private static final Logger logger = LoggerFactory.getLogger(TestService.class);

        private final TestEvaluacionRepositoryPort testRepository;
        private final ResultadoTestRepositoryPort resultadoRepository;
        private final UsuarioRepositoryPort usuarioRepository;
        private final RecursoMapper recursoMapper;

        @Override
        @Transactional(readOnly = true)
        public List<TestDTO> listarTodos() {
                logger.info("Listando todos los tests");
                List<TestEvaluacion> tests = testRepository.findAll();
                logger.info("Found {} tests in the database.", tests.size());
                return tests.stream()
                                .map(recursoMapper::toDto)
                                .collect(Collectors.toList());
        }

        @Override
        @Transactional
        public void guardar(GuardarResultadoTestCommand command) {
                logger.info("Guardando resultado de test para el usuario con id: {}", command.getUsuarioId());

                Usuario usuario = usuarioRepository.findById(command.getUsuarioId())
                                .orElseThrow(() -> new RuntimeException(
                                                "Usuario no encontrado con el id: " + command.getUsuarioId()));

                Integer testsCompletados = usuario.getTestsCompletados();
                usuario.setTestsCompletados((testsCompletados == null ? 0 : testsCompletados) + 1);
                Usuario usuarioGuardado = usuarioRepository.save(usuario);

                TestEvaluacion test = testRepository.findById(command.getTestId())
                                .orElseThrow(() -> new RuntimeException(
                                                "Test no encontrado con el id: " + command.getTestId()));

                ResultadoTest resultado = ResultadoTest.builder()
                                .puntaje(command.getPuntajeTotal())
                                .cantidadTestsRespondidos(usuarioGuardado.getTestsCompletados())
                                .usuario(usuarioGuardado)
                                .test(test)
                                .fechaRealizacion(LocalDateTime.now())
                                .build();

                resultadoRepository.save(resultado);
        }

        // ========== MÉTODOS LEGACY ==========

        public List<TestDTO> listarTests() {
                return listarTodos();
        }

        public void guardarResultado(ResultadoDTO dto) {
                Preconditions.checkArgument(dto.usuarioId() != null, "El ID de usuario no puede ser nulo");
                Preconditions.checkArgument(dto.testId() != null, "El ID de test no puede ser nulo");

                GuardarResultadoTestCommand command = new GuardarResultadoTestCommand(
                                dto.usuarioId(),
                                dto.testId(),
                                dto.puntajeTotal());
                guardar(command);
        }
}
