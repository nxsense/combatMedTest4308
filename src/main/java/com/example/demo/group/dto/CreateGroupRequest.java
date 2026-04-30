package com.example.demo.group.dto;

import jakarta.validation.constraints.NotBlank;

public record CreateGroupRequest(
        @NotBlank String name,
        String trainingLevel,
        Long instructorId
) {
}