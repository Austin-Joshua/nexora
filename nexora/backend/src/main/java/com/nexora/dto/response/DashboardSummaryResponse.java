package com.nexora.dto.response;

import lombok.*;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardSummaryResponse {
    private List<EmailResponse> priorityEmails;
    private List<EmailResponse> upcomingDeadlines;
    private List<ActionItemResponse> pendingActions;
    private long unreadCount;
    private Map<String, Long> categoryCounts;
    private List<EmailResponse> todaysMeetings;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ActionItemResponse {
        private Long id;
        private Long emailId;
        private String emailSubject;
        private String senderName;
        private String actionType;
        private String actionDescription;
        private String deadline;
        private Boolean isCompleted;
    }
}
