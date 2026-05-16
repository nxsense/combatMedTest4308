package com.example.demo.scenario.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ScenarioActionExecutionResponse {

    private Long id;

    private Long sessionId;

    private Long expectedActionId;

    private Long manipulationId;

    private Boolean correct;

    private Integer executionMinute;

    private Integer scoreDelta;

    private String notes;
}