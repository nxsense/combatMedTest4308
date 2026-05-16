package com.example.demo.analytics.controller;

import com.example.demo.analytics.dto.DashboardAnalyticsDto;
import com.example.demo.analytics.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analytics/dashboard")
@RequiredArgsConstructor
public class DashboardAnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public DashboardAnalyticsDto getDashboardAnalytics() {
        return analyticsService.getDashboardAnalytics();
    }
}