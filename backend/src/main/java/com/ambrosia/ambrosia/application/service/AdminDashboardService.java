package com.ambrosia.ambrosia.application.service;

import com.ambrosia.ambrosia.application.port.in.admin.ObtenerAnalyticasUseCase;
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
import java.util.Arrays;
import java.util.List;
import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class AdminDashboardService implements ObtenerAnalyticasUseCase {

    private static final Logger logger = LoggerFactory.getLogger(AdminDashboardService.class);

    // Inyecta aquí tus repositorios existentes cuando estén disponibles
    // private final UsuarioRepositoryPort usuarioRepository;
    // private final RecursoRepositoryPort recursoRepository;
    // private final ForoRepositoryPort foroRepository;

    @Override
    @Transactional(readOnly = true)
    public DashboardStatsDTO obtenerEstadisticas() {
        logger.info("Obteniendo estadísticas del dashboard de administración");
        return getDashboardStats();
    }

    // ========== MÉTODOS AUXILIARES ==========

    private DashboardStatsDTO getDashboardStats() {
        DashboardStatsDTO stats = new DashboardStatsDTO();

        // --- LÓGICA REAL (descomentar cuando integres tus repositorios) ---
        // stats.setTotalUsuarios(usuarioRepository.count());
        // stats.setRecursosPublicados(recursoRepository.count());
        // stats.setHilosActivos(foroRepository.count());
        // LocalDateTime unMesAtras = LocalDateTime.now().minusMonths(1);
        // stats.setNuevosRegistrosMes(usuarioRepository.countByFechaRegistroAfter(unMesAtras));

        // --- DATOS MOCKEADOS (para que funcione sin BD) ---
        stats.setTotalUsuarios(1250);
        stats.setRecursosPublicados(340);
        stats.setHilosActivos(88);
        stats.setNuevosRegistrosMes(75);

        return stats;
    }

    // ========== MÉTODOS ADICIONALES ==========

    public AdminDashboardDTO getDashboardData() {
        AdminDashboardDTO dashboardData = new AdminDashboardDTO();
        dashboardData.setStats(getDashboardStats());
        dashboardData.setUserGrowth(getMockUserGrowth());
        dashboardData.setRecentActivity(getMockRecentActivity());
        return dashboardData;
    }

    private UserGrowthDTO getMockUserGrowth() {
        UserGrowthDTO userGrowth = new UserGrowthDTO();
        userGrowth.setLabels(Arrays.asList("Ene", "Feb", "Mar", "Abr", "May", "Jun"));
        userGrowth.setData(Arrays.asList(65L, 59L, 80L, 81L, 56L, 95L));
        return userGrowth;
    }

    private List<RecentActivityDTO> getMockRecentActivity() {
        List<RecentActivityDTO> activities = new ArrayList<>();
        activities.add(new RecentActivityDTO("USUARIO", "Nuevo usuario registrado: 'elena_gomez'",
                LocalDateTime.now().minusHours(1)));
        activities.add(new RecentActivityDTO("RECURSO", "Nuevo artículo publicado: 'Introducción a Mindfulness'",
                LocalDateTime.now().minusHours(3)));
        activities.add(new RecentActivityDTO("FORO", "'juan_perez' creó un nuevo hilo en 'Ansiedad'",
                LocalDateTime.now().minusHours(5)));
        activities.add(new RecentActivityDTO("USUARIO", "Nuevo usuario registrado: 'carlos_ruiz'",
                LocalDateTime.now().minusDays(1)));
        activities.add(new RecentActivityDTO("CONTACTO", "Nuevo mensaje de contacto recibido.",
                LocalDateTime.now().minusDays(2)));
        return activities;
    }
}
