package com.nexora.dto.response;

import com.nexora.model.User.UserRole;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String tokenType;
    private Long userId;
    private String email;
    private String name;
    private String profilePictureUrl;
    private UserRole userRole;
    private boolean onboardingComplete;
}
