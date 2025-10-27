package com.ambrosia.ambrosia.services;

import com.ambrosia.ambrosia.models.Actividad;
import com.ambrosia.ambrosia.models.Rol;
import com.ambrosia.ambrosia.models.TipoActividad;
import com.ambrosia.ambrosia.models.Usuario;
import com.ambrosia.ambrosia.models.dto.ActividadDTO;
import com.ambrosia.ambrosia.models.dto.UsuarioDTO;
import com.ambrosia.ambrosia.models.dto.UsuarioDashboardDTO;
import com.ambrosia.ambrosia.repository.ActividadRepository;
import com.ambrosia.ambrosia.repository.RolRepository;
import com.ambrosia.ambrosia.repository.RecursoRepository;
import com.ambrosia.ambrosia.repository.TestRepository;
import com.ambrosia.ambrosia.repository.UsuarioRepository;
import com.ambrosia.ambrosia.strategies.ExportStrategy;
import com.google.common.base.Strings;
import com.ambrosia.ambrosia.mappers.RecursoMapper;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UsuarioService implements UserDetailsService {

    private static final Logger logger = LoggerFactory.getLogger(UsuarioService.class);

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final RecursoRepository recursoRepository;
    private final TestRepository testRepository;
    private final ActividadRepository actividadRepository;
    private final ActividadService actividadService;
    private final RecursoMapper recursoMapper;

    private final PasswordEncoder passwordEncoder;
    private final java.util.Map<String, ExportStrategy<Usuario>> exportStrategies;

    @PostConstruct
    public void initRoles() {
        if (rolRepository.findByNombre("USER").isEmpty()) {
            rolRepository.save(Rol.builder().nombre("USER").build());
            logger.info("Rol 'USER' creado.");
        }
        if (rolRepository.findByNombre("ADMIN").isEmpty()) {
            rolRepository.save(Rol.builder().nombre("ADMIN").build());
            logger.info("Rol 'ADMIN' creado.");
        }
    }

    public UsuarioDTO registrar(UsuarioDTO dto) {
        if (Strings.isNullOrEmpty(dto.getCorreo()) || Strings.isNullOrEmpty(dto.getRol()) || Strings.isNullOrEmpty(dto.getPassword())) {
            throw new IllegalArgumentException("El correo, el rol y la contraseña no pueden ser nulos o vacíos");
        }

        logger.info("Registrando usuario con correo: {}", dto.getCorreo());

        Rol rol = rolRepository.findByNombre(dto.getRol())
                .orElseThrow(() -> new RuntimeException("Rol no encontrado con el nombre: " + dto.getRol()));

        Usuario usuario = Usuario.builder()
                .nombre(dto.getNombre())
                .email(dto.getCorreo())
                .password(passwordEncoder.encode(dto.getPassword())) // Encode password
                .rol(rol)
                .fecha_registro(LocalDateTime.now())
                .build();

        Usuario usuarioGuardado = usuarioRepository.save(usuario);

        // Crear actividad de registro
        actividadService.crearActividad(usuarioGuardado, TipoActividad.REGISTRO, "Te uniste a Ambrosia Vital");

        return recursoMapper.toDto(usuarioGuardado);
    }

    public UsuarioDTO buscarPorCorreo(String correo) {
        if (Strings.isNullOrEmpty(correo)) {
            throw new IllegalArgumentException("El correo no puede ser nulo o vacío");
        }
        logger.info("Buscando usuario con correo: {}", correo);
        Usuario usuario = usuarioRepository.findByEmail(correo)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con el correo: " + correo));
        return recursoMapper.toDto(usuario);
    }

    public UsuarioDashboardDTO getUsuarioDashboardByEmail(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado con el correo: " + email));

        long diasActivo = 0;
        if (usuario.getFecha_registro() != null) {
            diasActivo = ChronoUnit.DAYS.between(usuario.getFecha_registro().toLocalDate(), LocalDate.now());
        }

        // Calcular Progreso
        long totalRecursos = recursoRepository.count();
        long totalTests = testRepository.count();
        int articulosLeidos = usuario.getArticulosLeidos() != null ? usuario.getArticulosLeidos() : 0;
        int testsCompletados = usuario.getTestsCompletados() != null ? usuario.getTestsCompletados() : 0;

        int progresoArticulos = (totalRecursos == 0) ? 0 : Math.min(100, (int) Math.round(((double) articulosLeidos / totalRecursos * 100)));
        int progresoTests = (totalTests == 0) ? 0 : Math.min(100, (int) Math.round(((double) testsCompletados / totalTests * 100)));

        List<com.ambrosia.ambrosia.models.dto.ProgressItemDTO> progreso = List.of(
            com.ambrosia.ambrosia.models.dto.ProgressItemDTO.builder()
                .label("Artículos completados")
                .current(articulosLeidos)
                .total(totalRecursos)
                .percentage(progresoArticulos)
                .build(),
            com.ambrosia.ambrosia.models.dto.ProgressItemDTO.builder()
                .label("Tests de seguimiento")
                .current(testsCompletados)
                .total(totalTests)
                .percentage(progresoTests)
                .build()
        );

        List<Actividad> actividades = actividadRepository.findTop5ByUsuarioOrderByFechaDesc(usuario);
        List<ActividadDTO> actividadReciente = actividades.stream()
                .map(recursoMapper::toDto)
                .toList();

        List<com.ambrosia.ambrosia.models.dto.RecomendacionDTO> recomendaciones = new ArrayList<>();
        if (testsCompletados == 0) {
            recomendaciones.add(com.ambrosia.ambrosia.models.dto.RecomendacionDTO.builder()
                    .title("Realizar primer test")
                    .description("Completa tu evaluación inicial")
                    .link("/quiz/1")
                    .tipo("TEST")
                    .build());
        }

        long articulosNoLeidos = totalRecursos - articulosLeidos;
        if (articulosNoLeidos > 0) {
            recomendaciones.add(com.ambrosia.ambrosia.models.dto.RecomendacionDTO.builder()
                    .title("Leer artículos nuevos")
                    .description(articulosNoLeidos + " sin leer")
                    .link("/articulos")
                    .tipo("ARTICULO")
                    .build());
        }

        recomendaciones.add(com.ambrosia.ambrosia.models.dto.RecomendacionDTO.builder()
                .title("Explorar recursos")
                .description("Guías y videos disponibles")
                .link("/articulos")
                .tipo("RECURSO")
                .build());


        return UsuarioDashboardDTO.builder()
                .nombre(usuario.getNombre())
                .correo(usuario.getEmail())
                .fechaRegistro(usuario.getFecha_registro() != null ? usuario.getFecha_registro().toLocalDate() : null)
                .diasActivo(diasActivo)
                .articulosLeidos(articulosLeidos)
                .testsCompletados(testsCompletados)
                .recursosDescargados(usuario.getRecursosDescargados() != null ? usuario.getRecursosDescargados() : 0)
                .progreso(progreso)
                .actividadReciente(actividadReciente)
                .recomendaciones(recomendaciones)
                .build();
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        logger.info("Attempting to load user by username (email): {}", username);
        Usuario user = usuarioRepository.findByEmail(username)
                .orElseThrow(() -> {
                    logger.warn("User not found with email: {}", username);
                    return new UsernameNotFoundException("Usuario no encontrado con el correo: " + username);
                });
        logger.info("User found: {} with roles: {}", user.getEmail(), user.getAuthorities());
        return user;
    }

    public ByteArrayInputStream exportUsers(String format) {
        ExportStrategy<Usuario> strategy = exportStrategies.get(format.toLowerCase());
        if (strategy == null) {
            throw new IllegalArgumentException("Formato de exportación no soportado: " + format);
        }
        List<Usuario> usuarios = usuarioRepository.findAllWithRoles();
        return strategy.export(usuarios);
    }

    public String getContentType(String format) {
        ExportStrategy<Usuario> strategy = exportStrategies.get(format.toLowerCase());
        if (strategy == null) {
            throw new IllegalArgumentException("Formato de exportación no soportado: " + format);
        }
        return strategy.getContentType();
    }

    public String getFileExtension(String format) {
        ExportStrategy<Usuario> strategy = exportStrategies.get(format.toLowerCase());
        if (strategy == null) {
            throw new IllegalArgumentException("Formato de exportación no soportado: " + format);
        }
        return strategy.getFileExtension();
    }
}