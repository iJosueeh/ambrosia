package com.ambrosia.ambrosia.controllers.admin;

import com.ambrosia.ambrosia.services.admin.AdminAnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/analytics")
@RequiredArgsConstructor
public class AdminAnalyticsController {

    private final AdminAnalyticsService adminAnalyticsService;

    @GetMapping("/users-growth")
    public ResponseEntity<Map<String, Long>> getUsersGrowth(@RequestParam(defaultValue = "7") int lastDays) {
        return ResponseEntity.ok(adminAnalyticsService.getUsersGrowth(lastDays));
    }

    @GetMapping("/resources-stats")
    public ResponseEntity<Map<String, Long>> getResourcesStats() {
        return ResponseEntity.ok(adminAnalyticsService.getResourcesStats());
    }

    @GetMapping("/forum-stats")
    public ResponseEntity<Map<String, Long>> getForumStats() {
        return ResponseEntity.ok(adminAnalyticsService.getForumStats());
    }

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getSummary() {
        return ResponseEntity.ok(adminAnalyticsService.getSummary());
    }
}
