package com.nexora.controller;

import com.nexora.dto.response.EmailResponse;
import com.nexora.dto.response.SenderSummaryResponse;
import com.nexora.model.User;
import com.nexora.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
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

    /**
     * Returns a ranked list of senders with email count and latest subject.
     * Used by the frontend "Senders" tab in the inbox.
     */
    @GetMapping("/by-sender")
    public ResponseEntity<List<SenderSummaryResponse>> getEmailsBySender(
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(emailService.getSenderSummary(user.getId()));
    }

    /**
     * Returns paginated emails from a specific sender email address.
     */
    @GetMapping("/sender/{senderEmail}")
    public ResponseEntity<Page<EmailResponse>> getEmailsFromSender(
            @AuthenticationPrincipal User user,
            @PathVariable String senderEmail,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(
                emailService.getEmailsBySender(user.getId(), senderEmail, page, size));
    }

    @GetMapping("/thread/{threadId}")
    public ResponseEntity<List<EmailResponse>> getEmailThread(
            @AuthenticationPrincipal User user,
            @PathVariable String threadId) {
        return ResponseEntity.ok(emailService.getEmailThread(user.getId(), threadId));
    }

    @PostMapping("/{id}/draft-reply")
    public ResponseEntity<Map<String, String>> draftReply(
            @AuthenticationPrincipal User user,
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        String style = body.getOrDefault("style", "PROFESSIONAL");
        String draft = emailService.draftReply(user.getId(), id, style);
        return ResponseEntity.ok(Map.of("draft", draft));
    }
}
