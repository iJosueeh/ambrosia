package com.ambrosia.ambrosia.infrastructure.adapter.in.web.controller.admin;

import com.ambrosia.ambrosia.domain.model.RecursoEducativo;
import com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto.ResourceAdminDTO;
import com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto.ResourceUpdateDTO;
import com.ambrosia.ambrosia.application.service.admin.AdminResourceService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/resources")
@RequiredArgsConstructor
public class AdminResourceController {

    private final AdminResourceService adminResourceService;

    @GetMapping
    public ResponseEntity<Page<ResourceAdminDTO>> getAllResources(
            Pageable pageable,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) UUID categoryId,
            @RequestParam(required = false) UUID statusId) {
        Page<ResourceAdminDTO> resources = adminResourceService.getAllResources(pageable, search, categoryId, statusId);
        return ResponseEntity.ok(resources);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResourceAdminDTO> getResourceById(@PathVariable UUID id) {
        ResourceAdminDTO resource = adminResourceService.getResourceById(id);
        return ResponseEntity.ok(resource);
    }

    @PostMapping
    public ResponseEntity<RecursoEducativo> createResource(@RequestBody ResourceUpdateDTO resourceDTO) {
        RecursoEducativo newResource = adminResourceService.createResource(resourceDTO);
        return new ResponseEntity<>(newResource, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<RecursoEducativo> updateResource(@PathVariable UUID id,
            @RequestBody ResourceUpdateDTO resourceDTO) {
        RecursoEducativo updatedResource = adminResourceService.updateResource(id, resourceDTO);
        return ResponseEntity.ok(updatedResource);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResource(@PathVariable UUID id) {
        adminResourceService.deleteResource(id);
        return ResponseEntity.noContent().build();
    }
}
