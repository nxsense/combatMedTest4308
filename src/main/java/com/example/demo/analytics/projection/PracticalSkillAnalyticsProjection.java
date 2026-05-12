package com.example.demo.analytics.projection;

public interface PracticalSkillAnalyticsProjection {

    Long getTotalEvaluations();

    Double getAverageScore();

    Long getPassedCount();

    Long getFailedCount();

    Double getPassRate();
}