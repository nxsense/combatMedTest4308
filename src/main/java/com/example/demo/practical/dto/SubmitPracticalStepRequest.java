package com.example.demo.practical.dto;

public record SubmitPracticalStepRequest(
        Long stepId,
        String status,
        Integer score,
        String comment
) {
}