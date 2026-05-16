package com.example.demo.scenario.entity;

import com.example.demo.cadet.entity.Cadet;
import com.example.demo.scenario.entity.TrainingScenario;
import com.example.demo.scenario.enums.SessionStatus;
import jakarta.persistence.*;
import lombok.*;



import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "scenario_sessions")
public class ScenarioSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    private TrainingScenario scenario;

    @ManyToOne(optional = false)
    private Cadet cadet;

    @Enumerated(EnumType.STRING)
    private SessionStatus status;

    @Column(nullable = false)
    private Integer maxScore = 0;

    private Integer currentMinute;

    private Integer totalScore;

    private Integer mistakes;

    private LocalDateTime startedAt;

    private LocalDateTime finishedAt;
}