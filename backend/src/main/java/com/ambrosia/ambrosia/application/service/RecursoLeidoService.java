package com.ambrosia.ambrosia.application.service;

import com.ambrosia.ambrosia.domain.model.RecursoEducativo;
import com.ambrosia.ambrosia.domain.model.RecursoLeido;
import com.ambrosia.ambrosia.domain.model.Usuario;
import com.ambrosia.ambrosia.domain.repository.RecursoLeidoRepositoryPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RecursoLeidoService {

    private final RecursoLeidoRepositoryPort recursoLeidoRepository;

    @Transactional
    public RecursoLeido marcarComoLeido(Usuario usuario, RecursoEducativo recurso, Integer tiempoLecturaSegundos) {
        // Verificar si ya existe
        if (recursoLeidoRepository.existsByUsuarioAndRecurso(usuario, recurso)) {
            // Ya está marcado como leído, no hacer nada
            return recursoLeidoRepository.findByUsuarioAndRecurso(usuario, recurso)
                    .orElseThrow(() -> new IllegalStateException("Error al obtener recurso leído"));
        }

        // Crear nuevo registro
        RecursoLeido recursoLeido = RecursoLeido.builder()
                .usuario(usuario)
                .recurso(recurso)
                .fechaLectura(LocalDateTime.now())
                .tiempoLecturaSegundos(tiempoLecturaSegundos)
                .build();

        return recursoLeidoRepository.save(recursoLeido);
    }

    @Transactional(readOnly = true)
    public long contarRecursosLeidos(Usuario usuario) {
        return recursoLeidoRepository.countByUsuario(usuario);
    }

    @Transactional(readOnly = true)
    public List<UUID> obtenerIdsRecursosLeidos(Usuario usuario) {
        return recursoLeidoRepository.findRecursoIdsByUsuario(usuario);
    }

    @Transactional(readOnly = true)
    public boolean estaLeido(Usuario usuario, RecursoEducativo recurso) {
        return recursoLeidoRepository.existsByUsuarioAndRecurso(usuario, recurso);
    }

    @Transactional(readOnly = true)
    public List<RecursoLeido> obtenerRecursosLeidosPorUsuario(Usuario usuario) {
        return recursoLeidoRepository.findByUsuario(usuario);
    }
}
