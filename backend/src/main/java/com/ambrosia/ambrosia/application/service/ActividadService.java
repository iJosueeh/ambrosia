package com.ambrosia.ambrosia.application.service;

import com.ambrosia.ambrosia.domain.model.Actividad;
import com.ambrosia.ambrosia.domain.model.TipoActividad;
import com.ambrosia.ambrosia.domain.model.Usuario;
import com.ambrosia.ambrosia.domain.repository.ActividadRepositoryPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ActividadService {

    private final ActividadRepositoryPort actividadRepository;

    public void crearActividad(Usuario usuario, TipoActividad tipo, String descripcion) {
        Actividad actividad = Actividad.builder()
                .usuario(usuario)
                .tipoActividad(tipo)
                .descripcion(descripcion)
                .fecha(LocalDateTime.now())
                .build();
        actividadRepository.save(actividad);
    }
}
