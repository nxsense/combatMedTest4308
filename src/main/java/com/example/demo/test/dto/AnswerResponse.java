package com.example.demo.test.dto;

public record AnswerResponse(
        Long id,
        String answerText,
        boolean correct,
        Integer answerOrder
) {
}

