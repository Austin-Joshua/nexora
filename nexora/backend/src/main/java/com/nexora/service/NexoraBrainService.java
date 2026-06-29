package com.nexora.service;

import com.nexora.dto.response.BrainQueryResponse;
import com.nexora.dto.response.EmailResponse;
import com.nexora.model.BrainConversation;
import com.nexora.model.Email;
import com.nexora.repository.BrainConversationRepository;
import com.nexora.repository.EmailRepository;
import com.nexora.repository.UserRepository;
import com.nexora.exception.NexoraException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class NexoraBrainService {

    private final EmailRepository emailRepository;
    private final BrainConversationRepository conversationRepository;
    private final UserRepository userRepository;
    private final EmailClassificationService claudeClient;
    private final EmailService emailService;

    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("MMM dd, yyyy HH:mm");

    public BrainQueryResponse query(Long userId, String userQuery) {
        if (!userRepository.existsById(userId)) {
            throw new NexoraException("User not found", 404);
        }

        // Step 1: Fetch last 20 emails
        List<Email> recentEmails = emailRepository.findTop20ByUserIdOrderByReceivedAtDesc(userId);

        // Step 2: Build context
        String emailContext = buildEmailContext(recentEmails);

        // Step 3: Call Claude
        String systemPrompt = """
You are Nexora Brain, a personal communication assistant. You have access to the user's recent emails (summarized below). Answer the user's question based ONLY on the information in these emails. Be specific — mention sender names, dates, and subject lines when relevant. If the answer is not found in the emails, say so clearly.

User's email history:
%s
""".formatted(emailContext);

        String answer = claudeClient.callClaude(systemPrompt, userQuery);
        if (answer == null) answer = "I'm sorry, I couldn't process your query right now. Please try again.";

        // Step 4: Find referenced emails (simple keyword match)
        List<Email> referenced = findReferencedEmails(recentEmails, userQuery, answer);

        // Step 5: Save conversation
        @SuppressWarnings("null")
        List<Long> refIds = referenced.stream().map(Email::getId).collect(Collectors.toList());
        BrainConversation conversation = BrainConversation.builder()
                .userId(userId)
                .userQuery(userQuery)
                .aiResponse(answer)
                .referencedEmailIds(refIds.toString())
                .build();
        conversation = conversationRepository.save(conversation);

        List<EmailResponse> refResponses = referenced.stream()
                .map(e -> emailService.toResponse(e, false))
                .collect(Collectors.toList());

        return BrainQueryResponse.builder()
                .answer(answer)
                .referencedEmails(refResponses)
                .conversationId(conversation.getId())
                .build();
    }

    public List<BrainConversation> getHistory(Long userId) {
        return conversationRepository.findByUserIdOrderByCreatedAtDesc(userId,
                org.springframework.data.domain.PageRequest.of(0, 20));
    }

    private String buildEmailContext(List<Email> emails) {
        StringBuilder sb = new StringBuilder();
        for (Email e : emails) {
            sb.append("[").append(e.getReceivedAt() != null ? e.getReceivedAt().format(DATE_FMT) : "Unknown date").append("] ");
            sb.append("FROM: ").append(e.getSenderName() != null ? e.getSenderName() : "").append(" <").append(e.getSenderEmail()).append("> | ");
            sb.append("SUBJECT: ").append(e.getSubject() != null ? e.getSubject() : "(no subject)").append(" | ");
            sb.append("CATEGORY: ").append(e.getCategory()).append(" | ");
            sb.append("PRIORITY: ").append(e.getPriority()).append(" | ");
            if (e.getAiSummary() != null) {
                sb.append("SUMMARY: ").append(e.getAiSummary());
            } else if (e.getBodySnippet() != null) {
                sb.append("SNIPPET: ").append(e.getBodySnippet());
            }
            sb.append("\n");
        }
        return sb.toString();
    }

    private List<Email> findReferencedEmails(List<Email> emails, String query, String answer) {
        // Return emails whose subject/sender appears in the AI answer
        return emails.stream()
                .filter(e -> {
                    String sub = e.getSubject() != null ? e.getSubject().toLowerCase() : "";
                    String sender = e.getSenderName() != null ? e.getSenderName().toLowerCase() : "";
                    String ans = answer.toLowerCase();
                    return (!sub.isEmpty() && ans.contains(sub.substring(0, Math.min(sub.length(), 10)))) ||
                           (!sender.isEmpty() && ans.contains(sender.split(" ")[0].toLowerCase()));
                })
                .limit(5)
                .collect(Collectors.toList());
    }
}
