package com.example.demo.test.dto;

import java.util.List;

public record CreateQuestionRequest(
        String questionText,
        Integer points,
        Integer questionOrder,
        List<CreateAnswerRequest> answers
) {
}