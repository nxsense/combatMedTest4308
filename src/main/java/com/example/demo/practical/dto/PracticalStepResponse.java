package com.example.demo.practical.dto;

public record PracticalStepResponse(
        Long id,
        String title,
        String description,
        Integer stepOrder,
        Boolean critical,
        Integer maxScore
) {
}