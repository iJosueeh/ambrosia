package com.ambrosia.ambrosia.services;

import com.ambrosia.ambrosia.models.Actividad;
import com.ambrosia.ambrosia.models.TipoActividad;
import com.ambrosia.ambrosia.models.Usuario;
import com.ambrosia.ambrosia.models.Profesional;
import com.ambrosia.ambrosia.models.Rol;
import com.ambrosia.ambrosia.models.dto.ActividadDTO;
import com.ambrosia.ambrosia.models.dto.UsuarioDTO;
import com.ambrosia.ambrosia.models.dto.UsuarioDashboardDTO;
import com.ambrosia.ambrosia.repository.ActividadRepository;
import com.ambrosia.ambrosia.repository.ProfesionalRepository;
import com.ambrosia.ambrosia.repository.RolRepository;
import com.ambrosia.ambrosia.repository.RecursoRepository;
import com.ambrosia.ambrosia.repository.TestRepository;
import com.ambrosia.ambrosia.repository.UsuarioRepository;
import com.ambrosia.ambrosia.strategies.ExportStrategy;
import com.google.common.base.Strings;
import com.ambrosia.ambrosia.mappers.RecursoMapper;
import lombok.RequiredArgsConstructor;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
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
import java.util.Collection;
import java.util.Optional;
import java.util.stream.Collectors; 

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
    private final ProfesionalRepository profesionalRepository;

    private final PasswordEncoder passwordEncoder;
    private final java.util.Map<String, ExportStrategy<Usuario>> exportStrategies;

    /**
     * Obtiene la lista de todos los usuarios registrados, incluyendo su rol (USER o ADMIN).
     * Este método es usado por el controlador de administración.
     * @return Una lista de UsuarioDTOs con información de nombre, correo, fecha de registro y rol.
     */
    public List<UsuarioDTO> findAllUsersForAdmin() {
        logger.info("Obteniendo lista completa de usuarios para la vista de administración.");

        List<Usuario> usuarios = usuarioRepository.findAll();

        return usuarios.stream()
                .map(this::mapUsuarioToAdminDTO)
                .collect(Collectors.toList());
    }

    /**
     * Helper para mapear Usuario a UsuarioDTO, agregando la lógica del Rol.
     */
    private UsuarioDTO mapUsuarioToAdminDTO(Usuario usuario) {
        String rolNombre = usuario.getRol() != null ? usuario.getRol().getNombre() : "USER";

        return UsuarioDTO.builder()
                .id(usuario.getId())
                .nombre(usuario.getNombre())
                .correo(usuario.getEmail())
                .rol(rolNombre) // Asignar el rol dinámicamente
                .fechaRegistro(usuario.getFecha_registro() != null ? usuario.getFecha_registro().toLocalDate() : null)
                .build();
    }

    /**
     * Busca la entidad Usuario completa por email.
     */
    public Optional<Usuario> findByEmail(String email) {
        return usuarioRepository.findByEmail(email);
    }


    public UsuarioDTO registrar(UsuarioDTO dto) {
        if (Strings.isNullOrEmpty(dto.getCorreo()) || Strings.isNullOrEmpty(dto.getPassword())) {
            throw new IllegalArgumentException("El correo y la contraseña no pueden ser nulos o vacíos");
        }

        logger.info("Registrando usuario con correo: {}", dto.getCorreo());

        Rol defaultRol = rolRepository.findByNombre("USER")
                .orElseThrow(() -> new RuntimeException("Rol 'USER' no encontrado en la base de datos."));

        Usuario usuario = Usuario.builder()
                .nombre(dto.getNombre())
                .email(dto.getCorreo())
                .password(passwordEncoder.encode(dto.getPassword())) 
                .fecha_registro(LocalDateTime.now())
                .rol(defaultRol)
                .build();

        Usuario usuarioGuardado = usuarioRepository.save(usuario);

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

    /**
     * Lógica crítica de Spring Security para cargar el usuario y sus roles.
     */
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        logger.info("Attempting to load user by username (email): {}", username);

        Usuario user = usuarioRepository.findByEmail(username)
                .orElseThrow(() -> {
                    logger.warn("User not found with email: {}", username);
                    return new UsernameNotFoundException("Usuario no encontrado con el correo: " + username);
                });

        Collection<GrantedAuthority> authorities = new ArrayList<>();

        if (user.getRol() != null) {
            authorities.add(new SimpleGrantedAuthority("ROLE_" + user.getRol().getNombre()));
            logger.info("Usuario {} tiene el rol: [ROLE_{}]", username, user.getRol().getNombre());
        } else {
            logger.warn("Usuario {} no tiene un rol asignado. Asignando ROLE_USER por defecto.", username);
            authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
        }

        Long profesionalId = null;
        if (user.getRol() != null && "PROFESSIONAL".equals(user.getRol().getNombre())) {
            profesionalId = profesionalRepository.findByUsuarioId(user.getId()).map(Profesional::getId).orElse(null);
        }

        return new MyUserDetails(
                user,
                authorities,
                profesionalId
        );
    }

    public ByteArrayInputStream exportUsers(String format) {
        ExportStrategy<Usuario> strategy = exportStrategies.get(format.toLowerCase());
        if (strategy == null) {
            throw new IllegalArgumentException("Formato de exportación no soportado: " + format);
        }
        List<Usuario> usuarios = usuarioRepository.findAll();
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