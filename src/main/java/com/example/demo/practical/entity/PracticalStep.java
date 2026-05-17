package com.example.demo.practical.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "practical_steps")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PracticalStep {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "skill_id", nullable = false)
    private PracticalSkill skill;

    @Column(name = "step_order")
    private Integer stepOrder;

    @Column(name = "step_name")
    private String stepName;

    private String description;

    @Column(name = "max_score")
    private Integer maxScore;

    @Column(name = "is_critical")
    private Boolean critical = false;
}