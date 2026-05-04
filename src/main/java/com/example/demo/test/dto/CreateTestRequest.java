package com.example.demo.test.dto;

import java.util.List;
import java.util.Set;

public record CreateTestRequest(
        String title,
        String description,
        Set<Long> labelIds,
        List<CreateQuestionRequest> questions
) {
}