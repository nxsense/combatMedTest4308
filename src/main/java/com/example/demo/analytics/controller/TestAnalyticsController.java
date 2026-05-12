package com.example.demo.analytics.controller;

import com.example.demo.analytics.dto.CadetTestAnalyticsDto;
import com.example.demo.analytics.dto.TestAnalyticsDto;
import com.example.demo.analytics.dto.TestLabelAnalyticsDto;
import com.example.demo.analytics.dto.WeakLabelAnalyticsDto;
import com.example.demo.analytics.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/analytics/tests")
@RequiredArgsConstructor
public class TestAnalyticsController {
    private final AnalyticsService analyticsService;
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'INSTRUCTOR')")
    public TestAnalyticsDto getGeneralAnalytics() {
        return analyticsService.getGeneralTestAnalytics();
    }

    @GetMapping("/cadets/{cadetId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'INSTRUCTOR', 'CADET')")
    public CadetTestAnalyticsDto getCadetAnalytics(
            @PathVariable Long cadetId
    ) {
        return analyticsService.getCadetTestAnalytics(cadetId);
    }

    @GetMapping("/labels")
    @PreAuthorize("hasAnyRole('ADMIN', 'INSTRUCTOR')")
    public List<TestLabelAnalyticsDto> getLabelAnalytics() {
        return analyticsService.getLabelAnalytics();
    }

    @GetMapping("/cadets/{cadetId}/weak-labels")
    @PreAuthorize("hasAnyRole('ADMIN', 'INSTRUCTOR', 'CADET')")
    public List<WeakLabelAnalyticsDto>
    getWeakLabels(
            @PathVariable Long cadetId
    ) {
        return analyticsService
                .getWeakTestLabels(cadetId);
    }

}
