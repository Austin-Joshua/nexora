package com.nexora.dto.request;

import com.nexora.model.User.UserRole;

public class ProfileUpdateRequest {
    private UserRole userRole;
    private Boolean calendarSyncEnabled;

    public ProfileUpdateRequest() {}

    public ProfileUpdateRequest(UserRole userRole, Boolean calendarSyncEnabled) {
        this.userRole = userRole;
        this.calendarSyncEnabled = calendarSyncEnabled;
    }

    public UserRole getUserRole() {
        return userRole;
    }

    public void setUserRole(UserRole userRole) {
        this.userRole = userRole;
    }

    public Boolean getCalendarSyncEnabled() {
        return calendarSyncEnabled;
    }

    public void setCalendarSyncEnabled(Boolean calendarSyncEnabled) {
        this.calendarSyncEnabled = calendarSyncEnabled;
    }
}
