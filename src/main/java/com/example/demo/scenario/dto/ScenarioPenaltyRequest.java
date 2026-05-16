package com.example.demo.scenario.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ScenarioPenaltyRequest {

    private Integer points;

    private String reason;
}