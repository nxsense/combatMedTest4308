package com.example.demo.cadet.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateCadetRequest(
        @NotNull Long userId,
        Long groupId,
        @NotBlank String firstName,
        @NotBlank String lastName,
        String rank,
        String serviceNumber
) {
}