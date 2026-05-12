package com.example.demo.analytics.dto;

public record CadetPracticalSkillAnalyticsDto(
        Long cadetId,
        String cadetName,
        long totalEvaluations,
        double averageScore,
        long passedCount,
        long failedCount,
        double passRate
) {
}