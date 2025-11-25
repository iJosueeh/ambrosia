package com.ambrosia.ambrosia.controllers;

import com.ambrosia.ambrosia.dtos.AdminDashboardDTO;
import com.ambrosia.ambrosia.services.AdminDashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin/dashboard")
@PreAuthorize("hasRole('ADMIN')") // Asegura que solo los admins puedan acceder
public class AdminDashboardController {

    @Autowired
    private AdminDashboardService adminDashboardService;

    @GetMapping("/data")
    public ResponseEntity<AdminDashboardDTO> getDashboardData() {
        AdminDashboardDTO data = adminDashboardService.getDashboardData();
        return ResponseEntity.ok(data);
    }
}
