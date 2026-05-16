package com.example.demo.scenario.dto;

import com.example.demo.scenario.enums.ExpectedActionType;
import com.example.demo.scenario.enums.TcccStage;

public record ScenarioExpectedActionResponse(
        Long id,
        TcccStage tcccStage,
        ExpectedActionType actionType,
        String title,
        String description,
        Integer priorityOrder,
        Boolean critical,
        String rationale,
        Long manipulationId,
        String manipulationCode,
        String manipulationTitle
) {
}