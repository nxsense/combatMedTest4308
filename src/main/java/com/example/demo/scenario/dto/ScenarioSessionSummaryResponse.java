package com.example.demo.scenario.dto;

import com.example.demo.scenario.enums.SessionStatus;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ScenarioSessionSummaryResponse {

    private Long sessionId;

    private Long scenarioId;

    private String scenarioTitle;

    private Long cadetId;

    private SessionStatus status;

    private Integer totalScore;

    private Integer mistakes;

    private Integer totalActions;

    private Integer correctActions;

    private Integer incorrectActions;

    private Double accuracyPercent;

    private Integer maxScore;
}