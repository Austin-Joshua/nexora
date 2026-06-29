package com.nexora.dto.response;

import com.nexora.model.Email.EmailCategory;
import com.nexora.model.Email.Priority;
import com.nexora.model.EmailAction;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmailResponse {
    private Long id;
    private String gmailMessageId;
    private String gmailThreadId;
    private String senderName;
    private String senderEmail;
    private String subject;
    private String bodySnippet;
    private String bodyFull;
    private LocalDateTime receivedAt;
    private Boolean isRead;
    private Boolean hasAttachments;
    private EmailCategory category;
    private Priority priority;
    private String aiSummary;
    private String aiActionItems;
    private LocalDateTime deadlineDetected;
    private Boolean isDeadlineAddedToCalendar;
    private List<ActionItemDto> actions;
    private LocalDateTime createdAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ActionItemDto {
        private Long id;
        private EmailAction.ActionType actionType;
        private String actionDescription;
        private LocalDateTime deadline;
        private Boolean isCompleted;
    }
}
