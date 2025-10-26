package com.ambrosia.ambrosia.services;

import com.ambrosia.ambrosia.models.Actividad;
import com.ambrosia.ambrosia.models.TipoActividad;
import com.ambrosia.ambrosia.models.Usuario;
import com.ambrosia.ambrosia.repository.ActividadRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ActividadService {

    private final ActividadRepository actividadRepository;

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