package com.example.demo.scenario.entity;

import com.example.demo.test.entity.Label;
import com.example.demo.scenario.enums.DifficultyLevel;
import com.example.demo.scenario.enums.ScenarioSource;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "training_scenarios")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TrainingScenario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String legend;

    @Column(name = "scenario_flow_notes", columnDefinition = "TEXT")
    private String scenarioFlowNotes;

    @Enumerated(EnumType.STRING)
    @Column(name = "difficulty_level", nullable = false)
    private DifficultyLevel difficultyLevel;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ScenarioSource source;

    @OneToMany(
            mappedBy = "scenario",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private Set<ScenarioInjury> injuries = new HashSet<>();

    @OneToOne(
            mappedBy = "scenario",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private ScenarioVitalSigns vitalSigns;

    @OneToMany(
            mappedBy = "scenario",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private Set<ScenarioExpectedAction> expectedActions = new HashSet<>();

    @ManyToMany
    @JoinTable(
            name = "training_scenario_labels",
            joinColumns = @JoinColumn(name = "scenario_id"),
            inverseJoinColumns = @JoinColumn(name = "label_id")
    )
    private Set<Label> labels = new HashSet<>();

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    void onCreate() {

        createdAt = LocalDateTime.now();

        if (source == null) {
            source = ScenarioSource.MANUAL;
        }
    }
}