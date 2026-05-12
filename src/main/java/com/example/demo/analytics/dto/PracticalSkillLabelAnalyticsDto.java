package com.example.demo.analytics.dto;

public record PracticalSkillLabelAnalyticsDto(
        Long labelId,
        String labelName,
        long evaluationsCount,
        double averageScore,
        double passRate
) {
}