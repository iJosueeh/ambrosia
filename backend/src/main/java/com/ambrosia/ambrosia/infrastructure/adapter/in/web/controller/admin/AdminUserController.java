package com.ambrosia.ambrosia.infrastructure.adapter.in.web.controller.admin;

import com.ambrosia.ambrosia.application.service.ExcelExportService;
import com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto.UsuarioDTO;
import com.ambrosia.ambrosia.application.service.admin.AdminUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/users")
@RequiredArgsConstructor
public class AdminUserController {

    private final AdminUserService adminUserService;
    private final ExcelExportService excelExportService;

    @GetMapping
    public ResponseEntity<Page<UsuarioDTO>> getAllUsers(
            Pageable pageable,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String role) {
        Page<UsuarioDTO> users = adminUserService.getAllUsers(pageable, search, role);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/export/excel")
    public ResponseEntity<InputStreamResource> exportUsuariosToExcel() throws IOException {
        ByteArrayInputStream in = excelExportService.exportUsuariosToExcel();

        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
        String filename = "usuarios_" + timestamp + ".xlsx";

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=" + filename);

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(
                        MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(new InputStreamResource(in));
    }

    // Other endpoints will be added here
    @GetMapping("/{id}")
    public ResponseEntity<UsuarioDTO> getUserById(@PathVariable UUID id) {
        UsuarioDTO user = adminUserService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UsuarioDTO> updateUser(@PathVariable UUID id, @RequestBody UsuarioDTO usuarioDTO) {
        UsuarioDTO updatedUser = adminUserService.updateUser(id, usuarioDTO);
        return ResponseEntity.ok(updatedUser);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable UUID id) {
        adminUserService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
