package com.ambrosia.ambrosia.application.port.in.admin;

import com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto.DashboardStatsDTO;

public interface ObtenerAnalyticasUseCase {
    DashboardStatsDTO obtenerEstadisticas();
}
