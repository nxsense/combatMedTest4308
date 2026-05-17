package com.example.demo.practical.dto;

import java.util.List;
import java.util.Set;

public record CreatePracticalSkillRequest(
        String name,
        String description,
        List<CreatePracticalStepRequest> steps,
        Set<Long> labelIds
) {
}