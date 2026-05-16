package com.example.demo.scenario.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ScenarioSessionStartRequest {

    private Long scenarioId;

    private Long cadetId;
}