package com.example.demo.analytics.controller;

import com.example.demo.analytics.dto.CadetPracticalSkillAnalyticsDto;
import com.example.demo.analytics.dto.PracticalSkillAnalyticsDto;
import com.example.demo.analytics.dto.PracticalSkillLabelAnalyticsDto;
import com.example.demo.analytics.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/analytics/practical-skills")
@RequiredArgsConstructor
public class PracticalAnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'INSTRUCTOR')")
    public PracticalSkillAnalyticsDto getGeneralPracticalAnalytics() {
        return analyticsService.getGeneralPracticalAnalytics();
    }

    @GetMapping("/cadets/{cadetId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'INSTRUCTOR', 'CADET')")
    public CadetPracticalSkillAnalyticsDto getCadetPracticalAnalytics(
            @PathVariable Long cadetId
    ) {
        return analyticsService.getCadetPracticalAnalytics(cadetId);
    }

    @GetMapping("/labels")
    @PreAuthorize("hasAnyRole('ADMIN', 'INSTRUCTOR')")
    public List<PracticalSkillLabelAnalyticsDto> getPracticalLabelAnalytics() {
        return analyticsService.getPracticalLabelAnalytics();
    }
}