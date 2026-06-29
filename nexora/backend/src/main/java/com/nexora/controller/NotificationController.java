package com.nexora.controller;

import com.nexora.model.Notification;
import com.nexora.model.User;
import com.nexora.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<List<Notification>> getNotifications(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(notificationService.getUserNotifications(user.getId()));
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<Void> markRead(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        notificationService.markRead(user.getId(), id);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/read-all")
    public ResponseEntity<Void> markAllRead(@AuthenticationPrincipal User user) {
        notificationService.markAllRead(user.getId());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(Map.of("count", notificationService.getUnreadCount(user.getId())));
    }
}
