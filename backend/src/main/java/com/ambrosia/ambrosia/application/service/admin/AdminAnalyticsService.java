package com.ambrosia.ambrosia.application.service.admin;

import com.ambrosia.ambrosia.domain.repository.ComentarioRepositoryPort;
import com.ambrosia.ambrosia.domain.repository.ForoRepositoryPort;
import com.ambrosia.ambrosia.domain.repository.RecursoRepositoryPort;
import com.ambrosia.ambrosia.domain.repository.UsuarioRepositoryPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AdminAnalyticsService {

    private final UsuarioRepositoryPort usuarioRepository;
    private final RecursoRepositoryPort recursoRepository;
    private final ForoRepositoryPort foroRepository;
    private final ComentarioRepositoryPort comentarioRepository;

    public Map<String, Long> getUsersGrowth(int lastDays) {
        Map<String, Long> growthData = new LinkedHashMap<>();
        LocalDate today = LocalDate.now();

        for (int i = lastDays - 1; i >= 0; i--) {
            LocalDate date = today.minusDays(i);
            LocalDateTime startOfDay = date.atStartOfDay();
            LocalDateTime endOfDay = date.plusDays(1).atStartOfDay().minusNanos(1);
            long count = usuarioRepository.countByFechaRegistroBetween(startOfDay, endOfDay);
            growthData.put(date.toString(), count);
        }
        return growthData;
    }

    public Map<String, Long> getResourcesStats() {
        Map<String, Long> stats = new LinkedHashMap<>();
        stats.put("totalResources", recursoRepository.count());
        return stats;
    }

    public Map<String, Long> getForumStats() {
        Map<String, Long> stats = new LinkedHashMap<>();
        stats.put("totalTopics", foroRepository.count());
        stats.put("totalComments", comentarioRepository.count());
        return stats;
    }

    public Map<String, Object> getSummary() {
        Map<String, Object> summary = new LinkedHashMap<>();
        summary.put("totalUsers", usuarioRepository.count());
        summary.put("totalResources", recursoRepository.count());
        summary.put("totalTopics", foroRepository.count());
        summary.put("totalComments", comentarioRepository.count());
        return summary;
    }
}
