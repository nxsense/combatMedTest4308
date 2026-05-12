package com.example.demo.scenario.entity;

import com.example.demo.scenario.enums.InjuryMechanism;
import com.example.demo.scenario.enums.InjuryRegion;
import com.example.demo.scenario.enums.InjurySeverity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "scenario_injuries")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ScenarioInjury {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "scenario_id", nullable = false)
    private TrainingScenario scenario;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private InjuryMechanism mechanism;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private InjuryRegion region;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private InjurySeverity severity;

    @Column(name = "active_bleeding", nullable = false)
    private Boolean activeBleeding;

    @Column(name = "airway_compromised", nullable = false)
    private Boolean airwayCompromised;

    @Column(name = "breathing_compromised", nullable = false)
    private Boolean breathingCompromised;

    @Column(name = "consciousness_affected", nullable = false)
    private Boolean consciousnessAffected;

    @Column(columnDefinition = "TEXT")
    private String description;
}