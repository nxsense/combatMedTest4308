package com.example.demo.test.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record TestResultResponse(
        Long id,
        Long testId,
        String testTitle,
        Long cadetId,
        String cadetName,
        Integer score,
        Integer maxScore,
        BigDecimal percentage,
        boolean passed,
        LocalDateTime passedAt
) {
}