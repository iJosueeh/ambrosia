package com.ambrosia.ambrosia.infrastructure.adapter.in.web.controller.admin;

import com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto.CommentAdminDTO;
import com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto.ForumAdminDTO;
import com.ambrosia.ambrosia.application.service.admin.AdminForumService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/forum")
@RequiredArgsConstructor
public class AdminForumController {

    private final AdminForumService adminForumService;

    // --- Forum Topics ---

    @GetMapping("/topics")
    public ResponseEntity<Page<ForumAdminDTO>> getAllTopics(
            Pageable pageable,
            @RequestParam(required = false, defaultValue = "ALL") String status) {
        Page<ForumAdminDTO> topics = adminForumService.getAllForums(pageable, status);
        return ResponseEntity.ok(topics);
    }

    @GetMapping("/topics/{id}")
    public ResponseEntity<ForumAdminDTO> getTopicById(@PathVariable UUID id) {
        ForumAdminDTO topic = adminForumService.getForumById(id);
        return ResponseEntity.ok(topic);
    }

    @PutMapping("/topics/{id}/status")
    public ResponseEntity<ForumAdminDTO> updateTopicStatus(@PathVariable UUID id, @RequestParam String newStatus) {
        ForumAdminDTO updatedTopic = adminForumService.updateForumStatus(id, newStatus);
        return ResponseEntity.ok(updatedTopic);
    }

    @DeleteMapping("/topics/{id}")
    public ResponseEntity<Void> deleteTopic(@PathVariable UUID id) {
        adminForumService.deleteForum(id);
        return ResponseEntity.noContent().build();
    }

    // --- Comments ---

    @GetMapping("/comments")
    public ResponseEntity<Page<CommentAdminDTO>> getAllComments(
            Pageable pageable,
            @RequestParam(required = false, defaultValue = "ALL") String status) {
        Page<CommentAdminDTO> comments = adminForumService.getAllComments(pageable, status);
        return ResponseEntity.ok(comments);
    }

    @GetMapping("/comments/{id}")
    public ResponseEntity<CommentAdminDTO> getCommentById(@PathVariable UUID id) {
        CommentAdminDTO comment = adminForumService.getCommentById(id);
        return ResponseEntity.ok(comment);
    }

    @PutMapping("/comments/{id}/status")
    public ResponseEntity<CommentAdminDTO> updateCommentStatus(@PathVariable UUID id, @RequestParam String newStatus) {
        CommentAdminDTO updatedComment = adminForumService.updateCommentStatus(id, newStatus);
        return ResponseEntity.ok(updatedComment);
    }

    @DeleteMapping("/comments/{id}")
    public ResponseEntity<Void> deleteComment(@PathVariable UUID id) {
        adminForumService.deleteComment(id);
        return ResponseEntity.noContent().build();
    }
}
