package com.example.demo.analytics.projection;

public interface WeakLabelAnalyticsProjection {

    Long getLabelId();

    String getLabelName();

    Double getAverageScore();

    Long getAttemptsCount();
}