package com.example.demo.test.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public record CadetAnalyticsResponse(
        Long cadetId,
        String cadetName,
        BigDecimal averageScore,
        Map<String, BigDecimal> labelPerformance,
        List<String> weakLabels,
        List<String> recommendations
) {
}