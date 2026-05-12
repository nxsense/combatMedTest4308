package com.example.demo.analytics.projection;

public interface TestAnalyticsProjection {

    Long getTotalAttempts();

    Double getAverageScore();

    Long getPassedCount();

    Long getFailedCount();

    Double getPassRate();
}