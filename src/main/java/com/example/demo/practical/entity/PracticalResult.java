package com.example.demo.practical.entity;

import com.example.demo.cadet.entity.Cadet;
import com.example.demo.instructor.entity.Instructor;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "practical_results")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PracticalResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "skill_id", nullable = false)
    private PracticalSkill skill;

    @ManyToOne
    @JoinColumn(name = "cadet_id", nullable = false)
    private Cadet cadet;

    @ManyToOne
    @JoinColumn(name = "instructor_id", nullable = false)
    private Instructor instructor;

    @Column(name = "total_score")
    private Integer totalScore;

    @Column(name = "max_score")
    private Integer maxScore;

    private BigDecimal percentage;

    @Column(name = "result_status")
    private String resultStatus;

    private String comment;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @OneToMany(mappedBy = "result", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PracticalStepEvaluation> evaluations;
}