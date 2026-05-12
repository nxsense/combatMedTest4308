package com.example.demo.analytics.dto;

public record WeakLabelAnalyticsDto(
        Long labelId,
        String labelName,
        double averageScore,
        long attemptsCount
) {
}