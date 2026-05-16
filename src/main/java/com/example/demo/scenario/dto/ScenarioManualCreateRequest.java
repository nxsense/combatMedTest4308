package com.example.demo.scenario.dto;

import com.example.demo.scenario.enums.DifficultyLevel;

import java.util.List;
import java.util.Set;

public record ScenarioManualCreateRequest(
        String title,
        String legend,
        String scenarioFlowNotes,
        DifficultyLevel difficultyLevel,
        ScenarioVitalSignsRequest vitalSigns,
        List<ScenarioInjuryRequest> injuries,
        List<ScenarioExpectedActionRequest> expectedActions,
        Set<Long> labelIds,
        String narrative
) {
}