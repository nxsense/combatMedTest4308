package com.example.demo.analytics.dto;

public record TestAnalyticsDto(
        long totalAttempts,
        double averageScore,
        long passedCount,
        long failedCount,
        double passRate
) {
}