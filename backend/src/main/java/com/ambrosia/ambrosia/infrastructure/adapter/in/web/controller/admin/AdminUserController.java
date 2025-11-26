package com.ambrosia.ambrosia.infrastructure.adapter.in.web.controller.admin;

import com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto.UsuarioDTO;
import com.ambrosia.ambrosia.application.service.admin.AdminUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/users")
@RequiredArgsConstructor
public class AdminUserController {

    private final AdminUserService adminUserService;

    @GetMapping
    public ResponseEntity<Page<UsuarioDTO>> getAllUsers(
            Pageable pageable,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String role) {
        Page<UsuarioDTO> users = adminUserService.getAllUsers(pageable, search, role);
        return ResponseEntity.ok(users);
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
