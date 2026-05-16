package com.example.demo.scenario.dto;

import com.example.demo.scenario.enums.ExpectedActionType;
import com.example.demo.scenario.enums.TcccStage;

public record ScenarioExpectedActionRequest(
        TcccStage tcccStage,
        ExpectedActionType actionType,
        String title,
        String description,
        Long manipulationId,
        Integer priorityOrder,
        Boolean critical,
        String rationale
) {
}