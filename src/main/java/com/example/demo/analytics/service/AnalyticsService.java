package com.example.demo.analytics.service;

import com.example.demo.analytics.dto.*;

import java.util.List;

public interface AnalyticsService {

    DashboardAnalyticsDto getDashboardAnalytics();

    TestAnalyticsDto getGeneralTestAnalytics();

    CadetTestAnalyticsDto getCadetTestAnalytics(Long cadetId);

    List<TestLabelAnalyticsDto> getLabelAnalytics();

    PracticalSkillAnalyticsDto getGeneralPracticalAnalytics();

    CadetPracticalSkillAnalyticsDto getCadetPracticalAnalytics(Long cadetId);

    List<PracticalSkillLabelAnalyticsDto> getPracticalLabelAnalytics();

    List<WeakLabelAnalyticsDto> getWeakTestLabels(Long cadetId);
}