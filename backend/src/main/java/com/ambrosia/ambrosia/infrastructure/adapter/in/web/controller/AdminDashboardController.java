package com.ambrosia.ambrosia.infrastructure.adapter.in.web.controller;

import com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto.AdminDashboardDTO;
import com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto.DashboardStatsDTO;
import com.ambrosia.ambrosia.application.service.AdminDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin/dashboard")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminDashboardController {

    private final AdminDashboardService adminDashboardService;

    @GetMapping("/data")
    public ResponseEntity<AdminDashboardDTO> getDashboardData() {
        AdminDashboardDTO data = adminDashboardService.getDashboardData();
        return ResponseEntity.ok(data);
    }

    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsDTO> getStats() {
        DashboardStatsDTO stats = adminDashboardService.obtenerEstadisticas();
        return ResponseEntity.ok(stats);
    }
}
