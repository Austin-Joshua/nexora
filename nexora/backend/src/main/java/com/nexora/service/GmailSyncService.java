package com.nexora.service;

import com.google.api.client.googleapis.json.GoogleJsonResponseException;
import com.google.api.services.gmail.Gmail;
import com.google.api.services.gmail.model.*;
import com.nexora.config.GmailConfig;
import com.nexora.exception.NexoraException;
import com.nexora.model.Email;
import com.nexora.model.User;
import com.nexora.repository.EmailRepository;
import com.nexora.repository.UserRepository;
import com.nexora.security.TokenEncryptor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.GeneralSecurityException;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.*;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
@Slf4j
public class GmailSyncService {

    private final GmailConfig gmailConfig;
    private final UserRepository userRepository;
    private final EmailRepository emailRepository;
    private final TokenEncryptor tokenEncryptor;
    private final EmailClassificationService classificationService;

    private final Set<Long> activeSyncs = java.util.concurrent.ConcurrentHashMap.newKeySet();

    private static final int MAX_RESULTS = 50;
    private static final int MAX_RETRIES = 3;
    private static final Pattern HTML_TAGS = Pattern.compile("<[^>]+>");

    public void syncInbox(Long userId) {
        if (!activeSyncs.add(userId)) {
            log.info("Gmail sync already in progress for user {} — skipping concurrent request", userId);
            return;
        }

        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new NexoraException("User not found", 404));

            if ("mock-google-id-123456".equals(user.getGoogleId())) {
                log.info("Developer bypass user sync triggered — skipping Google API sync and using static mock data");
                user.setLastSyncedAt(LocalDateTime.now());
                userRepository.save(user);
                return;
            }

            if (user.getGmailAccessToken() == null) {
                log.warn("User {} has no Gmail access token — skipping sync", userId);
                return;
            }

            LocalDateTime now = LocalDateTime.now();
            if (user.getTokenExpiry() == null || user.getTokenExpiry().isBefore(now.plusMinutes(5))) {
                log.info("Access token for user {} is expired or close to expiry — refreshing...", userId);
                refreshUserAccessToken(user);
            }

            String accessToken  = tokenEncryptor.decrypt(user.getGmailAccessToken());
            String refreshToken = tokenEncryptor.decrypt(user.getGmailRefreshToken());
            Date   expiry       = user.getTokenExpiry() != null
                    ? Date.from(user.getTokenExpiry().atZone(ZoneId.systemDefault()).toInstant())
                    : new Date();

            Gmail gmail = gmailConfig.buildGmailService(accessToken, refreshToken, expiry);

            // Fetch message list with pagination support (max 200 emails)
            List<Message> allMessages = new ArrayList<>();
            String nextPageToken = null;
            int totalFetched = 0;

            do {
                var listRequest = gmail.users().messages()
                        .list("me")
                        .setMaxResults((long) MAX_RESULTS);
                if (nextPageToken != null) {
                    listRequest.setPageToken(nextPageToken);
                }
                ListMessagesResponse listResponse = listRequest.execute();
                List<Message> messages = listResponse.getMessages();
                if (messages != null) {
                    allMessages.addAll(messages);
                    totalFetched += messages.size();
                }
                nextPageToken = listResponse.getNextPageToken();
            } while (nextPageToken != null && totalFetched < 200);

            if (allMessages.isEmpty()) {
                log.info("No messages found for user {}", userId);
                return;
            }

            // De-duplicate messages by ID in case Google or concurrent threads returned duplicates
            List<Message> uniqueMessages = new ArrayList<>();
            Set<String> seenIds = new HashSet<>();
            for (Message m : allMessages) {
                if (m.getId() != null && seenIds.add(m.getId())) {
                    uniqueMessages.add(m);
                }
            }

