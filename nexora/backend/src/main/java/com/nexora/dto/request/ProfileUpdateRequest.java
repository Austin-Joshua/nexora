package com.nexora.dto.request;

import com.nexora.model.User.UserRole;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ProfileUpdateRequest {
    @NotNull(message = "Role is required")
    private UserRole userRole;
}
