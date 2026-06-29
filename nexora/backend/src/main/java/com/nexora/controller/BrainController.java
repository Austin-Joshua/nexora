package com.nexora.controller;

import com.nexora.dto.request.BrainQueryRequest;
import com.nexora.dto.response.BrainQueryResponse;
import com.nexora.model.BrainConversation;
import com.nexora.model.User;
import com.nexora.service.NexoraBrainService;
import io.github.resilience4j.ratelimiter.annotation.RateLimiter;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/brain")
@RequiredArgsConstructor
public class BrainController {

    private final NexoraBrainService brainService;

    @PostMapping("/query")
    @RateLimiter(name = "brain-query", fallbackMethod = "rateLimitFallback")
    public ResponseEntity<BrainQueryResponse> query(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody BrainQueryRequest request) {
        return ResponseEntity.ok(brainService.query(user.getId(), request.getQuery()));
    }

    @GetMapping("/history")
    public ResponseEntity<List<BrainConversation>> getHistory(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(brainService.getHistory(user.getId()));
    }

    public ResponseEntity<BrainQueryResponse> rateLimitFallback(User user, BrainQueryRequest request, Exception ex) {
        return ResponseEntity.status(429).body(
            BrainQueryResponse.builder()
                .answer("You've reached the query limit (20 queries/hour). Please try again later.")
                .build()
        );
    }
}
