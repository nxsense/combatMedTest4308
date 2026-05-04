package com.example.demo.group.dto;

import jakarta.validation.constraints.NotBlank;

import java.util.Set;

public record CreateGroupRequest(
        @NotBlank String name,
        String trainingLevel,
        Long instructorId,
        Set<Long> instructorIds
) {
}