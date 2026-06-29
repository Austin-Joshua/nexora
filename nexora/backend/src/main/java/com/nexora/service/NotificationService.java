package com.nexora.service;

import com.nexora.model.Email;
import com.nexora.model.EmailAction;
import com.nexora.model.Notification;
import com.nexora.repository.EmailActionRepository;
import com.nexora.repository.EmailRepository;
import com.nexora.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final EmailRepository emailRepository;
    private final EmailActionRepository actionRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public List<Notification> getUserNotifications(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public void markRead(Long userId, Long notificationId) {
        notificationRepository.findById(notificationId).ifPresent(n -> {
            if (n.getUserId().equals(userId)) {
                n.setIsRead(true);
                notificationRepository.save(n);
            }
        });
    }

    @org.springframework.transaction.annotation.Transactional
    public void markAllRead(Long userId) {
        notificationRepository.markAllReadByUserId(userId);
    }

    public long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }

    /**
     * Called by scheduler — generate daily digest and deadline notifications.
     */
    public void generateDailyNotifications(Long userId) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime tomorrow = now.plusDays(1);

        // Check deadlines today or tomorrow
        List<EmailAction> urgentActions = actionRepository
                .findByUserIdAndDeadlineBetweenOrderByDeadlineAsc(userId, now, tomorrow);

        for (EmailAction action : urgentActions) {
            if (!action.getIsCompleted()) {
                Notification notification = Notification.builder()
                        .userId(userId)
                        .title("⏰ Deadline Soon")
                        .message(action.getActionDescription() + " — due " + action.getDeadline())
                        .notificationType(Notification.NotificationType.DEADLINE)
                        .relatedEmailId(action.getEmail() != null ? action.getEmail().getId() : null)
                        .build();
                Notification saved = notificationRepository.save(notification);
                pushNotification(userId.toString(), saved);
            }
        }

        // Check unread HIGH priority emails in last 24h
        LocalDateTime since = now.minusHours(24);
        List<Email> highPriorityEmails = emailRepository
                .findByUserIdAndPriorityAndIsReadFalseOrderByReceivedAtDesc(
                        userId, Email.Priority.HIGH,
                        org.springframework.data.domain.PageRequest.of(0, 5));

        for (Email email : highPriorityEmails) {
            if (email.getReceivedAt() != null && email.getReceivedAt().isAfter(since)) {
                Notification notification = Notification.builder()
                        .userId(userId)
                        .title("📧 Important Email")
                        .message("High priority email from " + email.getSenderName() + ": " + email.getSubject())
                        .notificationType(Notification.NotificationType.IMPORTANT_EMAIL)
                        .relatedEmailId(email.getId())
                        .build();
                Notification saved = notificationRepository.save(notification);
                pushNotification(userId.toString(), saved);
            }
        }
    }

    public void createNotification(Long userId, String title, String message,
                                    Notification.NotificationType type, Long relatedEmailId) {
        Notification notification = Notification.builder()
                .userId(userId)
                .title(title)
                .message(message)
                .notificationType(type)
                .relatedEmailId(relatedEmailId)
                .build();
        Notification saved = notificationRepository.save(notification);
        pushNotification(userId.toString(), saved);
    }

    private void pushNotification(String userId, Notification notification) {
        try {
            messagingTemplate.convertAndSendToUser(userId, "/notifications", notification);
        } catch (Exception e) {
            log.warn("WebSocket push failed for user {}: {}", userId, e.getMessage());
        }
    }
}
