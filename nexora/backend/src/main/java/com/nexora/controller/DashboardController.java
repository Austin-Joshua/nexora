package com.nexora.controller;

import com.nexora.dto.response.DashboardSummaryResponse;
import com.nexora.model.User;
import com.nexora.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/summary")
    public ResponseEntity<DashboardSummaryResponse> getSummary(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(dashboardService.getSummary(user.getId()));
    }
}
