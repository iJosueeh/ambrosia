package com.ambrosia.ambrosia.controllers.admin;

import com.ambrosia.ambrosia.models.RecursoEducativo;
import com.ambrosia.ambrosia.models.dto.ResourceAdminDTO;
import com.ambrosia.ambrosia.models.dto.ResourceUpdateDTO;
import com.ambrosia.ambrosia.services.admin.AdminResourceService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/resources")
@RequiredArgsConstructor
public class AdminResourceController {

    private final AdminResourceService adminResourceService;

    @GetMapping
    public ResponseEntity<Page<ResourceAdminDTO>> getAllResources(
            Pageable pageable,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Long statusId) {
        Page<ResourceAdminDTO> resources = adminResourceService.getAllResources(pageable, search, categoryId, statusId);
        return ResponseEntity.ok(resources);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResourceAdminDTO> getResourceById(@PathVariable Long id) {
        ResourceAdminDTO resource = adminResourceService.getResourceById(id);
        return ResponseEntity.ok(resource);
    }

    @PostMapping
    public ResponseEntity<RecursoEducativo> createResource(@RequestBody ResourceUpdateDTO resourceDTO) {
        RecursoEducativo newResource = adminResourceService.createResource(resourceDTO);
        return new ResponseEntity<>(newResource, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<RecursoEducativo> updateResource(@PathVariable Long id, @RequestBody ResourceUpdateDTO resourceDTO) {
        RecursoEducativo updatedResource = adminResourceService.updateResource(id, resourceDTO);
        return ResponseEntity.ok(updatedResource);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResource(@PathVariable Long id) {
        adminResourceService.deleteResource(id);
        return ResponseEntity.noContent().build();
    }
}
