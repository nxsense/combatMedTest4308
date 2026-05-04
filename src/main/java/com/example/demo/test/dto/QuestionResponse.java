package com.example.demo.test.dto;

import java.util.List;

public record QuestionResponse(
        Long id,
        String questionText,
        Integer points,
        Integer questionOrder,
        List<AnswerResponse> answers
) {
}