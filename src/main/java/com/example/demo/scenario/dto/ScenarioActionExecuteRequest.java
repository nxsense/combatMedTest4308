package com.example.demo.scenario.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ScenarioActionExecuteRequest {

    private Long expectedActionId;

    private Long manipulationId;

    private Integer executionMinute;

    private String notes;
}