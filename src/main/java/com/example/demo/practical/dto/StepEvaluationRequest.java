package com.example.demo.practical.dto;

public record StepEvaluationRequest(
        Long stepId,
        String status, // DONE / PARTIAL / FAILED
        Integer score,
        String comment
) {}