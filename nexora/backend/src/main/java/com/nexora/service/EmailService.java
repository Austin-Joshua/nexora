package com.nexora.service;

import com.nexora.exception.NexoraException;
import com.nexora.model.Email;
import com.nexora.model.Email.EmailCategory;
import com.nexora.model.Email.Priority;
import com.nexora.repository.EmailRepository;
import com.nexora.dto.response.EmailResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final EmailRepository emailRepository;
    private final GmailSyncService gmailSyncService;

    public Page<EmailResponse> getEmails(Long userId, String category, String priority,
                                          String search, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("receivedAt").descending());

        Page<Email> emailPage;

        if (search != null && !search.isBlank()) {
            emailPage = emailRepository.searchByUserId(userId, search, pageable);
        } else if (category != null && priority != null) {
            emailPage = emailRepository.findByUserIdAndCategoryAndPriorityOrderByReceivedAtDesc(
                    userId, EmailCategory.valueOf(category), Priority.valueOf(priority), pageable);
        } else if (category != null) {
            emailPage = emailRepository.findByUserIdAndCategoryOrderByReceivedAtDesc(
                    userId, EmailCategory.valueOf(category), pageable);
        } else if (priority != null) {
            emailPage = emailRepository.findByUserIdAndPriorityOrderByReceivedAtDesc(
                    userId, Priority.valueOf(priority), pageable);
        } else {
            emailPage = emailRepository.findByUserIdOrderByReceivedAtDesc(userId, pageable);
        }

        return emailPage.map(e -> toResponse(e, false));
    }

    public EmailResponse getEmailDetail(Long userId, Long emailId) {
        Email email = emailRepository.findByIdAndUserId(emailId, userId)
                .orElseThrow(() -> new NexoraException("Email not found", 404));
        return toResponse(email, true);
    }

    public void markRead(Long userId, Long emailId) {
        Email email = emailRepository.findByIdAndUserId(emailId, userId)
                .orElseThrow(() -> new NexoraException("Email not found", 404));
        email.setIsRead(true);
        emailRepository.save(email);
    }

    public void triggerSync(Long userId) {
        gmailSyncService.syncInbox(userId);
    }

    public Map<String, Long> getCategoryCounts(Long userId) {
        List<Object[]> results = emailRepository.countByUserIdGroupByCategory(userId);
        Map<String, Long> counts = new LinkedHashMap<>();
        for (Object[] row : results) {
            counts.put(row[0].toString(), (Long) row[1]);
        }
        return counts;
    }

    public EmailResponse toResponse(Email email, boolean includeFullBody) {
        List<EmailResponse.ActionItemDto> actions = new ArrayList<>();
        if (email.getActions() != null) {
            actions = email.getActions().stream().map(a -> EmailResponse.ActionItemDto.builder()
                    .id(a.getId())
                    .actionType(a.getActionType())
                    .actionDescription(a.getActionDescription())
                    .deadline(a.getDeadline())
                    .isCompleted(a.getIsCompleted())
                    .build()).collect(Collectors.toList());
        }

        return EmailResponse.builder()
                .id(email.getId())
                .gmailMessageId(email.getGmailMessageId())
                .gmailThreadId(email.getGmailThreadId())
                .senderName(email.getSenderName())
                .senderEmail(email.getSenderEmail())
                .subject(email.getSubject())
                .bodySnippet(email.getBodySnippet())
                .bodyFull(includeFullBody ? email.getBodyFull() : null)
                .receivedAt(email.getReceivedAt())
                .isRead(email.getIsRead())
                .hasAttachments(email.getHasAttachments())
                .category(email.getCategory())
                .priority(email.getPriority())
                .aiSummary(email.getAiSummary())
                .aiActionItems(email.getAiActionItems())
                .deadlineDetected(email.getDeadlineDetected())
                .isDeadlineAddedToCalendar(email.getIsDeadlineAddedToCalendar())
                .actions(actions)
                .createdAt(email.getCreatedAt())
                .build();
    }
}
