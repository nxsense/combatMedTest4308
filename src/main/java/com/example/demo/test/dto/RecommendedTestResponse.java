package com.example.demo.test.dto;

public record RecommendedTestResponse(
        Long id,
        String title,
        double priorityScore,
        String reason
) {
}