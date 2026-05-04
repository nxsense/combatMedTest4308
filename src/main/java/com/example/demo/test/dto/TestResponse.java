package com.example.demo.test.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

public record TestResponse(
        Long id,
        String title,
        String description,
        Integer maxScore,
        LocalDateTime createdAt,
        Set<String> labels,
        List<QuestionResponse> questions
) {
}