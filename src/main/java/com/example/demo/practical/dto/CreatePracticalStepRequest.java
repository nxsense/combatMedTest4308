package com.example.demo.practical.dto;

public record CreatePracticalStepRequest(
        Integer order,
        String name,
        String description,
        Integer maxScore,
        boolean critical
) {}