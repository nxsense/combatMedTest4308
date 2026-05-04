package com.example.demo.practical.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "practical_step_evaluations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PracticalStepEvaluation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "result_id", nullable = false)
    private PracticalResult result;

    @ManyToOne
    @JoinColumn(name = "step_id", nullable = false)
    private PracticalStep step;

    private String status; // DONE / PARTIAL / FAILED

    private Integer score;

    private String comment;
}