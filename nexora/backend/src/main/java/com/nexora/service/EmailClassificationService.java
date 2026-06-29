package com.nexora.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nexora.config.ClaudeConfig;
import com.nexora.model.Email;
import com.nexora.model.Email.EmailCategory;
import com.nexora.model.Email.Priority;
import com.nexora.model.EmailAction;
import com.nexora.model.User;
import com.nexora.repository.EmailActionRepository;
import com.nexora.repository.EmailRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailClassificationService {

    private final ClaudeConfig claudeConfig;
    private final EmailRepository emailRepository;
    private final EmailActionRepository actionRepository;
    private final ObjectMapper objectMapper;
    private final java.util.concurrent.Semaphore semaphore = new java.util.concurrent.Semaphore(10);

    @Async
    public void classifyEmail(Long emailId, User user) {
        try {
            semaphore.acquire();
            try {
                Email email = emailRepository.findById(emailId).orElse(null);
                if (email == null) return;

                String body = email.getBodyFull() != null ? email.getBodyFull() : email.getBodySnippet();
                if (body == null) body = "";
                // Trim to avoid huge token usage
                if (body.length() > 4000) body = body.substring(0, 4000);

                String systemPrompt = buildSystemPrompt(user);
                String userMessage  = buildUserMessage(email, body);

                String rawResponse = callClaude(systemPrompt, userMessage);
                if (rawResponse == null) return;

                JsonNode result = parseJson(rawResponse);
                if (result == null) return;

                // Update email record
                email.setCategory(parseCategory(result));
                email.setPriority(parsePriority(result));
                email.setAiSummary(getText(result, "summary"));
                email.setAiActionItems(result.has("action_items") ? result.get("action_items").toString() : null);

                String deadlineStr = getText(result, "deadline");
                if (deadlineStr != null && !deadlineStr.equalsIgnoreCase("null")) {
                    try {
                        email.setDeadlineDetected(LocalDateTime.parse(deadlineStr, DateTimeFormatter.ISO_DATE_TIME));
                    } catch (Exception ignored) {}
                }

                emailRepository.save(email);

                // Save action items
                if (result.has("action_items") && result.get("action_items").isArray()) {
                    saveActionItems(result.get("action_items"), email, user.getId());
                }

                log.info("Classified email {} as {} / {}", emailId, email.getCategory(), email.getPriority());

            } catch (Exception e) {
                log.error("Classification failed for email {}: {}", emailId, e.getMessage());
            } finally {
                semaphore.release();
            }
        } catch (InterruptedException e) {
            log.error("Classification semaphore acquisition interrupted for email {}: {}", emailId, e.getMessage());
            Thread.currentThread().interrupt();
        }
    }

    private String buildSystemPrompt(User user) {
        return """
You are Nexora's email intelligence engine. Analyze the email below and respond ONLY with a valid JSON object — no explanation, no markdown, no extra text.

User profile: %s

Categories available: ASSIGNMENT, ATTENDANCE, HACKATHON, PLACEMENT, INTERNSHIP, MEETING, ANNOUNCEMENT, RESEARCH, FINANCE, PERSONAL, PROMOTIONAL, SPAM, UNCATEGORIZED

Respond with this exact JSON structure:
{
  "category": "CATEGORY_NAME",
  "priority": "HIGH | MEDIUM | LOW",
  "summary": "2-3 sentence summary of what this email is about",
  "action_items": [
    {
      "action_type": "REGISTER | REPLY | SUBMIT | UPLOAD | REVIEW | ATTEND | OTHER",
      "description": "what the user needs to do",
      "deadline": "ISO 8601 datetime or null"
    }
  ],
  "deadline": "ISO 8601 datetime of the most important deadline or null"
}

Priority rules for %s profile:
- HIGH: professor emails, placement notices, assignment deadlines within 3 days, hackathon registrations
- MEDIUM: general announcements, internship opportunities, meeting invitations
- LOW: newsletters, promotional emails, distant deadlines
""".formatted(user.getUserRole(), user.getUserRole());
    }

    private String buildUserMessage(Email email, String body) {
        return """
From: %s (%s)
Subject: %s
Body:
%s
""".formatted(
            email.getSenderName() != null ? email.getSenderName() : "",
            email.getSenderEmail(),
            email.getSubject() != null ? email.getSubject() : "(no subject)",
            body);
    }

    public String callClaude(String systemPrompt, String userMessage) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", claudeConfig.getModel());
            requestBody.put("max_tokens", 1024);
            requestBody.put("system", systemPrompt);
            requestBody.put("messages", List.of(
                Map.of("role", "user", "content", userMessage)
            ));

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, claudeConfig.buildHeaders());
            @SuppressWarnings("rawtypes")
            ResponseEntity<Map> response = restTemplate.postForEntity(claudeConfig.getApiUrl(), request, Map.class);

            if (response.getBody() != null && response.getBody().containsKey("content")) {
                @SuppressWarnings("unchecked")
                List<Map<String, Object>> content = (List<Map<String, Object>>) response.getBody().get("content");
                if (!content.isEmpty()) {
                    return (String) content.get(0).get("text");
                }
            }
        } catch (Exception e) {
            log.error("Claude API call failed: {}", e.getMessage());
        }
        return null;
    }

    private JsonNode parseJson(String rawResponse) {
        try {
            // Strip markdown code fences if present
            String cleaned = rawResponse.trim();
            if (cleaned.startsWith("```")) {
                cleaned = cleaned.replaceAll("```json", "").replaceAll("```", "").trim();
            }
            return objectMapper.readTree(cleaned);
        } catch (Exception e) {
            log.error("Failed to parse Claude JSON response: {}", e.getMessage());
            return null;
        }
    }

    private EmailCategory parseCategory(JsonNode node) {
        try {
            return EmailCategory.valueOf(getText(node, "category"));
        } catch (Exception e) {
            return EmailCategory.UNCATEGORIZED;
        }
    }

    private Priority parsePriority(JsonNode node) {
        try {
            return Priority.valueOf(getText(node, "priority"));
        } catch (Exception e) {
            return Priority.MEDIUM;
        }
    }

    private String getText(JsonNode node, String field) {
        if (node.has(field) && !node.get(field).isNull()) {
            return node.get(field).asText();
        }
        return null;
    }

    private void saveActionItems(JsonNode items, Email email, Long userId) {
        for (JsonNode item : items) {
            try {
                EmailAction action = EmailAction.builder()
                        .email(email)
                        .userId(userId)
                        .actionType(parseActionType(getText(item, "action_type")))
                        .actionDescription(getText(item, "description") != null ? getText(item, "description") : "Action required")
                        .build();

                String deadline = getText(item, "deadline");
                if (deadline != null && !deadline.equalsIgnoreCase("null")) {
                    try {
                        action.setDeadline(LocalDateTime.parse(deadline, DateTimeFormatter.ISO_DATE_TIME));
                    } catch (Exception ignored) {}
                }
                actionRepository.save(action);
            } catch (Exception e) {
                log.warn("Could not save action item: {}", e.getMessage());
            }
        }
    }

    private EmailAction.ActionType parseActionType(String type) {
        try {
            return EmailAction.ActionType.valueOf(type);
        } catch (Exception e) {
            return EmailAction.ActionType.OTHER;
        }
    }
}
