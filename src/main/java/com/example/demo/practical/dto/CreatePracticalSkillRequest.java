package com.example.demo.practical.dto;

import java.util.List;

public record CreatePracticalSkillRequest(
        String name,
        String description,
        List<CreatePracticalStepRequest> steps,
        List<Long> labelIds
) {}