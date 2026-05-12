package com.example.demo.scenario.entity;

import com.example.demo.scenario.enums.ExpectedActionType;
import com.example.demo.scenario.enums.TcccStage;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "scenario_expected_actions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ScenarioExpectedAction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "scenario_id", nullable = false)
    private TrainingScenario scenario;

    @Enumerated(EnumType.STRING)
    @Column(name = "tccc_stage", nullable = false)
    private TcccStage tcccStage;

    @Enumerated(EnumType.STRING)
    @Column(name = "action_type", nullable = false)
    private ExpectedActionType actionType;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @ManyToOne
    @JoinColumn(name = "manipulation_id")
    private Manipulation manipulation;

    @Column(name = "priority_order", nullable = false)
    private Integer priorityOrder;

    @Column(nullable = false)
    private Boolean critical;

    @Column(columnDefinition = "TEXT")
    private String rationale;
}