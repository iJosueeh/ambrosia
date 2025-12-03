package com.ambrosia.ambrosia.application.service;

import com.ambrosia.ambrosia.application.port.in.admin.ObtenerAnalyticasUseCase;
import com.ambrosia.ambrosia.domain.repository.UsuarioRepositoryPort;
import com.ambrosia.ambrosia.domain.repository.RecursoRepositoryPort;
import com.ambrosia.ambrosia.domain.repository.ForoRepositoryPort;
import com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto.AdminDashboardDTO;
import com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto.DashboardStatsDTO;
import com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto.RecentActivityDTO;
import com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto.UserGrowthDTO;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminDashboardService implements ObtenerAnalyticasUseCase {

    private static final Logger logger = LoggerFactory.getLogger(AdminDashboardService.class);

    private final UsuarioRepositoryPort usuarioRepository;
    private final RecursoRepositoryPort recursoRepository;
    private final ForoRepositoryPort foroRepository;

    @Override
    @Transactional(readOnly = true)
    public DashboardStatsDTO obtenerEstadisticas() {
        logger.info("Obteniendo estadísticas del dashboard de administración");
        return getDashboardStats();
    }

    // ========== MÉTODOS AUXILIARES ==========

    private DashboardStatsDTO getDashboardStats() {
        DashboardStatsDTO stats = new DashboardStatsDTO();

        try {
            // Obtener datos reales de la base de datos
            long totalUsuarios = usuarioRepository.count();
            long recursosPublicados = recursoRepository.count();
            long hilosActivos = foroRepository.count();

            // Contar nuevos registros del último mes
            LocalDateTime unMesAtras = LocalDateTime.now().minusMonths(1);
            long nuevosRegistros = usuarioRepository.findAll().stream()
                    .filter(u -> u.getFechaRegistro() != null && u.getFechaRegistro().isAfter(unMesAtras))
                    .count();

            stats.setTotalUsuarios((int) totalUsuarios);
            stats.setRecursosPublicados((int) recursosPublicados);
            stats.setHilosActivos((int) hilosActivos);
            stats.setNuevosRegistrosMes((int) nuevosRegistros);

            logger.info("Estadísticas obtenidas: {} usuarios, {} recursos, {} hilos, {} nuevos registros",
                    totalUsuarios, recursosPublicados, hilosActivos, nuevosRegistros);
        } catch (Exception e) {
            logger.error("Error al obtener estadísticas, usando valores por defecto", e);
            // Valores por defecto en caso de error
            stats.setTotalUsuarios(0);
            stats.setRecursosPublicados(0);
            stats.setHilosActivos(0);
            stats.setNuevosRegistrosMes(0);
        }

        return stats;
    }

    // ========== MÉTODOS ADICIONALES ==========

    public AdminDashboardDTO getDashboardData() {
        AdminDashboardDTO dashboardData = new AdminDashboardDTO();
        dashboardData.setStats(getDashboardStats());
        dashboardData.setUserGrowth(getUserGrowthData());
        dashboardData.setRecentActivity(getRecentActivityData());
        return dashboardData;
    }

    private UserGrowthDTO getUserGrowthData() {
        UserGrowthDTO userGrowth = new UserGrowthDTO();

        try {
            // Obtener datos de los últimos 6 meses
            LocalDateTime seisMesesAtras = LocalDateTime.now().minusMonths(6);
            Map<String, Long> growthByMonth = usuarioRepository.findAll().stream()
                    .filter(u -> u.getFechaRegistro() != null && u.getFechaRegistro().isAfter(seisMesesAtras))
                    .collect(Collectors.groupingBy(
                            u -> u.getFechaRegistro().getMonth().getDisplayName(TextStyle.SHORT, new Locale("es")),
                            Collectors.counting()));

            List<String> labels = new ArrayList<>(growthByMonth.keySet());
            List<Long> data = new ArrayList<>(growthByMonth.values());

            userGrowth.setLabels(labels.isEmpty() ? Arrays.asList("Ene", "Feb", "Mar", "Abr", "May", "Jun") : labels);
            userGrowth.setData(data.isEmpty() ? Arrays.asList(0L, 0L, 0L, 0L, 0L, 0L) : data);
        } catch (Exception e) {
            logger.error("Error al obtener datos de crecimiento de usuarios", e);
            userGrowth.setLabels(Arrays.asList("Ene", "Feb", "Mar", "Abr", "May", "Jun"));
            userGrowth.setData(Arrays.asList(0L, 0L, 0L, 0L, 0L, 0L));
        }

        return userGrowth;
    }

    private List<RecentActivityDTO> getRecentActivityData() {
        List<RecentActivityDTO> activities = new ArrayList<>();

        try {
            // Obtener últimos 5 usuarios registrados
            usuarioRepository.findAll().stream()
                    .filter(u -> u.getFechaRegistro() != null)
                    .sorted((u1, u2) -> u2.getFechaRegistro().compareTo(u1.getFechaRegistro()))
                    .limit(5)
                    .forEach(u -> activities.add(new RecentActivityDTO(
                            "USUARIO",
                            "Nuevo usuario registrado: '" + u.getNombre() + "'",
                            u.getFechaRegistro())));
        } catch (Exception e) {
            logger.error("Error al obtener actividad reciente", e);
            // Agregar actividad por defecto si hay error
            activities.add(new RecentActivityDTO("SISTEMA", "No hay actividad reciente", LocalDateTime.now()));
        }

        return activities;
    }
}
