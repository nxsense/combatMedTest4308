package com.example.demo.instructor.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateInstructorRequest(
        @NotNull Long userId,
        @NotBlank String firstName,
        @NotBlank String lastName,
        String rank,
        String specialization
) {
}