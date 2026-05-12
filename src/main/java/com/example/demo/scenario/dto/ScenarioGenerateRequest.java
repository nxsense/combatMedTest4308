package com.example.demo.scenario.dto;

import com.example.demo.scenario.enums.DifficultyLevel;

import java.util.List;
import java.util.Set;

public record ScenarioGenerateRequest(
        String title,
        DifficultyLevel difficultyLevel,
        List<ScenarioInjuryRequest> injuries,
        Set<Long> labelIds
) {
}