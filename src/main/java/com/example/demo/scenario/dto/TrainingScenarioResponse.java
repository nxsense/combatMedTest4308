package com.example.demo.scenario.dto;

import com.example.demo.scenario.enums.DifficultyLevel;
import com.example.demo.scenario.enums.ScenarioSource;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

public record TrainingScenarioResponse(
        Long id,
        String title,
        String legend,
        String scenarioFlowNotes,
        DifficultyLevel difficultyLevel,
        ScenarioSource source,
        ScenarioVitalSignsResponse vitalSigns,
        List<ScenarioExpectedActionResponse> expectedActions,
        Set<String> labels,
        LocalDateTime createdAt
) {
}