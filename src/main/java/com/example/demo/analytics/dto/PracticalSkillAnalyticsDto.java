package com.example.demo.analytics.dto;

public record PracticalSkillAnalyticsDto(
        long totalEvaluations,
        double averageScore,
        long passedCount,
        long failedCount,
        double passRate
) {
}