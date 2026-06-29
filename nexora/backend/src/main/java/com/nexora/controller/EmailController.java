package com.nexora.controller;

import com.nexora.dto.response.EmailResponse;
import com.nexora.model.User;
import com.nexora.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/emails")
@RequiredArgsConstructor
public class EmailController {

    private final EmailService emailService;

    @GetMapping
    public ResponseEntity<Page<EmailResponse>> getEmails(
            @AuthenticationPrincipal User user,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String priority,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(emailService.getEmails(user.getId(), category, priority, search, page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmailResponse> getEmail(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        return ResponseEntity.ok(emailService.getEmailDetail(user.getId(), id));
    }

    @PostMapping("/sync")
    public ResponseEntity<Map<String, String>> syncEmails(@AuthenticationPrincipal User user) {
        emailService.triggerSync(user.getId());
        return ResponseEntity.ok(Map.of("message", "Sync triggered successfully"));
    }

    @GetMapping("/categories")
    public ResponseEntity<Map<String, Long>> getCategoryCounts(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(emailService.getCategoryCounts(user.getId()));
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<Void> markRead(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        emailService.markRead(user.getId(), id);
        return ResponseEntity.ok().build();
    }
}
