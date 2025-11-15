package com.ambrosia.ambrosia.services.admin;

import com.ambrosia.ambrosia.repository.ComentarioRepository;
import com.ambrosia.ambrosia.repository.ForoRepository;
import com.ambrosia.ambrosia.repository.RecursoRepository;
import com.ambrosia.ambrosia.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.LinkedHashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AdminAnalyticsService {

    private final UsuarioRepository usuarioRepository;
    private final RecursoRepository recursoRepository;
    private final ForoRepository foroRepository;
    private final ComentarioRepository comentarioRepository;

    public Map<String, Long> getUsersGrowth(int lastDays) {
        Map<String, Long> growthData = new LinkedHashMap<>();
        LocalDate today = LocalDate.now();

        for (int i = lastDays - 1; i >= 0; i--) {
            LocalDate date = today.minusDays(i);
            LocalDateTime startOfDay = date.atStartOfDay();
            LocalDateTime endOfDay = date.plusDays(1).atStartOfDay().minusNanos(1);
            long count = usuarioRepository.countByFecha_registroBetween(startOfDay, endOfDay);
            growthData.put(date.toString(), count);
        }
        return growthData;
    }

    public Map<String, Long> getResourcesStats() {
        Map<String, Long> stats = new LinkedHashMap<>();
        stats.put("totalResources", recursoRepository.count());
        // Add more specific resource stats if needed, e.g., by category, by status
        return stats;
    }

    public Map<String, Long> getForumStats() {
        Map<String, Long> stats = new LinkedHashMap<>();
        stats.put("totalTopics", foroRepository.count());
        stats.put("totalComments", comentarioRepository.count());
        // Add more specific forum stats if needed, e.g., reported topics/comments
        return stats;
    }

    public Map<String, Object> getSummary() {
        Map<String, Object> summary = new LinkedHashMap<>();
        summary.put("totalUsers", usuarioRepository.count());
        summary.put("totalResources", recursoRepository.count());
        summary.put("totalTopics", foroRepository.count());
        summary.put("totalComments", comentarioRepository.count());
        // Add more summary stats
        return summary;
    }
}
