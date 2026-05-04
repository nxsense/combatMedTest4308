package com.example.demo.test.dto;

public record CreateAnswerRequest(
        String answerText,
        boolean correct,
        Integer answerOrder
) {
}