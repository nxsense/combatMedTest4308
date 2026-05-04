package com.example.demo.test.dto;

import jakarta.validation.constraints.NotBlank;

public record CreateLabelRequest(
        @NotBlank String name
) {
}