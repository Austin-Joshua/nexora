package com.nexora.dto.request;

import com.nexora.model.User.UserRole;
import lombok.Data;

@Data
public class ProfileUpdateRequest {
    private UserRole userRole;
    private Boolean calendarSyncEnabled;
}
