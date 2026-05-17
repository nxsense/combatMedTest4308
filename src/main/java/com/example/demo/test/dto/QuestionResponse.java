package com.example.demo.test.dto;

import java.util.List;
import java.util.Set;

public record QuestionResponse(
        Long id,
        String questionText,
        Integer points,
        Integer questionOrder,
        Set<String> labels,
        List<AnswerResponse> answers
) {
}