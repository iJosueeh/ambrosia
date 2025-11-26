package com.ambrosia.ambrosia.infrastructure.config;

import com.ambrosia.ambrosia.domain.model.*;
import com.ambrosia.ambrosia.infrastructure.adapter.out.persistence.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Inicializador de datos para poblar la base de datos con datos de ejemplo.
 * Solo se ejecuta si las tablas están vacías.
 */
@Component
@RequiredArgsConstructor
@Order(1)
@Slf4j
public class DataInitializer implements CommandLineRunner {

        private final SpringDataRolRepository rolRepository;
        private final SpringDataUsuarioRepository usuarioRepository;
        private final SpringDataCategoriaRecursoRepository categoriaRecursoRepository;
        private final SpringDataEstadoPublicadoRepository estadoPublicadoRepository;
        private final SpringDataCategoriaForoRepository categoriaForoRepository;
        private final SpringDataRecursoRepository recursoRepository;
        private final SpringDataTestEvaluacionRepository testRepository;
        private final PasswordEncoder passwordEncoder;

        @Override
        @Transactional
        public void run(String... args) {
                log.info("🚀 Verificando datos iniciales...");

                try {
                        if (rolRepository.count() == 0) {
                                log.info("📝 Inicializando roles...");
                                initializeRoles();
                        }

                        if (usuarioRepository.count() == 0) {
                                log.info("👤 Inicializando usuarios de prueba...");
                                initializeUsers();
                        }

                        if (estadoPublicadoRepository.count() == 0) {
                                log.info("📊 Inicializando estados de publicación...");
                                initializeEstados();
                        }

                        if (categoriaRecursoRepository.count() == 0) {
                                log.info("📚 Inicializando categorías de recursos...");
                                initializeCategoriasRecurso();
                        }

                        if (categoriaForoRepository.count() == 0) {
                                log.info("💬 Inicializando categorías de foro...");
                                initializeCategoriasForo();
                        }

                        if (recursoRepository.count() == 0) {
                                log.info("📖 Inicializando recursos educativos...");
                                initializeRecursos();
                        }

                        if (testRepository.count() == 0) {
                                log.info("📝 Inicializando tests de evaluación...");
                                initializeTests();
                        }

                        log.info("✅ Datos iniciales verificados correctamente");

                } catch (Exception e) {
                        log.error("❌ Error al inicializar datos: {}", e.getMessage(), e);
                }
        }

        private void initializeRoles() {
                Rol roleUser = Rol.builder()
                                .nombre("USER")
                                .descripcion("Usuario regular del sistema")
                                .build();

                Rol roleAdmin = Rol.builder()
                                .nombre("ADMIN")
                                .descripcion("Administrador del sistema")
                                .build();

                Rol roleProfessional = Rol.builder()
                                .nombre("PROFESSIONAL")
                                .descripcion("Profesional de salud mental")
                                .build();

                rolRepository.saveAll(List.of(roleUser, roleAdmin, roleProfessional));
                log.info("✓ 3 roles creados");
        }

        private void initializeUsers() {
                Rol roleAdmin = rolRepository.findByNombre("ADMIN")
                                .orElseThrow(() -> new RuntimeException("Rol ADMIN no encontrado"));
                Rol roleUser = rolRepository.findByNombre("USER")
                                .orElseThrow(() -> new RuntimeException("Rol USER no encontrado"));
                Rol roleProfessional = rolRepository.findByNombre("PROFESSIONAL")
                                .orElseThrow(() -> new RuntimeException("Rol PROFESSIONAL no encontrado"));

                // Usuario Admin
                Usuario admin = Usuario.builder()
                                .nombre("Administrador Sistema")
                                .email("admin@ambrosia.com")
                                .password(passwordEncoder.encode("admin123"))
                                .rol(roleAdmin)
                                .fechaRegistro(LocalDateTime.now())
                                .testsCompletados(0)
                                .articulosLeidos(0)
                                .recursosDescargados(0)
                                .nivelAcceso(1)
                                .build();

                // Usuario Regular
                Usuario user = Usuario.builder()
                                .nombre("Juan Pérez")
                                .email("user@ambrosia.com")
                                .password(passwordEncoder.encode("user123"))
                                .rol(roleUser)
                                .fechaRegistro(LocalDateTime.now())
                                .testsCompletados(0)
                                .articulosLeidos(0)
                                .recursosDescargados(0)
                                .build();

                // Usuario Profesional
                Usuario professional = Usuario.builder()
                                .nombre("Dra. María García")
                                .email("professional@ambrosia.com")
                                .password(passwordEncoder.encode("prof123"))
                                .rol(roleProfessional)
                                .fechaRegistro(LocalDateTime.now())
                                .testsCompletados(0)
                                .articulosLeidos(0)
                                .recursosDescargados(0)
                                .build();

                usuarioRepository.saveAll(List.of(admin, user, professional));
                log.info("✓ 3 usuarios creados (admin@ambrosia.com, user@ambrosia.com, professional@ambrosia.com)");
        }

        private void initializeEstados() {
                List<EstadoPublicado> estados = List.of(
                                EstadoPublicado.builder()
                                                .nombre("DRAFT")
                                                .descripcion("Borrador, no visible públicamente")
                                                .build(),
                                EstadoPublicado.builder()
                                                .nombre("PUBLISHED")
                                                .descripcion("Publicado y visible para todos")
                                                .build(),
                                EstadoPublicado.builder()
                                                .nombre("ARCHIVED")
                                                .descripcion("Archivado, no visible")
                                                .build());

                estadoPublicadoRepository.saveAll(estados);
                log.info("✓ 3 estados de publicación creados");
        }

