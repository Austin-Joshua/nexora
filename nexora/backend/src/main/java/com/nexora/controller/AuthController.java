package com.nexora.controller;

import com.nexora.dto.request.ProfileUpdateRequest;
import com.nexora.dto.response.AuthResponse;
import com.nexora.model.User;
import com.nexora.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @Value("${app.cors-allowed-origins}")
    private String corsAllowedOrigins;

    /**
     * Frontend redirects user to:
     * https://accounts.google.com/o/oauth2/v2/auth?client_id=...&redirect_uri=.../api/auth/google/callback&response_type=code&scope=...&access_type=offline&prompt=consent
     *
     * Google then redirects back here with ?code=...
     * We exchange the code, register/load the user, and redirect back to the React app callback page.
     */
    @GetMapping("/google/callback")
    public void googleCallback(
            @RequestParam String code,
            jakarta.servlet.http.HttpServletRequest request,
            jakarta.servlet.http.HttpServletResponse response) throws java.io.IOException {
        
        // Dynamically detect scheme, taking reverse proxies into account
        String scheme = request.getHeader("X-Forwarded-Proto");
        if (scheme != null && !scheme.isEmpty()) {
            scheme = scheme.split(",")[0].trim();
        } else {
            scheme = request.getScheme();
        }

        // Dynamically detect host, taking reverse proxies into account
        String host = request.getHeader("X-Forwarded-Host");
        if (host != null && !host.isEmpty()) {
            host = host.split(",")[0].trim();
        } else {
            host = request.getHeader("Host");
        }
        if (host == null || host.isEmpty()) {
            int port = request.getServerPort();
            host = request.getServerName() + (port == 80 || port == 443 ? "" : ":" + port);
        }

        String dynamicRedirectUri = scheme + "://" + host + request.getRequestURI();

        AuthResponse authResponse = authService.handleGoogleCallback(code, dynamicRedirectUri);
        String frontendBase = corsAllowedOrigins.split(",")[0].trim();

        String redirectUrl = org.springframework.web.util.UriComponentsBuilder.fromHttpUrl(frontendBase + "/auth/callback")
                .queryParam("token", authResponse.getToken())
                .queryParam("onboarding", !authResponse.isOnboardingComplete())
                .queryParam("userId", authResponse.getUserId())
                .queryParam("email", authResponse.getEmail())
                .queryParam("name", authResponse.getName())
                .queryParam("role", authResponse.getUserRole().name())
                .queryParam("picture", authResponse.getProfilePictureUrl())
                .build().toUriString();

        response.sendRedirect(redirectUrl);
    }

    /**
     * Initiate Google OAuth — redirect to Google's consent screen.
     */
    @GetMapping("/google")
    public ResponseEntity<Void> initiateGoogleAuth() {
        // This endpoint is documented but the actual redirect URL is constructed by the frontend
        return ResponseEntity.ok().build();
    }

    @GetMapping("/me")
    public ResponseEntity<AuthResponse> getCurrentUser(@AuthenticationPrincipal User user) {
        AuthResponse response = authService.updateProfile(user.getId(), user.getUserRole());
        return ResponseEntity.ok(response);
    }

    @PutMapping("/profile")
    public ResponseEntity<AuthResponse> updateProfile(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody ProfileUpdateRequest request) {
        AuthResponse response = authService.updateProfile(user.getId(), request.getUserRole());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/revoke")
    public ResponseEntity<Void> revokeAccess(@AuthenticationPrincipal User user) {
        authService.revokeAccess(user.getId());
        return ResponseEntity.ok().build();
    }
}
