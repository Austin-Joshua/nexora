package com.nexora.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDateTime;

public class SenderSummaryResponse {
    private String senderEmail;
    private String senderName;
    private Long emailCount;
    private String latestSubject;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime latestReceivedAt;

    public SenderSummaryResponse() {}

    public SenderSummaryResponse(String senderEmail, String senderName, Long emailCount, String latestSubject, LocalDateTime latestReceivedAt) {
        this.senderEmail = senderEmail;
        this.senderName = senderName;
        this.emailCount = emailCount;
        this.latestSubject = latestSubject;
        this.latestReceivedAt = latestReceivedAt;
    }

    public String getSenderEmail() {
        return senderEmail;
    }

    public void setSenderEmail(String senderEmail) {
        this.senderEmail = senderEmail;
    }

    public String getSenderName() {
        return senderName;
    }

    public void setSenderName(String senderName) {
        this.senderName = senderName;
    }

    public Long getEmailCount() {
        return emailCount;
    }

    public void setEmailCount(Long emailCount) {
        this.emailCount = emailCount;
    }

    public String getLatestSubject() {
        return latestSubject;
    }

    public void setLatestSubject(String latestSubject) {
        this.latestSubject = latestSubject;
    }

    public LocalDateTime getLatestReceivedAt() {
        return latestReceivedAt;
    }

    public void setLatestReceivedAt(LocalDateTime latestReceivedAt) {
        this.latestReceivedAt = latestReceivedAt;
    }

    public static SenderSummaryResponseBuilder builder() {
        return new SenderSummaryResponseBuilder();
    }

    public static class SenderSummaryResponseBuilder {
        private String senderEmail;
        private String senderName;
        private Long emailCount;
        private String latestSubject;
        private LocalDateTime latestReceivedAt;

        SenderSummaryResponseBuilder() {}

        public SenderSummaryResponseBuilder senderEmail(String senderEmail) {
            this.senderEmail = senderEmail;
            return this;
        }

        public SenderSummaryResponseBuilder senderName(String senderName) {
            this.senderName = senderName;
            return this;
        }

        public SenderSummaryResponseBuilder emailCount(Long emailCount) {
            this.emailCount = emailCount;
            return this;
        }

        public SenderSummaryResponseBuilder latestSubject(String latestSubject) {
            this.latestSubject = latestSubject;
            return this;
        }

        public SenderSummaryResponseBuilder latestReceivedAt(LocalDateTime latestReceivedAt) {
            this.latestReceivedAt = latestReceivedAt;
            return this;
        }

        public SenderSummaryResponse build() {
            return new SenderSummaryResponse(this.senderEmail, this.senderName, this.emailCount, this.latestSubject, this.latestReceivedAt);
        }
    }
}
