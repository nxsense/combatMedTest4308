package com.example.demo.analytics.projection;

public interface TestLabelAnalyticsProjection {

    Long getLabelId();

    String getLabelName();

    Long getAttemptsCount();

    Double getAverageScore();

    Double getPassRate();
}