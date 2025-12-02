package com.ambrosia.ambrosia.application.service;

import com.ambrosia.ambrosia.domain.model.Guardado;
import com.ambrosia.ambrosia.domain.model.Usuario;
import com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto.CrearGuardadoRequest;
import com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto.GuardadoDTO;
import com.ambrosia.ambrosia.infrastructure.adapter.out.persistence.SpringDataGuardadoRepository;
import com.ambrosia.ambrosia.infrastructure.adapter.out.persistence.SpringDataRecursoRepository;
import com.ambrosia.ambrosia.infrastructure.adapter.out.persistence.SpringDataTestEvaluacionRepository;
import com.ambrosia.ambrosia.infrastructure.adapter.out.persistence.SpringDataUsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class GuardadoService {

    private final SpringDataGuardadoRepository guardadoRepository;
    private final SpringDataUsuarioRepository usuarioRepository;
    private final SpringDataRecursoRepository recursoRepository;
    private final SpringDataTestEvaluacionRepository testRepository;

    @Transactional
    public GuardadoDTO guardar(UUID usuarioId, CrearGuardadoRequest request) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Verificar si ya existe
        if (guardadoRepository.existsByUsuarioIdAndTipoAndItemId(usuarioId, request.getTipo(), request.getItemId())) {
            throw new RuntimeException("El elemento ya está guardado");
        }

        // Verificar que el item existe
        validarItemExiste(request.getTipo(), request.getItemId());

        Guardado guardado = Guardado.builder()
                .usuario(usuario)
                .tipo(request.getTipo())
                .itemId(request.getItemId())
                .build();

        Guardado saved = guardadoRepository.save(guardado);
        return mapToDTO(saved);
    }

    @Transactional(readOnly = true)
    public Page<GuardadoDTO> listarPorUsuario(UUID usuarioId, Pageable pageable) {
        return guardadoRepository.findByUsuarioId(usuarioId, pageable)
                .map(this::mapToDTO);
    }

    @Transactional(readOnly = true)
    public boolean verificarGuardado(UUID usuarioId, Guardado.TipoContenido tipo, UUID itemId) {
        return guardadoRepository.existsByUsuarioIdAndTipoAndItemId(usuarioId, tipo, itemId);
    }

    @Transactional
    public void eliminar(UUID usuarioId, UUID guardadoId) {
        Guardado guardado = guardadoRepository.findById(guardadoId)
                .orElseThrow(() -> new RuntimeException("Guardado no encontrado"));

        if (!guardado.getUsuario().getId().equals(usuarioId)) {
            throw new RuntimeException("No tienes permiso para eliminar este guardado");
        }

        guardadoRepository.delete(guardado);
    }

    @Transactional
    public void eliminarPorItem(UUID usuarioId, Guardado.TipoContenido tipo, UUID itemId) {
        if (!guardadoRepository.existsByUsuarioIdAndTipoAndItemId(usuarioId, tipo, itemId)) {
            throw new RuntimeException("El elemento no está guardado");
        }
        guardadoRepository.deleteByUsuarioIdAndTipoAndItemId(usuarioId, tipo, itemId);
    }

    private void validarItemExiste(Guardado.TipoContenido tipo, UUID itemId) {
        switch (tipo) {
            case ARTICULO:
            case RECURSO:
                if (!recursoRepository.existsById(itemId)) {
                    throw new RuntimeException("Recurso no encontrado");
                }
                break;
            case TEST:
                if (!testRepository.existsById(itemId)) {
                    throw new RuntimeException("Test no encontrado");
                }
                break;
        }
    }

    private GuardadoDTO mapToDTO(Guardado guardado) {
        GuardadoDTO dto = GuardadoDTO.builder()
                .id(guardado.getId())
                .tipo(guardado.getTipo())
                .itemId(guardado.getItemId())
                .fechaGuardado(guardado.getFechaGuardado())
                .build();

        // Populate details
        switch (guardado.getTipo()) {
            case ARTICULO:
            case RECURSO:
                recursoRepository.findById(guardado.getItemId()).ifPresent(recurso -> {
                    dto.setTitulo(recurso.getTitulo());
                    dto.setDescripcion(recurso.getDescripcion());
                    dto.setUrl(recurso.getSlug()); // Assuming slug is used for URL
                });
                break;
            case TEST:
                testRepository.findById(guardado.getItemId()).ifPresent(test -> {
                    dto.setTitulo(test.getTitulo());
                    dto.setDescripcion(test.getDescripcion());
                    dto.setUrl("/tests/" + test.getId()); // Assuming ID is used for URL
                });
                break;
        }

        return dto;
    }
}
