package com.nexora.dto.response;

import java.util.List;

public class BrainQueryResponse {
    private String answer;
    private List<EmailResponse> referencedEmails;
    private Long conversationId;

    public BrainQueryResponse() {}

    public BrainQueryResponse(String answer, List<EmailResponse> referencedEmails, Long conversationId) {
        this.answer = answer;
        this.referencedEmails = referencedEmails;
        this.conversationId = conversationId;
    }

    public String getAnswer() {
        return answer;
    }

    public void setAnswer(String answer) {
        this.answer = answer;
    }

    public List<EmailResponse> getReferencedEmails() {
        return referencedEmails;
    }

    public void setReferencedEmails(List<EmailResponse> referencedEmails) {
        this.referencedEmails = referencedEmails;
    }

    public Long getConversationId() {
        return conversationId;
    }

    public void setConversationId(Long conversationId) {
        this.conversationId = conversationId;
    }

    public static BrainQueryResponseBuilder builder() {
        return new BrainQueryResponseBuilder();
    }

    public static class BrainQueryResponseBuilder {
        private String answer;
        private List<EmailResponse> referencedEmails;
        private Long conversationId;

        BrainQueryResponseBuilder() {}

        public BrainQueryResponseBuilder answer(String answer) {
            this.answer = answer;
            return this;
        }

        public BrainQueryResponseBuilder referencedEmails(List<EmailResponse> referencedEmails) {
            this.referencedEmails = referencedEmails;
            return this;
        }

        public BrainQueryResponseBuilder conversationId(Long conversationId) {
            this.conversationId = conversationId;
            return this;
        }

        public BrainQueryResponse build() {
            return new BrainQueryResponse(this.answer, this.referencedEmails, this.conversationId);
        }
    }
}
