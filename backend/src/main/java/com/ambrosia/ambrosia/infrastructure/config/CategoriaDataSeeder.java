package com.ambrosia.ambrosia.infrastructure.config;

import com.ambrosia.ambrosia.domain.model.CategoriaRecurso;
import com.ambrosia.ambrosia.domain.repository.CategoriaRecursoRepositoryPort;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Seeder para asignar iconos y colores a las categorías de recursos.
 * Se ejecuta automáticamente al iniciar la aplicación.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class CategoriaDataSeeder implements CommandLineRunner {

    private final CategoriaRecursoRepositoryPort categoriaRecursoRepository;

    /**
     * Mapeo de nombres de categorías a sus iconos y colores.
     * Iconos: Nombres de componentes de Lucide React
     * Colores: Códigos hexadecimales
     */
    private static final Map<String, CategoryStyle> CATEGORY_STYLES = new HashMap<>() {
        {
            // Ansiedad - Corazón palpitante, color rosa/rojo
            put("ansiedad", new CategoryStyle("Heart", "#ec4899"));

            // Depresión - Nube, color azul oscuro/gris
            put("depresión", new CategoryStyle("Cloud", "#6b7280"));

            // Autoestima - Estrella brillante, color dorado
            put("autoestima", new CategoryStyle("Star", "#f59e0b"));

            // Relaciones - Usuarios/personas, color cyan
            put("relaciones", new CategoryStyle("Users", "#06b6d4"));

            // Mindfulness - Cerebro/meditación, color púrpura
            put("mindfulness", new CategoryStyle("Brain", "#a855f7"));

            // Categorías adicionales comunes (por si se agregan en el futuro)
            put("nutrición", new CategoryStyle("Apple", "#10b981"));
            put("ejercicio", new CategoryStyle("Activity", "#ef4444"));
            put("sueño", new CategoryStyle("Moon", "#8b5cf6"));
            put("familia", new CategoryStyle("Home", "#14b8a6"));
            put("trabajo", new CategoryStyle("Briefcase", "#f97316"));
            put("estrés", new CategoryStyle("Zap", "#dc2626"));
            put("adicciones", new CategoryStyle("AlertCircle", "#991b1b"));
        }
    };

    @Override
    @Transactional
    public void run(String... args) {
        log.info("🎨 Iniciando CategoriaDataSeeder...");

        List<CategoriaRecurso> categorias = categoriaRecursoRepository.findAll();
        int actualizadas = 0;

        for (CategoriaRecurso categoria : categorias) {
            // Solo actualizar si no tiene icono o color asignado
            if (categoria.getIcono() == null || categoria.getIcono().isEmpty() ||
                    categoria.getColor() == null || categoria.getColor().isEmpty()) {

                String nombreNormalizado = categoria.getNombre().toLowerCase().trim();
                CategoryStyle style = CATEGORY_STYLES.get(nombreNormalizado);

                if (style != null) {
                    categoria.setIcono(style.icono);
                    categoria.setColor(style.color);
                    categoriaRecursoRepository.save(categoria);
                    actualizadas++;
                    log.info("✅ Categoría '{}' actualizada: icono={}, color={}",
                            categoria.getNombre(), style.icono, style.color);
                } else {
                    // Asignar valores por defecto si no hay coincidencia
                    categoria.setIcono("FileText");
                    categoria.setColor("#6b7280");
                    categoriaRecursoRepository.save(categoria);
                    actualizadas++;
                    log.warn("⚠️ Categoría '{}' sin estilo predefinido, usando valores por defecto",
                            categoria.getNombre());
                }
            } else {
                log.debug("⏭️ Categoría '{}' ya tiene icono y color asignados", categoria.getNombre());
            }
        }

        log.info("🎨 CategoriaDataSeeder completado: {} categorías actualizadas de {}",
                actualizadas, categorias.size());
    }

    /**
     * Clase interna para almacenar el estilo de una categoría
     */
    private static class CategoryStyle {
        final String icono;
        final String color;

        CategoryStyle(String icono, String color) {
            this.icono = icono;
            this.color = color;
        }
    }
}
