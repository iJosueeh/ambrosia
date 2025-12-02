package com.ambrosia.ambrosia.application.service;

import com.ambrosia.ambrosia.application.port.in.usuario.*;
import com.ambrosia.ambrosia.domain.exception.ResourceNotFoundException;
import com.ambrosia.ambrosia.domain.model.Actividad;
import com.ambrosia.ambrosia.domain.model.TipoActividad;
import com.ambrosia.ambrosia.domain.model.Usuario;
import com.ambrosia.ambrosia.domain.model.Profesional;
import com.ambrosia.ambrosia.domain.model.Rol;
import com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto.ActividadDTO;
import com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto.UsuarioDTO;
import com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto.UsuarioDashboardDTO;
import com.ambrosia.ambrosia.domain.repository.ActividadRepositoryPort;
import com.ambrosia.ambrosia.domain.repository.ProfesionalRepositoryPort;
import com.ambrosia.ambrosia.domain.repository.RolRepositoryPort;
import com.ambrosia.ambrosia.domain.repository.RecursoRepositoryPort;
import com.ambrosia.ambrosia.domain.repository.TestEvaluacionRepositoryPort;
import com.ambrosia.ambrosia.domain.repository.UsuarioRepositoryPort;
import com.ambrosia.ambrosia.infrastructure.util.export.ExportStrategy;
import com.google.common.base.Strings;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import com.ambrosia.ambrosia.infrastructure.util.mapper.RecursoMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
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
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UsuarioService implements
        UserDetailsService,
        RegistrarUsuarioUseCase,
        ObtenerUsuarioUseCase,
        ListarUsuariosUseCase,
        ActualizarUsuarioUseCase,
        EliminarUsuarioUseCase {

    private static final Logger logger = LoggerFactory.getLogger(UsuarioService.class);

    private final UsuarioRepositoryPort usuarioRepository;
    private final RolRepositoryPort rolRepository;
    private final RecursoRepositoryPort recursoRepository;
    private final TestEvaluacionRepositoryPort testRepository;
    private final ActividadRepositoryPort actividadRepository;
    private final ActividadService actividadService;
    private final RecursoMapper recursoMapper;
    private final ProfesionalRepositoryPort profesionalRepository;

    private final PasswordEncoder passwordEncoder;
    private final java.util.Map<String, ExportStrategy<Usuario>> exportStrategies;

    @Override
    @Transactional
    public UsuarioDTO registrar(RegistrarUsuarioCommand command) {
        logger.info("Registrando usuario con correo: {}", command.getEmail());

        Rol rol = rolRepository.findByNombre(command.getRol())
                .orElseGet(() -> rolRepository.findByNombre("USER")
                        .orElseThrow(() -> new RuntimeException("Rol 'USER' no encontrado en la base de datos.")));

        Usuario usuario = Usuario.builder()
                .nombre(command.getNombre())
                .email(command.getEmail())
                .password(passwordEncoder.encode(command.getPassword()))
                .fechaRegistro(LocalDateTime.now())
                .rol(rol)
                .nivelAcceso(1)
                .testsCompletados(0)
                .articulosLeidos(0)
                .recursosDescargados(0)
                .build();

        Usuario usuarioGuardado = usuarioRepository.save(usuario);
        logger.info("Usuario guardado exitosamente con ID: {}", usuarioGuardado.getId());

        // Intentar crear actividad, pero no fallar el registro si esto falla
        try {
            actividadService.crearActividad(usuarioGuardado, TipoActividad.REGISTRO, "Te uniste a Ambrosia Vital");
        } catch (Exception e) {
            logger.error("Error al crear actividad de registro para usuario {}: {}", usuarioGuardado.getId(),
                    e.getMessage());
            // Continuar con el registro aunque falle la actividad
        }

        return mapUsuarioToDTO(usuarioGuardado);
    }

    @Override
    public UsuarioDTO obtenerPorId(UUID id) {
        logger.info("Obteniendo usuario por ID: {}", id);
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", id));
        return mapUsuarioToDTO(usuario);
    }

    @Override
    public UsuarioDTO obtenerPorEmail(String email) {
        logger.info("Obteniendo usuario por email: {}", email);
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con el correo: " + email));
        return mapUsuarioToDTO(usuario);
    }

    @Override
    public Page<UsuarioDTO> listar(Pageable pageable, String search, String role) {
        logger.info("Listando usuarios - search: {}, role: {}", search, role);

        List<Usuario> usuarios;
        if (search != null && !search.isEmpty()) {
            usuarios = usuarioRepository.findAll().stream()
                    .filter(u -> u.getNombre().toLowerCase().contains(search.toLowerCase()) ||
                            u.getEmail().toLowerCase().contains(search.toLowerCase()))
                    .collect(Collectors.toList());
        } else if (role != null && !role.isEmpty()) {
            usuarios = usuarioRepository.findAll().stream()
                    .filter(u -> u.getRol() != null && u.getRol().getNombre().equals(role))
                    .collect(Collectors.toList());
        } else {
            usuarios = usuarioRepository.findAll();
        }

        List<UsuarioDTO> usuarioDTOs = usuarios.stream()
                .map(this::mapUsuarioToDTO)
                .collect(Collectors.toList());

        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), usuarioDTOs.size());

        return new PageImpl<>(
                usuarioDTOs.subList(start, end),
                pageable,
                usuarioDTOs.size());
    }

    /**
     * Implementación de ActualizarUsuarioUseCase
     */
    @Override
    public UsuarioDTO actualizar(UUID id, ActualizarUsuarioCommand command) {
        logger.info("Actualizando usuario con ID: {}", id);

        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + id));

        usuario.setNombre(command.getNombre());
        usuario.setEmail(command.getEmail());

        // Actualizar teléfono si se proporciona
        if (command.getTelefono() != null) {
            usuario.setTelefono(command.getTelefono());
        }

        if (command.getRol() != null && !command.getRol().isEmpty()) {
            Rol rol = rolRepository.findByNombre(command.getRol())
                    .orElseThrow(() -> new RuntimeException("Rol no encontrado: " + command.getRol()));
            usuario.setRol(rol);
        }

        Usuario usuarioActualizado = usuarioRepository.save(usuario);
        return mapUsuarioToDTO(usuarioActualizado);
    }

    /**
     * Implementación de EliminarUsuarioUseCase
     */
    @Override
    public void eliminar(UUID id) {
        logger.info("Eliminando usuario con ID: {}", id);

        if (!usuarioRepository.existsById(id)) {
            throw new RuntimeException("Usuario no encontrado con ID: " + id);
        }

        usuarioRepository.deleteById(id);
    }

    /**
     * Cambiar contraseña de usuario
     */
    @Transactional
    public void cambiarContrasena(UUID id, CambiarContrasenaCommand command) {
        logger.info("Cambiando contraseña para usuario con ID: {}", id);

        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + id));

        // Verificar que la contraseña actual es correcta
        if (!passwordEncoder.matches(command.getContrasenaActual(), usuario.getPassword())) {
            throw new IllegalArgumentException("La contraseña actual no es correcta");
        }

        // Verificar que las contraseñas nuevas coinciden
        if (!command.getContrasenaNueva().equals(command.getConfirmarContrasena())) {
            throw new IllegalArgumentException("Las contraseñas nuevas no coinciden");
        }

        // Actualizar contraseña
        usuario.setPassword(passwordEncoder.encode(command.getContrasenaNueva()));
        usuarioRepository.save(usuario);

        logger.info("Contraseña actualizada exitosamente para usuario ID: {}", id);
    }

    // ========== MÉTODOS LEGACY PARA COMPATIBILIDAD ==========

    /**
     * Método legacy - usar registrar(RegistrarUsuarioCommand) en su lugar
     */
    public UsuarioDTO registrar(UsuarioDTO dto) {
        if (Strings.isNullOrEmpty(dto.getCorreo()) || Strings.isNullOrEmpty(dto.getPassword())) {
            throw new IllegalArgumentException("El correo y la contraseña no pueden ser nulos o vacíos");
        }

        RegistrarUsuarioCommand command = new RegistrarUsuarioCommand(
                dto.getNombre(),
                dto.getCorreo(),
                dto.getPassword(),
                dto.getRol() != null ? dto.getRol() : "USER");

        return registrar(command);
    }

    public List<UsuarioDTO> findAllUsersForAdmin() {
        logger.info("Obteniendo lista completa de usuarios para la vista de administración.");
        List<Usuario> usuarios = usuarioRepository.findAll();
        return usuarios.stream()
                .map(this::mapUsuarioToDTO)
                .collect(Collectors.toList());
    }

    public Optional<Usuario> findByEmail(String email) {
        return usuarioRepository.findByEmail(email);
    }

    public UsuarioDTO buscarPorCorreo(String correo) {
        return obtenerPorEmail(correo);
    }

    public UsuarioDashboardDTO getUsuarioDashboardByEmail(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado con el correo: " + email));

        long diasActivo = 0;
        if (usuario.getFechaRegistro() != null) {
            diasActivo = ChronoUnit.DAYS.between(usuario.getFechaRegistro().toLocalDate(), LocalDate.now());
        }

        long totalRecursos = recursoRepository.count();
        long totalTests = testRepository.count();
        int articulosLeidos = usuario.getArticulosLeidos() != null ? usuario.getArticulosLeidos() : 0;
        int testsCompletados = usuario.getTestsCompletados() != null ? usuario.getTestsCompletados() : 0;

        int progresoArticulos = (totalRecursos == 0) ? 0
                : Math.min(100, (int) Math.round(((double) articulosLeidos / totalRecursos * 100)));
        int progresoTests = (totalTests == 0) ? 0
                : Math.min(100, (int) Math.round(((double) testsCompletados / totalTests * 100)));

        List<com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto.ProgressItemDTO> progreso = List.of(
                com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto.ProgressItemDTO.builder()
                        .label("Artículos completados")
                        .current(articulosLeidos)
                        .total(totalRecursos)
                        .percentage(progresoArticulos)
                        .build(),
                com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto.ProgressItemDTO.builder()
                        .label("Tests de seguimiento")
                        .current(testsCompletados)
                        .total(totalTests)
                        .percentage(progresoTests)
                        .build());

        List<Actividad> actividades = actividadRepository.findTop5ByUsuarioOrderByFechaDesc(usuario);
        List<ActividadDTO> actividadReciente = actividades.stream()
                .map(recursoMapper::toDto)
                .toList();

        List<com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto.RecomendacionDTO> recomendaciones = new ArrayList<>();
        if (testsCompletados == 0) {
            recomendaciones.add(com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto.RecomendacionDTO.builder()
                    .title("Realizar primer test")
                    .description("Completa tu evaluación inicial")
                    .link("/quiz/1")
                    .tipo("TEST")
                    .build());
        }

        long articulosNoLeidos = totalRecursos - articulosLeidos;
        if (articulosNoLeidos > 0) {
            recomendaciones.add(com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto.RecomendacionDTO.builder()
                    .title("Leer artículos nuevos")
                    .description(articulosNoLeidos + " sin leer")
                    .link("/articulos")
                    .tipo("ARTICULO")
                    .build());
        }

        recomendaciones.add(com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto.RecomendacionDTO.builder()
                .title("Explorar recursos")
                .description("Guías y videos disponibles")
                .link("/articulos")
                .tipo("RECURSO")
                .build());

        return UsuarioDashboardDTO.builder()
                .nombre(usuario.getNombre())
                .correo(usuario.getEmail())
                .telefono(usuario.getTelefono())
                .fechaRegistro(usuario.getFechaRegistro() != null ? usuario.getFechaRegistro().toLocalDate() : null)
                .diasActivo(diasActivo)
                .articulosLeidos(articulosLeidos)
                .testsCompletados(testsCompletados)
                .recursosDescargados(usuario.getRecursosDescargados() != null ? usuario.getRecursosDescargados() : 0)
                .progreso(progreso)
                .actividadReciente(actividadReciente)
                .recomendaciones(recomendaciones)
                .build();
    }

    // ========== SPRING SECURITY ==========

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

        UUID profesionalId = null;
        if (user.getRol() != null && "PROFESSIONAL".equals(user.getRol().getNombre())) {
            profesionalId = profesionalRepository.findByUsuarioId(user.getId())
                    .map(Profesional::getId)
                    .orElse(null);
        }

        return new MyUserDetails(
                user,
                authorities,
                profesionalId);
    }

    // ========== EXPORTACIÓN ==========

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

    // ========== HELPERS ==========

    private UsuarioDTO mapUsuarioToDTO(Usuario usuario) {
        String rolNombre = usuario.getRol() != null ? usuario.getRol().getNombre() : "USER";

        return UsuarioDTO.builder()
                .id(usuario.getId())
                .nombre(usuario.getNombre())
                .correo(usuario.getEmail())
                .telefono(usuario.getTelefono())
                .rol(rolNombre)
                .fechaRegistro(usuario.getFechaRegistro() != null ? usuario.getFechaRegistro().toLocalDate() : null)
                .build();
    }
}
