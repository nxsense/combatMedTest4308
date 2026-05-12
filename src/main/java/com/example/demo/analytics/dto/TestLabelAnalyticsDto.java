package com.example.demo.analytics.dto;
public record TestLabelAnalyticsDto(
        Long labelId,
        String labelName,
        long attemptsCount,
        double averageScore,
        double passRate
) {
}