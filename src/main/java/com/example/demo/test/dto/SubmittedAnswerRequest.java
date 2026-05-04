package com.example.demo.test.dto;

public record SubmittedAnswerRequest(
        Long questionId,
        Long answerId
) {
}