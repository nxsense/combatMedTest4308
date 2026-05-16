package com.example.demo.scenario.entity;

import com.example.demo.scenario.entity.Manipulation;
import com.example.demo.scenario.entity.ScenarioExpectedAction;
import com.example.demo.scenario.entity.ScenarioSession;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "scenario_action_executions")
public class ScenarioActionExecution {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    private ScenarioSession session;

    @ManyToOne(optional = false)
    private ScenarioExpectedAction expectedAction;

    @ManyToOne
    private Manipulation manipulation;

    private Boolean correct;

    private Integer executionMinute;

    private Integer scoreDelta;

    private String notes;

    private LocalDateTime executedAt;
}