package com.example.demo.practical.dto;

import java.util.List;
import java.util.Set;

public record PracticalSkillResponse(
        Long id,
        String name,
        String description,
        Integer maxScore,
        Set<String> labels,
        List<PracticalStepResponse> steps
) {
}