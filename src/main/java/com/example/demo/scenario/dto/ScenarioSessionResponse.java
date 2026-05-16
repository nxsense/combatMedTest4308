package com.example.demo.scenario.dto;

import com.example.demo.scenario.enums.SessionStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class ScenarioSessionResponse {

    private Long id;

    private Long scenarioId;

    private Long cadetId;

    private SessionStatus status;

    private Integer currentMinute;

    private Integer totalScore;

    private Integer mistakes;

    private LocalDateTime startedAt;

    private LocalDateTime finishedAt;
}