package com.ambrosia.ambrosia.mappers;

import com.ambrosia.ambrosia.models.RecursoEducativo;
import com.ambrosia.ambrosia.models.Usuario;
import com.ambrosia.ambrosia.models.Actividad;
import com.ambrosia.ambrosia.models.CategoriaRecurso;
import com.ambrosia.ambrosia.models.TestEvaluacion;
import com.ambrosia.ambrosia.models.Pregunta;
import com.ambrosia.ambrosia.models.Opcion;
import com.ambrosia.ambrosia.models.dto.RecursoDTO;
import com.ambrosia.ambrosia.models.dto.UsuarioDTO;
import com.ambrosia.ambrosia.models.dto.ActividadDTO;
import com.ambrosia.ambrosia.models.dto.CategoriaRecursoDTO;
import com.ambrosia.ambrosia.models.dto.TestDTO;
import com.ambrosia.ambrosia.models.dto.PreguntaDTO;
import com.ambrosia.ambrosia.models.dto.OpcionDTO;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;
import java.util.List;

@Component
public class RecursoMapper {

    public RecursoDTO toDto(RecursoEducativo recursoEducativo) {
        if (recursoEducativo == null) {
            return null;
        }
        RecursoDTO recursoDTO = new RecursoDTO();
        recursoDTO.setId(recursoEducativo.getId());
        recursoDTO.setTitulo(recursoEducativo.getTitulo());
        recursoDTO.setDescripcion(recursoEducativo.getDescripcion());
        recursoDTO.setEnlace(recursoEducativo.getEnlace());
        recursoDTO.setUrlimg(recursoEducativo.getUrlimg());
        recursoDTO.setContenido(recursoEducativo.getContenido());
        recursoDTO.setSize(recursoEducativo.getSize());
        recursoDTO.setDownloads(recursoEducativo.getDownloads());
        recursoDTO.setFechaPublicacion(recursoEducativo.getFechaPublicacion());
        if (recursoEducativo.getCategoria() != null) {
            recursoDTO.setNombreCategoria(recursoEducativo.getCategoria().getNombre());
            CategoriaRecursoDTO categoriaDTO = new CategoriaRecursoDTO();
            categoriaDTO.setId(recursoEducativo.getCategoria().getId());
            categoriaDTO.setNombre(recursoEducativo.getCategoria().getNombre());
            categoriaDTO.setDescripcion(recursoEducativo.getCategoria().getDescripcion());
            recursoDTO.setCategoria(categoriaDTO);
        }
        if (recursoEducativo.getEstado() != null) {
            recursoDTO.setEstado(recursoEducativo.getEstado().getNombre());
        }
        if (recursoEducativo.getCreador() != null) {
            recursoDTO.setCreadorId(recursoEducativo.getCreador().getId());
            if (recursoEducativo.getCreador().getUsuario() != null) {
                recursoDTO.setNombreCreador(recursoEducativo.getCreador().getUsuario().getNombre());
            }
        }
        return recursoDTO;
    }

    public UsuarioDTO toDto(Usuario usuario) {
        if (usuario == null) {
            return null;
        }
        UsuarioDTO usuarioDTO = new UsuarioDTO();
        usuarioDTO.setNombre(usuario.getNombre());
        usuarioDTO.setCorreo(usuario.getEmail());
        usuarioDTO.setPassword(usuario.getPassword());
        String rol = usuario.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(a -> a.equals("ROLE_ADMIN")) ? "ADMIN" : "USER";
        usuarioDTO.setRol(rol);
        return usuarioDTO;
    }

    public ActividadDTO toDto(Actividad actividad) {
        if (actividad == null) {
            return null;
        }
        ActividadDTO actividadDTO = new ActividadDTO();
        // ActividadDTO does not have an 'id' or 'nombre' field based on its definition
        actividadDTO.setTipoActividad(actividad.getTipoActividad());
        actividadDTO.setDescripcion(actividad.getDescripcion());
        actividadDTO.setFecha(actividad.getFecha());
        return actividadDTO;
    }

    public CategoriaRecursoDTO toDto(CategoriaRecurso categoriaRecurso) {
        if (categoriaRecurso == null) {
            return null;
        }
        CategoriaRecursoDTO categoriaRecursoDTO = new CategoriaRecursoDTO();
        categoriaRecursoDTO.setId(categoriaRecurso.getId());
        categoriaRecursoDTO.setNombre(categoriaRecurso.getNombre());
        categoriaRecursoDTO.setDescripcion(categoriaRecurso.getDescripcion());
        return categoriaRecursoDTO;
    }

    public TestDTO toDto(TestEvaluacion testEvaluacion) {
        if (testEvaluacion == null) {
            return null;
        }
        TestDTO testDTO = new TestDTO();
        testDTO.setId(testEvaluacion.getId());
        testDTO.setTitulo(testEvaluacion.getTitulo());
        testDTO.setDescripcion(testEvaluacion.getDescripcion());
        if (testEvaluacion.getPreguntas() != null) {
            testDTO.setPreguntas(testEvaluacion.getPreguntas().stream()
                    .map(this::toDto)
                    .collect(Collectors.toList()));
        }
        return testDTO;
    }

    private PreguntaDTO toDto(Pregunta pregunta) {
        if (pregunta == null) {
            return null;
        }
        PreguntaDTO preguntaDTO = new PreguntaDTO();
        preguntaDTO.setId(pregunta.getId());
        preguntaDTO.setTexto(pregunta.getTexto());
        if (pregunta.getOpciones() != null) {
            preguntaDTO.setOpciones(pregunta.getOpciones().stream()
                    .map(this::toDto)
                    .collect(Collectors.toList()));
        }
        return preguntaDTO;
    }

    private OpcionDTO toDto(Opcion opcion) {
        if (opcion == null) {
            return null;
        }
        OpcionDTO opcionDTO = new OpcionDTO();
        opcionDTO.setId(opcion.getId());
        opcionDTO.setTexto(opcion.getTexto());
        return opcionDTO;
    }
}
