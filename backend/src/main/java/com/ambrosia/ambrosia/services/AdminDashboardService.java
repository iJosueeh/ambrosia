package com.ambrosia.ambrosia.services;

import com.ambrosia.ambrosia.dtos.AdminDashboardDTO;
import com.ambrosia.ambrosia.dtos.DashboardStatsDTO;
import com.ambrosia.ambrosia.dtos.RecentActivityDTO;
import com.ambrosia.ambrosia.dtos.UserGrowthDTO;
// import com.ambrosia.ambrosia.repository.UserRepository; // Asumo que tienes estos repositorios
// import com.ambrosia.ambrosia.repository.RecursoRepository;
// import com.ambrosia.ambrosia.repository.ForoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.Arrays;
import java.util.List;
import java.util.ArrayList;

@Service
public class AdminDashboardService {

    // Inyecta aquí tus repositorios existentes. No necesitas crearlos.
    // @Autowired
    // private UserRepository userRepository;
    // @Autowired
    // private RecursoRepository recursoRepository;
    // @Autowired
    // private ForoRepository foroRepository;

    public AdminDashboardDTO getDashboardData() {
        AdminDashboardDTO dashboardData = new AdminDashboardDTO();

        dashboardData.setStats(getDashboardStats());
        dashboardData.setUserGrowth(getMockUserGrowth());
        dashboardData.setRecentActivity(getMockRecentActivity());

        return dashboardData;
    }

    private DashboardStatsDTO getDashboardStats() {
        DashboardStatsDTO stats = new DashboardStatsDTO();
        
        // --- LÓGICA REAL (descomentar cuando integres tus repositorios) ---
        // stats.setTotalUsuarios(userRepository.count());
        // stats.setRecursosPublicados(recursoRepository.count()); // Ajusta la query si es necesario
        // stats.setHilosActivos(foroRepository.count()); // Ajusta la query si es necesario
        // LocalDateTime unMesAtras = LocalDateTime.now().minusMonths(1);
        // stats.setNuevosRegistrosMes(userRepository.countByFechaRegistroAfter(unMesAtras));

        // --- DATOS MOCKEADOS (para que funcione sin BD) ---
        stats.setTotalUsuarios(1250);
        stats.setRecursosPublicados(340);
        stats.setHilosActivos(88);
        stats.setNuevosRegistrosMes(75);

        return stats;
    }

    private UserGrowthDTO getMockUserGrowth() {
        UserGrowthDTO userGrowth = new UserGrowthDTO();
        userGrowth.setLabels(Arrays.asList("Ene", "Feb", "Mar", "Abr", "May", "Jun"));
        userGrowth.setData(Arrays.asList(65L, 59L, 80L, 81L, 56L, 95L));
        return userGrowth;
    }

    private List<RecentActivityDTO> getMockRecentActivity() {
        List<RecentActivityDTO> activities = new ArrayList<>();
        activities.add(new RecentActivityDTO("USUARIO", "Nuevo usuario registrado: 'elena_gomez'", LocalDateTime.now().minusHours(1)));
        activities.add(new RecentActivityDTO("RECURSO", "Nuevo artículo publicado: 'Introducción a Mindfulness'", LocalDateTime.now().minusHours(3)));
        activities.add(new RecentActivityDTO("FORO", "'juan_perez' creó un nuevo hilo en 'Ansiedad'", LocalDateTime.now().minusHours(5)));
        activities.add(new RecentActivityDTO("USUARIO", "Nuevo usuario registrado: 'carlos_ruiz'", LocalDateTime.now().minusDays(1)));
        activities.add(new RecentActivityDTO("CONTACTO", "Nuevo mensaje de contacto recibido.", LocalDateTime.now().minusDays(2)));
        return activities;
    }
}