            int newCount = 0;
            int updatedCount = 0;
            for (Message msg : uniqueMessages) {
                try {
                    // Check if already synced
                    var existingOpt = emailRepository.findByGmailMessageId(msg.getId());
                    if (existingOpt.isPresent()) {
                        // Update read status if it changed in Gmail
                        Email existing = existingOpt.get();
                        boolean gmailIsRead = msg.getLabelIds() == null || !msg.getLabelIds().contains("UNREAD");
                        if (gmailIsRead != existing.getIsRead()) {
                            existing.setIsRead(gmailIsRead);
                            emailRepository.save(existing);
                            updatedCount++;
                        }
                        continue;
                    }

                    Message fullMessage = fetchWithRetry(gmail, msg.getId());
                    if (fullMessage == null) continue;

                    Email email = parseMessage(fullMessage, user);
                    Email saved = emailRepository.save(email);
                    newCount++;

                    // Async AI classification
                    classificationService.classifyEmail(saved.getId(), user);
                } catch (org.springframework.dao.DataIntegrityViolationException e) {
                    log.warn("Constraint violation saving message {}, skipping: {}", msg.getId(), e.getMessage());
                } catch (Exception e) {
                    log.error("Failed to sync message {}: {}", msg.getId(), e.getMessage());
                }
            }

            // Auto-detect user profession/role on first sync (if currently STUDENT and never synced before)
            boolean isFirstSync = user.getLastSyncedAt() == null;
            if (isFirstSync && user.getUserRole() == User.UserRole.STUDENT) {
                try {
                    List<Email> userEmails = emailRepository.findTop20ByUserIdOrderByReceivedAtDesc(user.getId());
                    if (!userEmails.isEmpty()) {
                        User.UserRole detectedRole = classificationService.detectUserProfession(userEmails);
                        user.setUserRole(detectedRole);
                        log.info("Auto-detected and updated user {} role to: {}", user.getId(), detectedRole);
                    }
                } catch (Exception e) {
                    log.error("Failed to auto-detect user {} profession: {}", user.getId(), e.getMessage());
                }
            }

            // Update last sync time
            user.setLastSyncedAt(LocalDateTime.now());
            userRepository.save(user);

