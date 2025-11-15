package com.ambrosia.ambrosia.controllers.admin;

import com.ambrosia.ambrosia.models.dto.AdminProfileDTO;
import com.ambrosia.ambrosia.services.admin.AdminSettingsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin") // Note: Not /admin/settings, but directly under /admin
@RequiredArgsConstructor
public class AdminSettingsController {

    private final AdminSettingsService adminSettingsService;

    @GetMapping("/profile")
    public ResponseEntity<AdminProfileDTO> getAdminProfile() {
        return ResponseEntity.ok(adminSettingsService.getAdminProfile());
    }

    @PutMapping("/profile")
    public ResponseEntity<AdminProfileDTO> updateAdminProfile(@RequestBody AdminProfileDTO profileDTO) {
        return ResponseEntity.ok(adminSettingsService.updateAdminProfile(profileDTO));
    }

    @PutMapping("/preferences")
    public ResponseEntity<Void> updateAdminPreferences() {
        // This is a placeholder. Actual implementation would depend on what preferences are.
        adminSettingsService.updateAdminPreferences();
        return ResponseEntity.ok().build();
    }
}
