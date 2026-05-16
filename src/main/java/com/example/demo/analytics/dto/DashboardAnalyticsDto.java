package com.example.demo.analytics.dto;

public record DashboardAnalyticsDto(
        long totalCadets,
        long totalInstructors,
        long totalScenarios,
        long activeSessions,
        long completedSessions,
        long failedSessions,
        double averageScenarioScore,
        long completedTests,
        double averageTestScore,
        double testPassRate,
        long practicalEvaluations,
        double averagePracticalScore,
        double practicalPassRate
) {
}