package com.example.demo.practical.dto;

public record WeakLabelResponse(
        String labelName,
        double averageScore,
        double priority
) {}