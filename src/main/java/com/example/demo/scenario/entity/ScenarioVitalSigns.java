package com.example.demo.scenario.entity;

import com.example.demo.scenario.enums.AVPUScale;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "scenario_vital_signs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ScenarioVitalSigns {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(optional = false)
    @JoinColumn(name = "scenario_id", nullable = false)
    private TrainingScenario scenario;

    @Column(name = "heart_rate")
    private Integer heartRate;

    @Column(name = "systolic_bp")
    private Integer systolicBp;

    @Column(name = "diastolic_bp")
    private Integer diastolicBp;

    @Column(name = "respiratory_rate")
    private Integer respiratoryRate;

    private Integer spo2;

    @Enumerated(EnumType.STRING)
    private AVPUScale consciousnessLevel;

    @Column(name = "skin_condition")
    private String skinCondition;

    @Column(name = "pain_level")
    private Integer painLevel;

}