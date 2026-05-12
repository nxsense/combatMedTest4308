package com.example.demo.analytics.dto;

public record CadetTestAnalyticsDto(
        Long cadetId,
        String cadetName,
        long totalAttempts,
        double averageScore,
        long passedCount,
        long failedCount,
        double passRate
) {
}