            log.info("Synced {} new emails, updated read-status of {} existing emails for user {}", newCount, updatedCount, userId);

        } catch (GeneralSecurityException | IOException e) {
            log.error("Gmail sync failed for user {}: {}", userId, e.getMessage());
            throw new NexoraException("Gmail sync failed: " + e.getMessage(), 400);
        } finally {
            activeSyncs.remove(userId);
        }
    }


    private void refreshUserAccessToken(User user) {
        if (user.getGmailRefreshToken() == null) {
            throw new NexoraException("No refresh token available to refresh access token", 401);
        }
        String refreshToken = tokenEncryptor.decrypt(user.getGmailRefreshToken());

        RestTemplate restTemplate = new RestTemplate();
        org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
        headers.setContentType(org.springframework.http.MediaType.APPLICATION_FORM_URLENCODED);

        org.springframework.util.MultiValueMap<String, String> body = new org.springframework.util.LinkedMultiValueMap<>();
        body.add("client_id", gmailConfig.getClientId());
        body.add("client_secret", gmailConfig.getClientSecret());
        body.add("refresh_token", refreshToken);
        body.add("grant_type", "refresh_token");

        org.springframework.http.HttpEntity<org.springframework.util.MultiValueMap<String, String>> request =
                new org.springframework.http.HttpEntity<>(body, headers);

        try {
            @SuppressWarnings("rawtypes")
            org.springframework.http.ResponseEntity<Map> response = restTemplate.postForEntity(
                    "https://oauth2.googleapis.com/token", request, Map.class);
            @SuppressWarnings("unchecked")
            Map<String, Object> responseBody = response.getBody();
            if (responseBody != null && responseBody.containsKey("access_token")) {
                String newAccessToken = (String) responseBody.get("access_token");
                Number expiresIn = (Number) responseBody.get("expires_in");
                long seconds = expiresIn != null ? expiresIn.longValue() : 3600L;

                user.setGmailAccessToken(tokenEncryptor.encrypt(newAccessToken));
                user.setTokenExpiry(LocalDateTime.now().plusSeconds(seconds));
                userRepository.save(user);
                log.info("Successfully refreshed access token for user {}", user.getId());
            } else {
                throw new NexoraException("Google token endpoint response did not contain access_token", 401);
            }
        } catch (Exception e) {
            log.error("Error refreshing token from Google API: {}", e.getMessage());
            throw new NexoraException("Failed to refresh Gmail access token: " + e.getMessage(), 401);
        }
    }

    private Message fetchWithRetry(Gmail gmail, String messageId) {
        int attempt = 0;
        while (attempt < MAX_RETRIES) {
            try {
                return gmail.users().messages().get("me", messageId)
                        .setFormat("FULL").execute();
            } catch (GoogleJsonResponseException e) {
                if (e.getStatusCode() == 403) {
                    log.warn("Gmail API rejected FULL format for message {} (likely metadata scope restriction). Retrying in METADATA format...", messageId);
                    try {
                        return gmail.users().messages().get("me", messageId)
                                .setFormat("METADATA")
                                .setMetadataHeaders(Arrays.asList("Subject", "From", "To", "Date"))
                                .execute();
                    } catch (IOException ex) {
                        log.error("Failed to fetch message details in METADATA format: {}", ex.getMessage());
                        return null;
                    }
                } else if (e.getStatusCode() == 429) {
                    attempt++;
                    long waitMs = (long) Math.pow(2, attempt) * 1000;
                    log.warn("Rate limited — waiting {}ms before retry {}", waitMs, attempt);
                    sleep(waitMs);
                } else {
                    log.error("Gmail API error for message {}: {}", messageId, e.getMessage());
                    return null;
                }
            } catch (IOException e) {
                log.error("IO error fetching message {}: {}", messageId, e.getMessage());
                return null;
            }
        }
        return null;
    }

    private Email parseMessage(Message message, User user) {
        MessagePart payload = message.getPayload();
        List<MessagePartHeader> headers = payload != null ? payload.getHeaders() : new java.util.ArrayList<>();
 
        String subject    = getHeader(headers, "Subject");
        String from       = getHeader(headers, "From");
        boolean hasAttach = payload != null && hasAttachments(payload);
 
        String[] fromParts   = parseFrom(from);
        String senderName    = fromParts[0];
        String senderEmail   = fromParts[1];
        LocalDateTime received = parseDate(message.getInternalDate());
 
        String bodyText = payload != null ? extractBody(payload) : "";
        String snippet  = message.getSnippet();
 
        boolean isRead = message.getLabelIds() == null || !message.getLabelIds().contains("UNREAD");
 
        return Email.builder()
                .user(user)
                .gmailMessageId(message.getId())
                .gmailThreadId(message.getThreadId())
                .senderName(senderName)
                .senderEmail(senderEmail)
                .subject(subject)
                .bodySnippet(snippet != null && snippet.length() > 500 ? snippet.substring(0, 500) : (snippet != null ? snippet : ""))
                .bodyFull(bodyText)
                .receivedAt(received)
                .isRead(isRead)
                .hasAttachments(hasAttach)
                .category(Email.EmailCategory.UNCATEGORIZED)
                .priority(Email.Priority.MEDIUM)
                .build();
    }

    // ─── Parsing helpers ─────────────────────────────────────────────────────

    private String getHeader(List<MessagePartHeader> headers, String name) {
        if (headers == null) return "";
        return headers.stream()
                .filter(h -> h != null && h.getName() != null && h.getName().equalsIgnoreCase(name))
                .map(h -> h.getValue())
                .findFirst()
                .orElse("");
    }

    private String[] parseFrom(String from) {
        // "Name <email@domain.com>" or just "email@domain.com"
        if (from.contains("<")) {
            String name  = from.substring(0, from.indexOf("<")).trim().replaceAll("\"", "");
            String email = from.substring(from.indexOf("<") + 1, from.indexOf(">")).trim();
            return new String[]{name, email};
        }
        return new String[]{"", from.trim()};
    }

    private LocalDateTime parseDate(Long internalDate) {
        if (internalDate == null) return LocalDateTime.now();
        return LocalDateTime.ofInstant(
                Instant.ofEpochMilli(internalDate), ZoneId.systemDefault());
    }

    private String extractBody(MessagePart payload) {
        // Prefer text/plain, fallback to text/html with stripped tags
        String text = extractPart(payload, "text/plain");
        if (text != null && !text.isBlank()) return text;

        String html = extractPart(payload, "text/html");
        if (html != null && !html.isBlank()) {
            return HTML_TAGS.matcher(html).replaceAll(" ").trim();
        }
        return "";
    }

    private String extractPart(MessagePart payload, String mimeType) {
        if (payload == null) return null;

        if (mimeType.equals(payload.getMimeType()) && payload.getBody() != null) {
            String data = payload.getBody().getData();
            if (data != null) return decode(data);
        }

        if (payload.getParts() != null) {
            for (MessagePart part : payload.getParts()) {
                String result = extractPart(part, mimeType);
                if (result != null) return result;
            }
        }
        return null;
    }

    private String decode(String data) {
        try {
            byte[] decoded = Base64.getUrlDecoder().decode(data);
            return new String(decoded, StandardCharsets.UTF_8);
        } catch (Exception e) {
            return "";
        }
    }

    private boolean hasAttachments(MessagePart payload) {
        if (payload.getParts() == null) return false;
        return payload.getParts().stream().anyMatch(p ->
                p.getFilename() != null && !p.getFilename().isEmpty());
    }

    /**
     * Propagates a "mark as read" action back to Gmail by removing the UNREAD label.
     * Called asynchronously after the local DB is updated.
     */
    public void markReadInGmail(Long userId, String gmailMessageId) {
        if (gmailMessageId == null || gmailMessageId.isBlank()) return;

        try {
            User user = userRepository.findById(userId).orElse(null);
            if (user == null || user.getGmailAccessToken() == null) return;
            if ("mock-google-id-123456".equals(user.getGoogleId())) return; // skip mock users

            // Refresh token if close to expiry
            LocalDateTime now = LocalDateTime.now();
            if (user.getTokenExpiry() == null || user.getTokenExpiry().isBefore(now.plusMinutes(5))) {
                refreshUserAccessToken(user);
            }

            String accessToken  = tokenEncryptor.decrypt(user.getGmailAccessToken());
            String refreshToken = tokenEncryptor.decrypt(user.getGmailRefreshToken());
            Date   expiry       = user.getTokenExpiry() != null
                    ? Date.from(user.getTokenExpiry().atZone(ZoneId.systemDefault()).toInstant())
                    : new Date();

            Gmail gmail = gmailConfig.buildGmailService(accessToken, refreshToken, expiry);

            com.google.api.services.gmail.model.ModifyMessageRequest modifyRequest =
                    new com.google.api.services.gmail.model.ModifyMessageRequest();
            modifyRequest.setRemoveLabelIds(List.of("UNREAD"));

            gmail.users().messages().modify("me", gmailMessageId, modifyRequest).execute();
            log.info("Marked Gmail message {} as read for user {}", gmailMessageId, userId);

        } catch (com.google.api.client.googleapis.json.GoogleJsonResponseException e) {
            log.warn("Gmail API error marking message {} as read for user {}: {}", gmailMessageId, userId, e.getDetails());
        } catch (GeneralSecurityException | IOException e) {
            log.error("Failed to mark Gmail message {} as read: {}", gmailMessageId, e.getMessage());
        }
    }

    private void sleep(long ms) {
        try { java.lang.Thread.sleep(ms); } catch (InterruptedException e) { java.lang.Thread.currentThread().interrupt(); }
    }
}
