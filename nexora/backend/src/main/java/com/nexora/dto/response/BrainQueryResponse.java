package com.nexora.dto.response;

import lombok.*;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BrainQueryResponse {
    private String answer;
    private List<EmailResponse> referencedEmails;
    private Long conversationId;
}