        private void initializeCategoriasRecurso() {
                List<CategoriaRecurso> categorias = List.of(
                                CategoriaRecurso.builder()
                                                .nombre("Ansiedad")
                                                .descripcion("Recursos sobre manejo y comprensión de la ansiedad")
                                                .build(),
                                CategoriaRecurso.builder()
                                                .nombre("Depresión")
                                                .descripcion("Recursos sobre depresión y estado de ánimo")
                                                .build(),
                                CategoriaRecurso.builder()
                                                .nombre("Mindfulness")
                                                .descripcion("Técnicas de atención plena y meditación")
                                                .build(),
                                CategoriaRecurso.builder()
                                                .nombre("Autoestima")
                                                .descripcion("Recursos para mejorar la autoestima y confianza")
                                                .build(),
                                CategoriaRecurso.builder()
                                                .nombre("Relaciones")
                                                .descripcion("Recursos sobre relaciones interpersonales saludables")
                                                .build());

                categoriaRecursoRepository.saveAll(categorias);
                log.info("✓ 5 categorías de recursos creadas");
        }

        private void initializeCategoriasForo() {
                List<CategoriaForo> categorias = List.of(
                                CategoriaForo.builder()
                                                .nombre("General")
                                                .descripcion("Discusiones generales sobre salud mental y bienestar")
                                                .build(),
                                CategoriaForo.builder()
                                                .nombre("Experiencias Personales")
                                                .descripcion("Comparte tu experiencia y aprende de otros")
                                                .build(),
                                CategoriaForo.builder()
                                                .nombre("Preguntas y Respuestas")
                                                .descripcion("Haz preguntas y obtén respuestas de la comunidad")
                                                .build(),
                                CategoriaForo.builder()
                                                .nombre("Recursos y Herramientas")
                                                .descripcion("Comparte y descubre recursos útiles")
                                                .build());

                categoriaForoRepository.saveAll(categorias);
                log.info("✓ 4 categorías de foro creadas");
        }

        private void initializeRecursos() {
                EstadoPublicado published = estadoPublicadoRepository.findByNombre("PUBLISHED")
                                .orElseThrow(() -> new RuntimeException("Estado PUBLISHED no encontrado"));

                CategoriaRecurso ansiedad = categoriaRecursoRepository.findByNombre("Ansiedad")
                                .orElseThrow(() -> new RuntimeException("Categoría Ansiedad no encontrada"));
                CategoriaRecurso mindfulness = categoriaRecursoRepository.findByNombre("Mindfulness")
                                .orElseThrow(() -> new RuntimeException("Categoría Mindfulness no encontrada"));
                CategoriaRecurso autoestima = categoriaRecursoRepository.findByNombre("Autoestima")
                                .orElseThrow(() -> new RuntimeException("Categoría Autoestima no encontrada"));

                List<RecursoEducativo> recursos = List.of(
                                RecursoEducativo.builder()
                                                .titulo("Guía Completa de Respiración para la Ansiedad")
                                                .descripcion(
                                                                "Aprende técnicas de respiración profunda y controlada para manejar momentos de ansiedad y estrés")
                                                .contenido(
                                                                "<h2>Introducción</h2><p>La respiración es una herramienta poderosa para manejar la ansiedad. En esta guía aprenderás técnicas efectivas.</p>")
                                                .urlimg("https://images.unsplash.com/photo-1506126613408-eca07ce68773")
                                                .estado(published)
                                                .categoria(ansiedad)
                                                .fechaPublicacion(LocalDateTime.now())
                                                .downloads(0L)
                                                .build(),
                                RecursoEducativo.builder()
                                                .titulo("Mindfulness: Vivir en el Presente")
                                                .descripcion(
                                                                "Descubre cómo la atención plena puede transformar tu vida diaria y reducir el estrés")
                                                .contenido(
                                                                "<h2>¿Qué es Mindfulness?</h2><p>Mindfulness es la práctica de estar presente en el momento actual sin juzgar.</p>")
                                                .urlimg("https://images.unsplash.com/photo-1499209974431-9dddcece7f88")
                                                .estado(published)
                                                .categoria(mindfulness)
                                                .fechaPublicacion(LocalDateTime.now())
                                                .downloads(0L)
                                                .build(),
                                RecursoEducativo.builder()
                                                .titulo("Construyendo una Autoestima Saludable")
                                                .descripcion("Estrategias prácticas para mejorar tu autoestima y confianza personal")
                                                .contenido(
                                                                "<h2>La Importancia de la Autoestima</h2><p>La autoestima es fundamental para nuestro bienestar emocional y mental.</p>")
                                                .urlimg("https://images.unsplash.com/photo-1517960413843-0aee8e2b3285")
                                                .estado(published)
                                                .categoria(autoestima)
                                                .fechaPublicacion(LocalDateTime.now())
                                                .downloads(0L)
                                                .build());

                recursoRepository.saveAll(recursos);
                log.info("✓ 3 recursos educativos creados");
        }

        private void initializeTests() {
                TestEvaluacion test = TestEvaluacion.builder()
                                .titulo("Test de Ansiedad GAD-7")
                                .descripcion(
                                                "Evaluación de trastorno de ansiedad generalizada. Este test te ayudará a identificar síntomas de ansiedad.")
                                .fechaCreacion(LocalDateTime.now())
                                .build();

                testRepository.save(test);
                log.info("✓ 1 test de evaluación creado (sin preguntas por ahora)");
        }
}
