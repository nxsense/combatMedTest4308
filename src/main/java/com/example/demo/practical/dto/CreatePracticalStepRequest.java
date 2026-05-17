package com.example.demo.practical.dto;

public record CreatePracticalStepRequest(
        String title,
        String description,
        Integer stepOrder,
        Boolean critical
) {
}