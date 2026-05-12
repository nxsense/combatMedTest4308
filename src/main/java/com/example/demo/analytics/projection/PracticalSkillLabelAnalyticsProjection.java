package com.example.demo.analytics.projection;

public interface PracticalSkillLabelAnalyticsProjection {

    Long getLabelId();

    String getLabelName();

    Long getEvaluationsCount();

    Double getAverageScore();

    Double getPassRate();
}